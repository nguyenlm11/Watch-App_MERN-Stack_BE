var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const middlewareController = require('./middleware/middlewareController');

var userRouter = require('./routes/userRouter');
const brandRouter = require('./routes/brandRouter');
const watchRouter = require('./routes/watchRouter');
const authRouter = require('./routes/authRouter');

const SECRET_KEY = '12345-67890-09876-54321';

var app = express();
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//connect DB
const url = 'mongodb://127.0.0.1:27017/watch-app';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to server');
})

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(middlewareController.authenticateJWT);
app.use(middlewareController.setUser);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);
app.use('/brand', brandRouter);
app.use('/auth', authRouter);
app.use('/', watchRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
