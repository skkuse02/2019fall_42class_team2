var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 구매자 초기 화면으로  :  customerPageHTML/mainPage */
router.get('/', function(req, res, next) {
  var CID = req.cookies.CID; //구매자 아이디 받아오기
  var UnivID = req.cookies.UnivID; // 구매자 학교id 받아오기
  var univname; //res 1, 학교 이름 보내주기
  //
  switch (UnivID) {
    case 'skku':
      univname = '성균관대학교';
      break;
    case 'seoul':
      univname = '서울대학교';
      break;
    case 'yonsei':
      univname = '연세대학교';
      break;
    case 'korea':
      univname = '고려대학교';
      break;
  }

  //학교 ID에 맞는 최대 6개의 Item 목록 랜덤하게 뽑아오기
  connection.query('select * from Item where Univ_ID = ? and i_status = ? order by rand() limit 6', [UnivID,1], function(err,row) {
    var itemurl = new Array();  //res 2, 상품url
    var itemname = new Array();  //res 3, 상품이름
    var itemprice = new Array();  //res 4, 상품할인된가격
    var description = new Array();  //res 5, 상품설명
    var itemid = new Array();   //res 6, 상품 고유 ID
    var is_available; //상품 잔여 개수

    for (var i=0; i<row.length; i++)
    {
      itemurl[i] = row[i]['img_src'];
      itemname[i] = row[i]['i_name'];
      description[i] = row[i]['description'];
      is_available = row[i]['is_Available'];
      itemid[i] = row[i]['ItemID'];
      if(is_available > row[i]['Disc_num1'])  //가격 그대로
      {
        itemprice[i] = row[i]['cur_price'];
      }else if(is_available > row[i]['Disc_num2'])  //할인율 1
      {
        itemprice[i] = row[i]['Discount1'];
      }else if(is_available > row[i]['Disc_num2'])  //할인율 2
      {
        itemprice[i] = row[i]['Discount2'];
      }else // 할인율 3
      {
        itemprice[i] = row[i]['Discount3'];
      }
    }
    res.render('customerPageHTML/mainPage', {
      Univname: univname,
      Itemurl: itemurl,
      Itemname: itemname,
      Itemprice: itemprice,
      Description: description,
      itemid: itemid,
      Length: i,
      pass: 0
    });

  });
});

module.exports = router;
