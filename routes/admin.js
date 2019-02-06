const path = require('path');
const express = require('express');
const adminController = require('../controllers/admin');
const router = express.Router();

router.get('/add-product', adminController.getAddProductPage);
router.post('/add-product', adminController.postAddProduct);
router.get('/products', adminController.getProductListPage);
router.get('/edit-product/:productId', adminController.getEditProductPage);
router.post('/edit-product', adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router