const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  name : {
    type: String,
    required: true
  },
  email : { 
    type: String,
    required: true
  },
  cart: { 
    items: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true}, 
        quantity: { type: Number, required: true}
      }
    ]
  }
});

// utility method : 스키마 기능은 반드시 function()으로 정의되어야 함 
userSchema.methods.addToCart = function(product){
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];
  if(cartProductIndex >= 0) {
    // 기존상품이 있을 때 
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else { 
    // 기존상품이 없을 때 
    updatedCartItems.push({
      productId: product._id, // mongoose가 자동으로 오브젝트ID로 맵핑함 
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCartItems
  };
  this.cart = updatedCart;
  return this.save();

};

userSchema.methods.removeFromCart = function(productId){
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function(){
  this.cart = {items: []};
  return this.save();
}


module.exports = mongoose.model('User', userSchema);