var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//var moment = require('moment');

/*
router.get('/product_management/register_product', function(req, res){
  res.render('sellerPageHTML/register_product');
})
*/

// logout
/*
router.post('/sellerlogout', function(req, res){
  res.clearCookie('seller');
  res.render('/'); // redirect to main
})
*/
module.exports = router;
