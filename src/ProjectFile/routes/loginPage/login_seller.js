var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//보안 모듈
const crypto = require('crypto');

/* 시작 화면 */
router.get('/', function(req, res, next) {
  res.render('loginPageHTML/login_seller', {pass:'0'});
});

//판매자 로그인 시도
router.post('/sellerlogin', function(req,res,next){
  let body = req.body;
  let id = body.seller_id;
  let pw = body.pass;

  //아이디 있는지 확인
  connection.query("SELECT * FROM Seller WHERE SID=?", [id], function(err,results){
    if(err){ console.log(err); }
    //아이디 존재 X
    if(!results[0]){
      return res.render('loginPageHTML/login_seller', {pass:'1'});
    }
    //비밀번호, salt 값 가져오기, hashing 하기
    let lockedpw=results[0].password;
    let salt = results[0].salt;
    let hashPassword = crypto.createHash("sha512").update(pw + salt).digest("hex");
    //비밀번호 확인
    if(lockedpw == hashPassword)
    {
      console.log("판매자 로그인 성공");
      res.cookie("CID", id , {
         expires: new Date(Date.now() + 9000000),
         httpOnly: true
       });
      return res.render("sellerPageHTML/seller_page");
    }else{
      console.log("비밀번호 불일치");
      return res.render('loginPageHTML/login_seller', {pass:'2'});
    }
   })
});

module.exports = router;
