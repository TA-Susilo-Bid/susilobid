const { dba } = require('../database');

module.exports = {
  fetchProduct: async (req, res) => {
    let { limit, offset, orderBy } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' AND bid_status = 1 ORDER BY submission_time ${orderBy}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' AND bid_status = 1 ORDER BY submission_time ${orderBy} LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      // console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchProductActive: async (req, res) => {
    let {  limit, offset,sellerId } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' AND bid_status = 1 AND seller_id=${sellerId} ORDER BY submission_time ASC`;
    let sql = `SELECT c.category, p.product_name, p.starting_price, p.due_date FROM product p JOIN category c ON p.product_category=c.id WHERE status = 'Confirm' AND bid_status = 1 AND seller_id=${sellerId} ORDER BY submission_time ASC LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      // console.log(response)
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      // console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchProductPending: async (req, res) => {
    let {  limit, offset,sellerId } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Pending' AND bid_status = 1 AND seller_id=${sellerId} ORDER BY submission_time ASC`;
    let sql = `SELECT c.category, p.product_name, p.starting_price, p.due_date FROM product p JOIN category c ON p.product_category=c.id WHERE status = 'Pending' AND seller_id=${sellerId} ORDER BY submission_time ASC LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      // console.log(response)
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      // console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchProductFinish: async (req, res) => {
    let {  limit, offset,sellerId } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' AND bid_status = 2 AND seller_id=${sellerId} ORDER BY submission_time ASC`;
    let sql =  `SELECT c.category, p.product_name, t.payment_to_seller, p.due_date FROM product p
    JOIN category c ON p.product_category=c.id
    JOIN bid b ON p.product_id = b.product_id
    JOIN bid_result br ON b.bid_id = br.bid_id
    JOIN transaction t ON br.id = t.bid_result_id
     WHERE status = 'Confirm' AND bid_status = 2 AND p.seller_id=${sellerId} ORDER BY submission_time ASC LIMIT ${limit} OFFSET ${offset}`;
    let sql2 = `SELECT c.category, p.product_name, 0 as payment_to_seller, p.due_date FROM product p JOIN category c ON p.product_category=c.id WHERE status = 'Confirm' AND bid_status = 2 AND seller_id=${sellerId} ORDER BY submission_time ASC LIMIT ${limit} OFFSET ${offset}
    `;
    
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      if (response.length === 0) {
        let result = await dba(sql2);
        console.log(result);
        res.status(200).send({
          data: result,
          count: count[0].numRows
        })
      } else {
        res.status(200).send({
          data: response,
          count: count[0].numRows
        });
      }
      // console.log(response)
    } catch(err) {
      console.log(err.message);
      res.status(500).send(err.message);
    };
  },
  fetchProductById: async (req, res) => {
    let {productId} = req.params;
    let sql = `
      SELECT 
        p.product_id,
        p.product_name,
        u.username AS seller,
        p.starting_price,
        p.product_desc,
        p.due_date,
        p.image_path,
        c.category AS category,
        i.invoice_pdf AS invLink,
        i.invoice_number AS invNum
      FROM product p
      JOIN users u ON p.seller_id = u.user_id
      JOIN category c ON p.product_category = c.id
      LEFT JOIN bid b ON p.product_id = b.product_id
      LEFT JOIN bid_result br ON b.bid_id = br.bid_id
      LEFT JOIN transaction t ON t.bid_result_id = br.id
      LEFT JOIN invoice i ON i.trx_id = t.trx_id
      WHERE p.product_id = ${productId}`;
    try {
      let response = await dba(sql);
      // console.log(response);
      res.status(200).send(response[0]);
    } catch(err) {
      // console.log(err.message);
      res.status(500).send(err.message);
    };
  },
  getCategory: async (req, res) => {
    let sql = `SELECT category FROM category`;
    try {
      let response = await dba(sql);
      res.status(200).send(response);
    } catch(err) {
      res.status(500).send(err.message);
    }
  },
  fetchByCategory: async (req, res) => {
    let { category } = req.params;
    let countSql = `
      SELECT COUNT(*) AS numRows 
      FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE p.status = 'Confirm' && p.bid_status = 1 && c.category = '${category}'
    `;
    let sql = `
      SELECT * FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE p.status = 'Confirm' && p.bid_status = 1 && c.category = '${category}'
    `;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchMinPrice: async (req, res) => {
    let { minPrice } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price >= ${minPrice}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price >= ${minPrice}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchMaxPrice: async (req, res) => {
    let { maxPrice } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price <= ${maxPrice}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price <= ${maxPrice}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByRangePrice: async (req, res) => {
    let {minPrice, maxPrice} = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price >= ${minPrice} && starting_price <= ${maxPrice}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 && starting_price >= ${minPrice} && starting_price <= ${maxPrice}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByCategoryAndPrice: async (req, res) => {
    let { ctg, minPrice, maxPrice } = req.params;
    let countSql = `
      SELECT COUNT(*) AS numRows 
      FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price >= ${minPrice} &&
        p.starting_price <= ${maxPrice}
    `;
    let sql = `
      SELECT * FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price >= ${minPrice} &&
        p.starting_price <= ${maxPrice}
    `;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByCategAndMin: async (req, res) => {
    let { ctg, minPrice } = req.params;
    let countSql = `
      SELECT COUNT(*) AS numRows 
      FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price >= ${minPrice}
    `;
    let sql = `
      SELECT * FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price >= ${minPrice}
    `;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByCategAndMax: async (req, res) => {
    let { ctg, maxPrice } = req.params;
    let countSql = `
      SELECT COUNT(*) AS numRows 
      FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price <= ${maxPrice}
    `;
    let sql = `
      SELECT * FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE 
        p.status = 'Confirm' && 
        p.bid_status = 1 && 
        c.category = '${ctg}' && 
        p.starting_price <= ${maxPrice}
    `;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByName: async (req, res) => {
    let { name } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 && product_desc LIKE '%${name}%'`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 && product_desc LIKE '%${name}%'`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByTime: async (req, res) => {
    let { orderBy } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 ORDER BY submission_time ${orderBy}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 ORDER BY submission_time ${orderBy}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataByPrice: async (req, res) => {
    let { orderBy } = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE status = 'Confirm' && bid_status = 1 ORDER BY starting_price ${orderBy}`;
    let sql = `SELECT * FROM product WHERE status = 'Confirm' && bid_status = 1 ORDER BY starting_price ${orderBy}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    };
  },
  fetchDataCloseBid: async (req, res) => {
    let {limit, offset} = req.params;
    let countSql = `SELECT COUNT(*) AS numRows FROM product WHERE bid_status = 2 ORDER BY submission_time DESC`;
    let sql = `SELECT * FROM product WHERE bid_status = 2 LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  },
  fetchDataCloseCtg: async (req, res) => {
    let {limit, offset, ctg} = req.params;
    let countSql = `
      SELECT COUNT(*) AS numRows 
      FROM product p
      JOIN category c ON p.product_category = c.id
      WHERE p.bid_status = 2 AND c.category = '${ctg}'
      ORDER BY submission_time DESC`;
    let sql = `
      SELECT * FROM product p JOIN category c ON p.product_category = c.id
      WHERE p.bid_status = 2 AND c.category = '${ctg}' ORDER BY submission_time DESC
      LIMIT ${limit} OFFSET ${offset}`;
    try {
      let response = await dba(sql);
      let count = await dba(countSql);
      res.status(200).send({
        data: response,
        count: count[0].numRows
      });
    } catch(err) {
      console.log(err)
      res.status(500).send(err.message);
    }
  },
};