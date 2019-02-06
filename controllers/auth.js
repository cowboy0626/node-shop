const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {
  res.render('auth/login', {
    path: '/login', 
    pageTitle: 'Login page'
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5c5a4566626af79c20841be2')
  .then(user => {
    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      console.log(err);
      res.redirect('/');
    });
  })
  .catch(err => console.log(err));
}

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};