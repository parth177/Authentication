const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/authentication');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'error'));

db.once('open', function () {
  console.log('working');
});

module.exports = db;
