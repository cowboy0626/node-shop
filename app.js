const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://temp-user-01:bQnm9Z4EO0ElVYul@cluster0-v087o.mongodb.net/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'MY SECRET', resave: false, saveUninitialized: false, store: store}));

app.use((req, res, next) => {
  if (!req.session.user){
    next();
  } 
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user; // mongoose model user
    next();
  })
  .catch(err => console.log(err));
  
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://temp-user-01:bQnm9Z4EO0ElVYul@cluster0-v087o.mongodb.net/shop?retryWrites=true', {useNewUrlParser: true})
.then(result => {
  User.findOne().then(user => {
    if(!user){
      const user = new User({
        name: 'cowboy0626', 
        email: 'cowboy0626@naver.com',
        cart : {
          items: []
        }
      });
      user.save();
    }
  })
  app.listen(3000);
})
.catch(err => console.log(err));
