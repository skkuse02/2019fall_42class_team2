var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 시작 화면 */
router.get('/', function(req, res, next) {
  connection.query("SELECT * from consumer", function(err,results){
    if(err){ console.log(err); }
    console.log(results);
  });
  res.render('start');
});

module.exports = router;
