var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate')
var config = require('./config');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require("./routes/dishRouter");
var uploadRouter = require('./routes/uploadRouter');
var favouriteRouter = require('./routes/favouriteRouter');
var resRouter = require('./routes/resRouter');
var volRouter = require('./routes/volRouter');
var volFoodRouter = require('./routes/volFoodRouter');
var volInfoRouter = require('./routes/volInfoRoututer');
var otherRouter = require('./routes/otherRouter')


var app = express();


app.use('/', indexRouter);



const mongoose = require('mongoose');
const Dishes = require('./models/dishes');
const url = config.mongoUrl;
const connect = mongoose.connect(url, {useNewUrlParser: true});

connect.then((db) => {
    console.log('Connected correctly to server');

}, (err) => {
    console.log(err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
// app.use(cookieParser('12345-67890-54321-09876'));

app.use(passport.initialize());

app.use('/users', usersRouter);

         
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'css')));
app.use(express.static('/mnt'));
app.use('/dishes', dishRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favourites',favouriteRouter);
app.use('/restaurants',resRouter);
app.use('/volunteers',volRouter);
app.use('/volFood',volFoodRouter);
app.use('/vol',volInfoRouter);
app.use('/other',otherRouter);

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
