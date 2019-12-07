var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 구매자 초기 화면으로 */
router.get('/', function(req, res, next) {
  res.render('customerPageHTML/mainPage');
});

module.exports = router;
