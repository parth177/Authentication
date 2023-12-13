const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { render } = require('ejs');
const nodemailer = require('nodemailer');

function generateToken() {
  return crypto.randomBytes(20).toString('hex');
}

module.exports.signup = function (req, res) {
  return res.render('signup', {
    title: 'Signup',
  });
};
module.exports.newUser = function (req, res) {
  if (req.body.password != req.body.confirm_password) {
    return res.redirect('back');
  }
  User.findOne({ email: req.body.email })

    .then((user) => {
      if (!user) {
        User.create(req.body)
          .then((user) => {
            console.log(user);
            req.toastr.success('User created successfully..');
            return res.redirect('/');
          })
          .catch((err) => {
            req.toastr.error('Something wents wrong..!!');
            return res.redirect('back');
          });
      } else {
        req.toastr.error('User already exist..!!');
        return res.redirect('back');
      }
    })
    .catch((err) => {
      // Catch any potential error
      console.log(err);
      req.toastr.error('Something wents wrong..!!');
      return res.redirect('back');
    });
};

module.exports.login = async function (req, res) {
  req.toastr.success('logged in successfully..');
  console.log(req.toastr);
  return res.render('index', { title: 'index', user: req.user, req: req });
};

module.exports.glogin = async function (req, res) {
  console.log(req.user);
  req.toastr.success('logged in successfully..');
  return res.render('index', { title: 'index', user: req.user, req: req });
};

module.exports.reset_pass = async function (req, res) {
  const user = await User.findById(req.body.userId);
  if (user) {
    console.log();
    if (await user.comparePassword(req.body.password)) {
      user.password = req.body.newPass;
      await user.save();
      console.log(user);
      res.json({
        type: 'success',
        message: 'Password updated successfully..',
      });
    } else {
      res.json({
        type: 'error',
        message: 'You entered incorrect password..',
      });
    }
  } else {
    res.json({
      type: 'error',
      message: 'Something wents wrong..!!',
    });
  }
};

module.exports.forgot_pass = async function (req, res) {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        type: 'error',
        message: 'User not found..!!',
      });
    }

    const resetToken = generateToken();
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token expiration time (1 hour)

    await user.save();

    // Send email with reset link
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'parthpatthar82@gmail.com', // replace with your Gmail address
        pass: 'ozeqlfolhpjemwxf', // replace with your Gmail password
      },
    });

    const mailOptions = {
      from: 'parthpatthar82@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: http://localhost:8000/user/reset/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.json({
          type: 'error',
          message: 'Error sending email',
        });
      }
      return res.json({
        type: 'success',
        message: 'Email sent with reset instructions',
      });
    });
  } catch (error) {
    console.error(error);
    return res.json({
      type: 'error',
      message: 'Something wents wrong..!!',
    });
  }
};

module.exports.resetPass = async function (req, res) {
  const { token } = req.params;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.send('Invalid or expired token');
    } else {
      // user.resetPasswordToken = undefined;
      // user.resetPasswordExpires = undefined;
      await user.save();
      console.log(user);
      return res.render('resetPassword', {
        user: user,
        title: 'Reset password',
      });
    }
    // Update password
  } catch (error) {
    console.error(error);
  }
};

module.exports.resetPassword = async function (req, res) {
  const user = await User.findById(req.body.userId);
  if (user) {
    user.password = req.body.newPass;
    await user.save();
    return res.render('home', {
      title: 'Home',
      msg: 'Password changed successfully..',
    });
  }
};
