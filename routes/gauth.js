const passport = require('passport');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
router.get(
  '/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: '/auth/google/success',
    failureRedirect: '/auth/google/failure',
  })
);

router.get('/google/success', userController.glogin);
router.get(
  '/google/failure',
  passport.authenticate('google', { failureRedirect: '/user/login' }),
  userController.login
);
module.exports = router;
