const express = require('express');
const path = require('path');
const db = require('./config/mongoose');
const user = require('./models/user');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passpostLocal = require('./config/passport-local-statergy');
const passpostGoogle = require('./config/passport-google-statergy');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const crypto = require('crypto');

const cookieParser = require('cookie-parser');
const toastr = require('express-toastr');
const port = 8000;
const app = express();

app.use(express.urlencoded({ extended: true }));
// extract style and scripts from sub pages into the layout
app.use(cookieParser());
app.use(express.static('./assets'));
app.use(expressLayouts);
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(
  session({
    name: 'Authentications',

    //The secter before deployment to prod
    secret: 'Parth',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongooseConnection: db,
        autoRemove: 'disabled',
      },
      function (err) {
        console.log(err || 'connect-mongodb setup ok ');
      }
    ),
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(toastr());

app.use('/', require('./routes/index'));
app.use('/user', require('./routes/user'));
app.use('/auth', require('./routes/gauth'));
app.listen(port, function (err) {
  if (err) {
    console.log('Error');
  }
  console.log('running');
});
