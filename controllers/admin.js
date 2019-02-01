const Product = require('../models/product');

exports.getProductListPage = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render('admin/product-list', { 
            prods: products,
            pageTitle: 'Admin Product List',
            path: '/admin/products'
        });
    });
};

exports.getAddProductPage = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
};

exports.getEditProductPage = (req, res, next) => {
    const editMode = req.query.edit;
    if(!editMode){
        return res.redirect('/');
    }
    const productId = req.params.productId;
    Product.findById(productId, product => {
        if(!product){
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
           pageTitle: 'Edit Product',
           path: '/admin/edit-product',
           editing: editMode,
           product: product
        });
    });
};

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;

    const product = new Product(null, title, imageUrl, description, price);
    product.save();
    res.redirect('/admin/products');
};

exports.postEditProduct = (req, res, next) => {
    const productId = req.body.productId;
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const newProduct = new Product(productId, title, imageUrl, description, price);
    newProduct.save();
    res.redirect('/admin/products');
};


