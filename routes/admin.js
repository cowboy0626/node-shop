const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();
const isAuth = require('../middleware/is-auth');

router.get('/add-product', isAuth, adminController.getAddProductPage);
router.post('/add-product', isAuth, adminController.postAddProduct);
router.get('/products', isAuth, adminController.getProductListPage);
router.get('/edit-product/:productId', isAuth, adminController.getEditProductPage);
router.post('/edit-product', isAuth, adminController.postEditProduct);
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router