const express = require('express');
const cors = require('cors'); // Import cors module
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const middlewareController = require('./middleware/middlewareController');
const userRouter = require('./routes/userRouter');
const brandRouter = require('./routes/brandRouter');
const watchRouter = require('./routes/watchRouter');
const authRouter = require('./routes/authRouter');

const SECRET_KEY = '12345-67890-09876-54321';

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const url = 'mongodb://127.0.0.1:27017/watch-app';
const connect = mongoose.connect(url);
connect.then((db) => {
  console.log('Connected correctly to server');
});

app.use(cors());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Logging and static files
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Method override for PUT and DELETE methods
app.use(methodOverride('_method'));

// Routes
app.use('/user', userRouter);
app.use('/brand', brandRouter);
app.use('/auth', authRouter);
app.use('/', watchRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
