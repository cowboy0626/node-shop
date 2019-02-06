const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndexPage = (req, res, next) => { 
    Product.find()
    .then(products => {
        console.log('상품목록 : ',products);
        res.render('shop/index', { 
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            isAuthenticated: req.session.isLoggedIn
        });
    })
    .catch(err => {
        console.log(err);
    });

};

exports.getProductListPage = (req, res, next) => {
    Product.find()
    .then(products => {
        res.render('shop/product-list', { 
            prods: products,
            pageTitle: 'All products',
            path: '/products'
        });
    })
    .catch(err => {
        console.log(err);
    });
};

exports.getProductDetailPage = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-detail', { 
            pageTitle: product.title + ' product Detail Page',
            path: '/products',
            product: product
        });
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate() // 이걸 해 주어야 promise return함
    .then(user => {
        console.log(user.cart.items);
        const products = user.cart.items;
        res.render('shop/cart', {
            pageTitle: 'Your Cart',
            path: '/cart',
            products: products
        });
    })
    .catch(err => console.log(err));
};

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(result => {
        console.log(result);        
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    req.user
    .removeFromCart(productId)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(err => console.log(err));
};

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
        // cart에는 productID, 수량만 있으므로 전체 정보 추가
        const products = user.cart.items.map(i => {
            return { quantity: i.quantity, product: {...i.productId._doc}}; // _doc
        });
        const order = new Order({
            user: {
                name: req.user.name,
                userId: req.user // user로만 해도 user.userId를 mongoose가 자동으로 찾아줌 
            },
            products: products
        });
        return order.save();
    })
    .then(result => {
        console.log(result);
        // cart 비우기 
        return req.user.clearCart();
    })
    .then(() => {
        // 이동하기 
        res.render('shop/order-list', {
            pageTitle: 'Your Orders',
            path: '/orders'
        });
    })
    .catch(err => console.log(err));

};

exports.getOrderListPage = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
    .then(orders => {
        res.render('shop/order-list', {
            pageTitle: 'Your Orders',
            path: '/orders',
            orders: orders
        });
    })
    .catch(err => console.log(err));
};

