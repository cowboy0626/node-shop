const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(process.mainModule.filename), 
    'data', 
    'cart.json'
);

module.exports = class Cart { 

    static addProduct(id, price) { 

        // 읽기
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0};
            if (!err) { 
                cart = JSON.parse(fileContent);
            }

            // 분석하기 
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];

            // 새로운 상품추가 및 합계액 증가
            let updatedProduct; 
            if(existingProduct){ 
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else { 
                updatedProduct = { id: id, qty: 1};
                cart.products = [...cart.products, updatedProduct];
            }
            cart.totalPrice = cart.totalPrice + +price
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err);
            });
        });

    }

}