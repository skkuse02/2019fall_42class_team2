var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 포인트 충전 화면 출력*/
router.get('/', function(req, res, next) {
  var CID = req.cookies.CID;  //구매자 아이디 받아오기

  connection.query('select * from Consumer where CID=?',[CID],function(err,rows){
    var point = rows[0]['Point'];
    res.render('customerPageHTML/point_charge', {pass:'0', point: point})
  });
});

/* 포인트 충전!*/
router.post('/charge', function(req, res, next) {
  var CID = req.cookies.CID;  //구매자 아이디 받아오기
  var c_point = req.body.point; //충전할 금액

  //point 업데이트
  connection.query('update Consumer SET Point = Point + ? where CID=?', [c_point, CID] ,function(err,rows){
    //point 정보 불러옴
    connection.query('select * from Consumer where CID=?',[CID],function(err,rows){
      var point = rows[0]['Point'];
      res.render('customerPageHTML/point_charge', {pass:'1', point: point})
    });
  });
});


module.exports = router;
