var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//router 정의하기
//main page router
var startRouter = require('./routes/start');
//customer page router
var c_buyRouter = require('./routes/customerPage/buy');
var c_consumer_pageRouter = require('./routes/customerPage/consumer_page');
var c_mainPageRouter = require('./routes/customerPage/mainPage');
var c_point_chargeRouter = require('./routes/customerPage/point_charge');
var c_productRouter = require('./routes/customerPage/product');
var c_searchRouter = require('./routes/customerPage/search');
var c_logoutRouter = require('./routes/customerPage/logout');
//login page router
var l_login_consumerRouter = require('./routes/loginPage/login_consumer');
var l_login_sellerRouter = require('./routes/loginPage/login_seller');
var l_register_consumerRouter = require('./routes/loginPage/register_consumer');
var l_register_sellerRouter = require('./routes/loginPage/register_seller');
//seller page Router
var s_product_managementRouter = require('./routes/sellerPage/product_management');
var s_register_productRouter = require('./routes/sellerPage/register_product');
var s_seller_pageRouter = require('./routes/sellerPage/seller_page');
var s_update_productRouter = require('./routes/sellerPage/update_product');
var s_logoutRouter = require('./routes/sellerPage/logout');
var s_product_soldoutRouter = require('./routes/sellerPage/product_soldout');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//router 주소 지정
app.use('/', startRouter);
//customer page router 주소 지정
app.use('/customer/buy', c_buyRouter);
app.use('/customer/consumer_page', c_consumer_pageRouter);
app.use('/customer/mainPage', c_mainPageRouter);
app.use('/customer/point_charge', c_point_chargeRouter);
app.use('/customer/product', c_productRouter);
app.use('/customer/search', c_searchRouter);
app.use('/customer/logout', c_logoutRouter);
//login page router 주소 지정
app.use('/login/login_consumer', l_login_consumerRouter);
app.use('/login/login_seller', l_login_sellerRouter);
app.use('/login/register_consumer', l_register_consumerRouter);
app.use('/login/register_seller', l_register_sellerRouter);
//seller page router 주소 지정
app.use('/seller/product_management', s_product_managementRouter);
app.use('/seller/register_product', s_register_productRouter);
app.use('/seller/seller_page', s_seller_pageRouter);
app.use('/seller/update_product', s_update_productRouter);
app.use('/seller/logout', s_logoutRouter);
app.use('/seller/product_soldout', s_product_soldoutRouter);
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
