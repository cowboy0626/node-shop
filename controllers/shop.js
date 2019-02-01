const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndexPage = (req, res, next) => { 
    Product.fetchAll((products) => {
        res.render('shop/index', { 
            prods: products,
            pageTitle: 'Shop',
            path: '/'
        });
    });
};

exports.getProductListPage = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('shop/product-list', { 
            prods: products,
            pageTitle: 'Shop',
            path: '/products'
        });
    });
};

exports.getProductDetailPage = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-detail', { 
            pageTitle: 'Product Detail Page',
            path: '/products',
            product: product
        });
    });

};

exports.getCartPage = (req, res, next) => {
    res.render('shop/cart', {
        pageTitle: 'Your Cart',
        path: '/cart'
    });
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price);
    });
    res.redirect('/cart');
}

exports.getOrderListPage = (req, res, next) => {
    res.render('shop/order-list', {
        pageTitle: 'Your Orders',
        path: '/orders'
    });
};

exports.getCheckoutPage = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout'
    });
};

