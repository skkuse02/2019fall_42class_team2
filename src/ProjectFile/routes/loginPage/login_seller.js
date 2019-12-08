var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
//보안 모듈
const crypto = require('crypto');

/* 시작 화면 */
router.get('/', function(req, res) {
  res.render('loginPageHTML/login_seller', {pass:'0'});
});

//판매자 로그인 시도
router.post('/sellerlogin', function(req,res){
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
      res.cookie("SID", id , {
         expires: new Date(Date.now() + 9000000),
         httpOnly: true
       });

       //
       connection.query("SELECT * FROM Item i, Seller s WHERE i.i_status = 1 and i.ISID = s.SID and s.SID = ?",[id], function(err, row){
        //if(err) throw err;
        console.log(row);
        var item_name = new Array();
        var period = new Array();
        var price = new Array();
        var item_number = new Array();
        var sale1 = new Array();
        var sale2 = new Array();
        var max_sale = new Array();
        var disc_num1 = new Array();
        var disc_num2 = new Array();
        var disc_num3 = new Array();
        var cur_sale = new Array();
        //판매하고 있는 물건이 없는 경우 오류 발생했었음.
        /*
        if(row.length>0)
        {
        var seller_name = row[0]['s_name'];
        var seller_company = row[0]['CompanyID'];
        var seller_point = row[0]['Point'];
        }
        */
        for(var i = 0; i < row.length; i++)
        {
          item_name[i] = row[i]['i_name'];
          period[i] = row[i]['Period'];
          price[i] = row[i]['cur_price'];
          item_number[i] = row[i]['cur_total'];
          sale1[i] = row[i]['Discount1'];
          sale2[i] = row[i]['Discount2'];
          max_sale[i] = row[i]['Discount3'];
          disc_num1[i] = row[i]['Disc_num1'];
          disc_num2[i] = row[i]['Disc_num2'];
          disc_num3[i] = row[i]['Disc_num2'];
          if(item_number[i] < disc_num1[i]){
            cur_sale[i] = sale1[i];
          }
          else if((item_number[i] >= disc_num1[i]) && item_number[i] < disc_num2[i]){
            cur_sale[i] = sale2[i];
          }
          else{
            cur_sale[i] = max_sale[i];
          }
        }

        connection.query("select * from Seller where SID=?",[id],function(err,row){
          var seller_name = row[0]['s_name'];
          var seller_company = row[0]['CompanyID'];
          var seller_point = row[0]['Point'];
          //드디어 쿼리 쏴줌
          return res.render("sellerPageHTML/seller_page",{
            item_name: item_name,
            period: period,
            item_number: item_number,
            price: price,
            sale1: sale1,
            sale2: sale2,
            max_sale: max_sale,
            length: i,
            seller_name: seller_name,
            seller_company: seller_company,
            seller_point: seller_point,
            cur_sale: cur_sale
           });
        })
      })
    }else{
      console.log("비밀번호 불일치");
      return res.render('loginPageHTML/login_seller', {pass:'2'});
    }
   })
});


module.exports = router;
