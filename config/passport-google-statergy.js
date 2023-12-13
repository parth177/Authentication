const passport = require('passport');
var GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../models/user');
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '284996151952-ch5pbd539l46pte2dsv02oh309udv5qr.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: '/auth/google/callback',
      passReqToCallback: true,
      scope: ['profile', 'email'],
    },
    async function (request, accessToken, refreshToken, profile, done) {
      const user = await User.findOne({ email: profile.email });
      console.log(profile);
      if (!user) {
        console.log('create');
        User.create({
          name: profile.displayName,
          email: profile.email,
          password: 'a',
          googleId: profile.id,
        }).then((user) => {
          console.log(user);
          return done(null, user);
        });
      } else {
        console.log(user);
        console.log('out');
        return done(null, user);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});
