var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//보안 모듈
const crypto = require('crypto');

//시작 화면
router.get('/', function(req, res, next) {
  res.render('loginPageHTML/register_seller', {
    pass: '0'
  });
});

router.post('/idcheck', function(req, res) {
  var id = req.body.data;
  connection.query('SELECT * FROM Seller WHERE SID=?', [id], function(err, row) {
    if (row.length != 0) {
      var data = "존재";
      console.log("판매자 아이디 중복");
      return res.send({
        data: data
      });
    } else if (id == "") {
      var data = "공백";
      return res.send({
        data: data
      });
    } else {
      var data = "가능";
      return res.send({
        data: data
      });
    }
  });
});

//판매자 회원가입
router.post('/register', function(req, res) {
  var body = req.body;
  var id = body.id;
  var pw = body.password;
  var pwcheck = body.passwordCheck;
  var name = body.name;
  var companyid = body.CompanyID;

  var salt = Math.round((new Date().valueOf() * Math.random())) + "";
  var safepw = crypto.createHash("sha512").update(pw + salt).digest("hex");
  //비밀번호 일치 체크
  if (pw != pwcheck) {
    return res.render('loginPageHTML/register_Seller', {
      pass: '1'
    });
  }
  //아이디 중복 체크
  connection.query('SELECT * FROM Seller WHERE SID = ?', [id], function(err, data) {
    if (data.length != 0) {
      console.log("아이디중복");
      return res.render('loginPageHTML/register_Seller', {
        pass: '3'
      });
    } else { //모든 조건 만족
      //Seller 데이터베이스에 집어 넣기
      connection.query('INSERT INTO Seller (SID, s_name, CompanyID, password, Point, salt) values (?,?,?,?,?,?)', [id, name, companyid, safepw, '0', salt], function(err, rows) {
        if (err) {
          throw err;
        }
        console.log("seller Registered!");
      });
      setTimeout(function() {
        return res.render('loginPageHTML/register_Seller', {
          pass: '2'
        });
      }, 1500);
    }
  })
});

module.exports = router;
