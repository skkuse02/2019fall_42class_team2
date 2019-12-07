var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../config/database.js');
//var update = require('../config/scheduler.js');
var connection = mysql.createConnection(dbconfig);


/* 시작 화면 */
router.get('/', function(req, res, next) {
    res.render('start', {pass:'0'});
});

module.exports = router;
