const userController = require('../controllers/userController');
const passport = require('passport');

const express = require('express');

const router = express.Router();
router.get('/', passport.checkAuthentication, userController.login);

module.exports = router;
