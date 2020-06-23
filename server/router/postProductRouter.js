const express = require('express');
const router = express.Router();
const { postProductController } = require('../controller');
const {
  postProduct
} = postProductController;

router.post('/post_product/:sellerId', postProduct);

module.exports = router;