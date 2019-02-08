const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');

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
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: 'MY SECRET', resave: false, saveUninitialized: false, store: store}));
app.use(csrfProtection);

app.use((req, res, next) => {
  if (!req.session.user){
    return next();
  } 
  User.findById(req.session.user._id)
  .then(user => {
    req.user = user; // mongoose model user
    next();
  })
  .catch(err => console.log(err));
  
});

// Auth와 관련된 값 뷰단으로 일괄전달하기 (routes 전에처리해야 함)
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true})
.then(result => {
  app.listen(3000);
})
.catch(err => console.log(err));
