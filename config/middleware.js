module.exports.setFlash = function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  console.log('set flash');
  next();
};
