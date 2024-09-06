var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var pug = require('pug');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var analyzeRouter = require('./routes/analyzePage');

var app = express();

// view engine setup
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname+'/public'));
app.set('json spaces', 2); // number of spaces for indentation

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/analyze', analyzeRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
