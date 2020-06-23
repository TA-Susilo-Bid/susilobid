const { dba } = require('../database');
const schedule = require('node-schedule');
const moment = require('moment');
const { transportAwait } = require('../helper/nodemailer');
const { htmlToPdf } = require('../helper/createPdf');

module.exports = {
  getSubmissionAuct: async (req, res) => {
    let { limit, offset, orderBy } = req.params;
    // console.log(orderBy);
    let countSql = `SELECT COUNT(*) AS numRows FROM product`;
    let sql = `
        SELECT 
            p.product_name,
            p.product_id,
            u.username AS seller,
            p.starting_price,
            p.submission_time,
            p.product_desc,
            c.category as category,
            p.due_date,
            p.status,
            p.notes,
            p.image_path
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        JOIN category c ON p.product_category = c.id
        ORDER BY submission_time ${orderBy}
        LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);

      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  confirmSubmission: async (req, res) => {
    let { productId } = req.params;
    let getSql = `SELECT due_date FROM product WHERE product_id = ${productId}`;
    let sql = `UPDATE product SET status = 'Confirm', bid_status = 1 WHERE product_id = ${productId}`;
    try {
      let date = await dba(getSql);
      await dba(sql);
      let time = moment(date[0].due_date).format("YYYY/MM/DD HH:mm:ss");

      schedule.scheduleJob(time, async () => {
        let update = `UPDATE product SET bid_status = 2 WHERE product_id = ${productId}`;
        let BuyerSql = `
          SELECT 
            u.username AS 'buyer',
            u.email AS 'buyerEmail',
            u.phone AS 'buyerPhone',
            b.offer,
            b.bidder_id,
            b.bid_id,
            c.category,
            p.product_desc,
            p.product_name,
            p.due_date
          FROM bid b
          JOIN users u ON b.bidder_id = u.user_id
          JOIN product p ON b.product_id = p.product_id
          JOIN category c ON p.product_category = c.id
          WHERE b.product_id = ${productId} ORDER BY offer DESC LIMIT 1  
        `;
        let sellerSql = `
          SELECT 
            u.username AS 'seller',
            p.seller_id,
            u.email AS 'sellerEmail',
            u.address,
            u.phone AS 'sellerPhone'
          FROM product p
          JOIN users u ON p.seller_id = u.user_id
          WHERE p.product_id = ${productId}`;

        await dba(update);
        console.log(`produk ${productId} expired`);

        let buyerDetail = await dba(BuyerSql);
        let sellerDetail = await dba(sellerSql);

        if (buyerDetail.length !== 0) {
          let { buyer, buyerEmail, buyerPhone, offer, category, product_desc, product_name, due_date, bid_id, bidder_id } = buyerDetail[0];
          let { seller, sellerEmail, address, sellerPhone, seller_id } = sellerDetail[0];
          const invNum = 'INV-' + Math.floor(Math.random() * 1000) + Date.now();

          let pdf = await htmlToPdf({
            invNum,
            createdDate: moment(due_date).format("Do MMMM YYYY"),
            sellerName: seller,
            sellerAddress: address,
            sellerPhone: sellerPhone,
            buyerName: buyer,
            email: buyerEmail,
            buyerPhone: buyerPhone,
            amount: offer.toLocaleString(),
            productName: product_name,
            productDesc: product_desc,
            productCategory: category
          });
          // console.log(pdf.sqlLink);

          // send email buyer
          let mailOptionBuyer = {
            from: 'Admin <arioamri@gmail.com>',
            to: buyerEmail,
            subject: 'Invoice',
            html: `
          <p>Hi, ${buyer},</p>
          <p>SELAMAT, kamu pemenang dari lelang produk ${product_name}</p>
          <p>Product detail: ${product_desc}</p>`,
            attachments: [
              {
                fileName: pdf.sqlLink.split('/invoice/'),
                path: `./public${pdf.sqlLink}`,
                contentType: 'application/pdf'
              }
            ]
          };

          // send email seller
          let mailOptionSeller = {
            from: 'Admin <arioamri@gmail.com>',
            to: sellerEmail,
            subject: 'Invoice',
            html: `
          <p>Hi, ${seller}</p>
          <p>SELAMAT, produk lelang kamu ${product_name} telah terjual</p>
          <p>Product detail: ${product_desc}</p>`,
            attachments: [
              {
                fileName: pdf.sqlLink.split('/invoice/'),
                path: `./public${pdf.sqlLink}`,
                contentType: 'application/pdf'
              }
            ]
          };

          await transportAwait(mailOptionBuyer);
          await transportAwait(mailOptionSeller);

          // insert into bid result table
          let totalCount = `SELECT SUM(count) AS totalCount FROM bid WHERE product_ID = ${productId}`;
          let countBid = await dba(totalCount);
          // console.log(countBid);

          let insertBidResult = `
          INSERT INTO bid_result (bid_id, total_count_bidding, highest_bid, winner_id, seller_id) VALUES (${bid_id}, ${countBid[0].totalCount}, ${offer}, ${bidder_id}, ${seller_id})`;

          await dba(insertBidResult);

          // insert into transaction table
          let getBidResId = `SELECT br.id AS 'bidResultId'
        FROM bid_result br
        JOIN bid b ON br.bid_id = b.bid_id
        JOIN product p ON p.product_id = b.product_id
        WHERE p.product_id = ${productId}`;

          let bidResId = await dba(getBidResId);

          let insertTrx = `
          INSERT INTO transaction (buyer_id, seller_id, date_of_trx, payment_to_seller, payment_to_admin, bid_result_id, status_trx) VALUES (${bidder_id}, ${seller_id}, '${moment(due_date).format("YYYY-MM-DD HH:mm:ss")}', ${offer - (offer * 0.05)}, ${offer * 0.05}, ${bidResId[0].bidResultId}, 'Close')`;

          let trxSql = await dba(insertTrx);
          let insertInvoice = `
          INSERT INTO invoice (invoice_number, invoice_total, invoice_date, trx_id, invoice_pdf) VALUES ('${invNum}', ${offer}, '${moment(due_date).format("YYYY-MM-DD HH:mm:ss")}', ${trxSql.insertId}, '${pdf.sqlLink}')`;

          await dba(insertInvoice);

          let cartSql = `INSERT INTO cart (user_id, bid_result_id, amount) VALUES (${bidder_id}, ${bidResId[0].bidResultId}, ${offer})`;

          await dba(cartSql);

          // update seller wallet
          let sRevenue = `UPDATE users SET wallet = wallet + ${offer - (offer * 0.05)} WHERE user_id = ${seller_id}`;

          await dba(sRevenue);
          // emit ke seller

          // balikin duit yg kalah
          let bidSql = `SELECT bidder_id, MAX(offer) AS offer FROM bid WHERE product_id = 1 GROUP BY bidder_id`;

          let resultBid = await dba(bidSql);

          let returnWallet;
          for (let i = 0; i < resultBid.length; i++) {
            if (i !== 0) {
              returnWallet = `UPDATE users SET wallet = wallet+${resultBid[i].offer} WHERE user_id=${resultBid[i].bidder_id}`;
              await dba(returnWallet);
            }
          }
          console.log('berhasil');
        } else {
          await dba(update);
        }
      });

      let sellerSql = `
        SELECT 
          u.username AS name,
          u.email,
          p.product_name,
          p.product_desc,
          p.submission_time
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        WHERE product_id = ${productId}`;
      let dataSeller = await dba(sellerSql);
      let { name, email, product_name, product_desc, submission_time } = dataSeller[0];
      let url = 'http://localhost:3000/';
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Product Verification',
        html: `
        <p>Dear ${name},</p>
        <p>Congratulation! Pengajuan produk Anda "${product_name}"(${product_desc}) pada tanggal ${submission_time} sudah BERHASIL DISETUJUI.</p>
        <p>Silakan cek produk Anda pada halaman Susilobid melalui link berikut <a href="${url}">Here</a></p>`
      };
      await transportAwait(mailOptions);
      res.status(200).send({
        status: 'Confirmed',
        message: 'Email verification has been sent'
      });
    } catch (err) {
      // console.log('masuk catch')
      res.status(500).send(err.message);
    };
  },
  rejectSubmission: async (req, res) => {
    let { productId, notes } = req.params;
    let sql = `UPDATE product SET status = 'Reject', notes = '${notes}' WHERE product_id = ${productId}`;
    try {
      await dba(sql);
      let sellerSql = `
        SELECT 
          u.username AS name,
          u.email,
          p.product_name,
          p.product_desc,
          p.submission_time,
          p.notes
        FROM product p
        JOIN users u ON p.seller_id = u.user_id
        WHERE product_id = ${productId}`;
      let dataSeller = await dba(sellerSql);
      let { name, email, product_name, product_desc, submission_time } = dataSeller[0];
      let mailOptions = {
        from: 'Admin <arioamri@gmail.com>',
        to: email,
        subject: 'Product Verification',
        html: `
        <p>Dear ${name},</p>
        <p>Sorry! Pengajuan produk Anda "${product_name}"(${product_desc}) pada tanggal ${submission_time} TIDAK DISETUJUI dikarenakan ${notes}</p>`
      };
      await transportAwait(mailOptions);
      res.status(200).send({
        status: 'Submission Rejected',
        message: 'Email verification has been sent'
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  },
  filterSubmissionByStatus: async (req, res) => {
    let { limit, offset, status } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = '${status}'`;
    let sql = `
      SELECT 
        p.product_name,
        p.product_id,
        u.username AS seller,
        p.starting_price,
        p.submission_time,
        p.product_desc,
        c.category as category,
        p.due_date,
        p.status,
        p.notes
      FROM product p
      JOIN users u ON p.seller_id = u.user_id
      JOIN category c ON p.product_category = c.id
      WHERE p.status = '${status}'
      ORDER BY submission_time DESC
      LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch (err) {
      res.status(500).send(err.message);
    };
  }
};