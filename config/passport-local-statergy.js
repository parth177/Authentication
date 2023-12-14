const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async function (email, password, done) {
      const user = await User.findOne({ email: email });
      if (user) {
        console.log('passport');
        if (!user || !(await user.comparePassword(password))) {
          return done(null, false);
        }
        console.log(await user.comparePassword(password));
        return done(null, user);
      } else {
        return done(null, false);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id)
    .then((user) => {
      return done(null, user);
    })
    .catch((err) => {
      return done(err);
    });
});

//check user is authenticated
passport.checkAuthentication = function (req, res, next) {
  //if the user is singed in then pass req to next function
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/user/login');
};
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
