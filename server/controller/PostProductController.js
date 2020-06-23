const moment = require('moment');
const { uploader } = require('../helper/uploader');
const schedule = require('node-schedule');
const { dba, db } = require('../database');

module.exports = {
  postProduct: (req, res) => {
    try{
      const path = '/product';
      const upload = uploader(path, "PRD").fields([{ name: "imageProduct" }]);
      upload(req, res, async (err) => {
        // if (err){
        //   console.log(err)
        // }
        let {sellerId} = req.params;
        let {category, name, desc, price, due_date} = req.body;
        let { imageProduct } = req.files;
        console.log(req.files)
        let time = moment().format('YYYY-MM-DD HH:mm:ss');
        const imagePath = imageProduct ? `${path}/${imageProduct[0].filename}` : null;
        let sql = `
          insert into product (seller_id,product_category,product_name,product_desc,starting_price,submission_time,due_date,image_path)
          values (${sellerId},${category},'${name}','${desc}',${price},'${time}','${due_date}','${imagePath}')
        `;
        await dba(sql);
        res.status(201).send({
          status: "Success",
          message: "Thank you! Please wait while we verify your product max 1x24 hours"
        });
      });
      } catch(err) {
        console.log(err.message);
        res.status(500).send(err.message);
      }
  },
  // postProduct: async (req, res) => {
  //   let {category, name, desc, price, due_date, image} = req.body;
  //   let {sellerId} = req.params;
  //   let time = moment().format('YYYY-MM-DD HH:mm:ss');
  //   let sql = `
  //     insert into product (seller_id,product_category,product_name,product_desc,starting_price,submission_time,due_date,image_path)
  //     values (${sellerId},${category},'${name}','${desc}',${price},'${time}','${due_date}','${image}')
  //   `;
  //   db.query(sql, (err,results) => {
  //       if(err){
  //           console.log(err)
  //           res.status(500).send(err.message)
  //       }
  //       res.status(200).send({message: 'data submitted'})
  //   })
  // },
};