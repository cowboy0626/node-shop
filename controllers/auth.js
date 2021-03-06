const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLoginPage = (req, res, next) => {
  let message = req.flash('login-error');
  if(message.length >0){
    message = message[0];
  } else { 
    message = null;
  }
  res.render('auth/login', {
    path: '/login', 
    pageTitle: 'Login page',
    errorMessage: message
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email: email})
  .then(user => {
    if(!user){
      req.flash('login-error', 'Invalid email or password');
      return res.redirect('/login');
    }
    // validation password and check login
    bcrypt
    .compare(password, user.password)
    .then(doMatch => {
      if(doMatch){
        req.session.isLoggedIn = true;
        req.session.user = user;
        return req.session.save(err => { // redirect와 같이 시간차가 있는 경우 save()를 이용해서 명확히 처리 후 이동함
          console.log(err);
          res.redirect('/');
        });
      }
      req.flash('login-error', 'Invalid email or password');
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    });
  })
  .catch(err => console.log(err));
}

exports.getSignupPage = (req, res, next) => {
  let message = req.flash('signup-error');
  if(message.length >0){
    message = message[0];
  } else { 
    message = null;
  }
  res.render('auth/signup', {
    pageTitle: 'Sign up',
    path: '/signup',
    errorMessage: message
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // validation


  // Create new user after checking email existing
  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc){
      req.flash('signup-error', 'Email exist already, please pick another email');
      return res.redirect('/signup');
    }
    return bcrypt.hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,// decrypt 할 수 없음 
        cart: { items: []} 
      });
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    });
  })
  .catch(err => {
    console.log(err);
  })
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
