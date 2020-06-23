const moment = require('moment');
const { dba } = require('../database');
const { userJoin } = require('../utils/users');

module.exports = {
  getBidding: async (req, res) => {
    let { productId, limit, offset } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM bid WHERE product_id = ${productId}`;
    let maxBidSql = `SELECT b.offer, u.username FROM bid b JOIN users u ON b.bidder_id = u.user_id  WHERE product_id = ${productId} ORDER BY offer DESC LIMIT 1`;
    let sql = `
      SELECT 
        u.username,
        b.offer,
        b.time
      FROM bid b
      JOIN users u ON b.bidder_id = u.user_id 
      WHERE product_id = ${productId} 
      ORDER BY b.time DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    try {
      let prevBid = await dba(maxBidSql);
      let response = await dba(sql);
      let total = await dba(countSql);

      if (prevBid.length === 0) {
        res.status(200).send({
          data: response,
          count: total[0].numRows
        });
      } else {
        res.status(200).send({
          data: response,
          count: total[0].numRows,
          highest: prevBid[0].offer,
          highestBidder: prevBid[0].username
        });
      }
    } catch (err) {
      console.log(err.message);
      res.status(500).send(err.message);
    }
  },
  biddingPost: async (req, res) => {
    let { productId, bidder, offer, limit, offset } = req.params;
    let time = moment().format('YYYY-MM-DD HH:mm:ss');
    let countBid = `SELECT COUNT(*) AS countBid FROM bid WHERE bidder_id = ${bidder} && product_id = ${productId}`;
    let countSql = `SELECT COUNT(*) AS numRows FROM bid WHERE bidder_id = ${bidder}`;
    let sql = `
      SELECT 
        u.username,
        b.offer,
        b.time
      FROM bid b
      JOIN users u ON b.bidder_id = u.user_id 
      WHERE product_id = ${productId} 
      ORDER BY b.time DESC
      LIMIT ${limit} OFFSET ${offset}
    `;
    let updateWallet = `UPDATE users SET wallet = (wallet - ${offer}) WHERE user_id = ${bidder}`;
    let walletSql = `SELECT wallet FROM users WHERE user_id = ${bidder}`;
    const user = userJoin(null, null, productId);
    try {
      let count = await dba(countSql);
      let bidCount = await dba(countBid);

      if (!count[0].numRows) {
        let postSql = `INSERT INTO bid (product_id, bidder_id, offer, count, time) VALUES (${productId}, ${bidder}, ${offer}, ${bidCount[0].countBid + 1}, '${time}')`;
        await dba(postSql);
        let response = await dba(sql);
        await dba(updateWallet);
        let wallet = await dba(walletSql);

        req.app.io.emit(`Wallet-${bidder}`, wallet[0].wallet);
        req.app.io.to(user.room).emit('Socket', response);

        res.status(200).send({
          status: 'Post bidding success',
          data: response
        });
      } else {
        let postSql = `INSERT INTO bid (product_id, bidder_id, offer, count, time) VALUES (${productId}, ${bidder}, ${offer}, ${bidCount[0].countBid + 1}, '${time}')`;
        await dba(postSql);
        let response = await dba(sql);
        await dba(updateWallet);
        let wallet = await dba(walletSql);

        req.app.io.emit(`Wallet-${bidder}`, wallet[0].wallet);
        req.app.io.to(user.room).emit('Socket', response);

        res.status(200).send({
          status: 'Post bidding success',
          data: response
        });
      };
    } catch (err) {
      res.status(500).send(err.message);
    }
  }, 
};