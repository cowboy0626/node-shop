const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductListPage);
router.get('/products/:productId', shopController.getProductDetailPage);

router.get('/cart', shopController.getCartPage);
router.post('/cart', shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-order', shopController.postOrder);
router.get('/orders', shopController.getOrderListPage);

module.exports = router 