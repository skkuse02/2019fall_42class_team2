var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//보안 모듈
const crypto = require('crypto');

//시작 화면
 router.get('/', function(req, res, next) {
   res.render('loginPageHTML/register_consumer', {pass:'0'});
 });


//id 중복 검사
 router.post('/idcheck', function(req, res) {
   var id = req.body.data;
   connection.query('SELECT * FROM Consumer WHERE CID=?', [id], function(err, row) {
     if (row.length != 0) {
       var data = "존재";
       console.log("구매자 아이디 중복");
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


//구매자 회원가입
 router.post('/register',function (req,res){
 	 var body = req.body;
   var id = body.id;
 	 var pw = body.password;
 	 var pwcheck = body.passwordCheck;
 	 var name = body.name;
   var school = body.school;
 	 var email = body.email;
   var emailtail = body.emailtail;

 	 var salt = Math.round((new Date().valueOf() * Math.random())) + "";
   var safepw = crypto.createHash("sha512").update(pw + salt).digest("hex");
   //비밀번호 일치 체크
   if(pw != pwcheck)
   {
     return res.render('loginPageHTML/register_consumer', {pass:'1'});
   }
   //아이디 중복 체크
   connection.query('SELECT * FROM Consumer WHERE CID = ?', [id], function(err, data){
     if(data.length!=0)
     {
       console.log("아이디중복");
       return res.render('loginPageHTML/register_consumer', {pass:'3'});
     }else{ //모든 조건 만족
       //consumer 데이터베이스에 집어 넣기
       connection.query('INSERT INTO Consumer (CID, c_name, password, UnivID, Email, Point, salt) values (?,?,?,?,?,?,?)', [id, name, safepw, school, email + emailtail, '0', salt] ,function(err, rows) {
         if(err) { throw err;}
         console.log("Registered!");
       });
      setTimeout(function() {
        return res.render('loginPageHTML/register_consumer', {pass:'2'});
      }, 1500);
     }
   })
 });




module.exports = router;
