const userController = require('../controllers/userController');
const homeController = require('../controllers/homeController');
const passport = require('passport');

const express = require('express');

const router = express.Router();
router.get('/login', homeController.home);
router.get('/signup', userController.signup);
router.post('/signup', userController.newUser);

router.post(
  '/login',
  passport.authenticate('local', { failureRedirect: '/user/login' }),
  userController.login
);

router.get('/logout', (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.toastr.success('logout successfully..');
    res.redirect('/user/login');
  });
});

router.post('/password-reset', userController.reset_pass);
router.get('/forgot-password', (req, res, next) => {
  return res.render('forgotPassword', { title: 'Forgot password' });
});
router.post('/forgot-password', userController.forgot_pass);

router.get('/reset/:token', userController.resetPass);
router.post('/reset', userController.resetPassword);

module.exports = router;
