var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//var moment = require('moment');


router.get('/', function(req, res){
  res.render('sellerPageHTML/seller_page');
})

module.exports = router;
