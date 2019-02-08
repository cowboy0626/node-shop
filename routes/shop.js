const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/', shopController.getIndexPage);
router.get('/products', shopController.getProductListPage);
router.get('/products/:productId', shopController.getProductDetailPage);

router.get('/cart', isAuth, shopController.getCartPage);
router.post('/cart', isAuth, shopController.postCart);
router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-order', isAuth, shopController.postOrder);
router.get('/orders', isAuth, shopController.getOrderListPage);

module.exports = router 