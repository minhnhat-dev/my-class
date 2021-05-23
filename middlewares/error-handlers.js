const createError = require('http-errors');

function errorMiddleware(error, req, res, next) {
  console.error(error);
  // set locals, only providing error in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.send(error);
}

module.exports = {
  errorMiddleware,
};
