var express = require('express');
var router = express.Router();
//var path = require('path');
//cd C:\webprogramming\20191209\example
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var dateutil = require('date-utils'); // 현재 시간 구하기
var moment = require('moment'); //날짜 계산 모듈

/* 상품 상세 정보 화면 */
// 상품 이름, 판매자 이름, 첫 가격, 현재 개수, 현재 할인율, 현재 가격, 다음 할인율/목표수치, 최대할인율/목표수치, 만료 기간 + 설명

router.post('/', function(req, res, next) {
  var itemid = req.body.ItemID; //res 11, 상품 고유 id
  var UnivID = req.cookies.UnivID;
  var univname; //res 13, 학교 이름 보내주기
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
  // 상품 정보 읽어오기
  connection.query("SELECT * FROM Seller s, Item i WHERE i.ItemID = ? and i.Univ_ID= ? and i.ISID=s.SID", [itemid, UnivID], function(err, rows) {
    if (err) {      throw err    };
    var itemname = rows[0]['i_name']; // res 1, 상품이름
    var sellername = rows[0]['s_name']; //res 2, 판매자 이름
    var cur_price = rows[0]['cur_price']; //res 3, 처음 가격
    var is_available = rows[0]['is_Available']; //res 4, 현재 남은 개수
    var discount; //res 5, 현재 할인율
    var nowprice; //res 6, 현재 가격
    var nextdisgoal; //res 7, 다음 할인율 / 목표수치
    var newDate = moment(); //현재 시간
    var EndDate; //구매 만료 날짜
    var itemdate; //res 9, 남은 날짜
    var description = rows[0]['description']; //res 10, 상품 설명
    var imgsrc = rows[0]['img_src'];  //res 12, itemurl

    var cur_price = rows[0]['cur_price']; // 상품 할인되기 전 가격
    var itemdsc1 = rows[0]['Discount1']; //상품 할인된 가격
    var itemdsc2 = rows[0]['Discount2'];
    var itemdsc3 = rows[0]['Discount3'];
    var itemdscnum1 = rows[0]['Disc_num1']; //상품 할인 개수 달성 지표
    var itemdscnum2 = rows[0]['Disc_num2'];
    var itemdscnum3 = rows[0]['Disc_num3'];
    var nextdis; //res 7에 필요한 다음 할인율
    var nextgoal; //res 7에 필요한 다음 목표수치

    // res 5,6,7
    if (is_available > itemdscnum1) //cur_price(본래 가격)으로 판매
    {
      console.log("1");
      discount = 0;
      nowprice = cur_price;
      nextdis = Math.round(100 - (itemdsc1 / cur_price * 100));
      nextgoal = is_available - itemdscnum1;
      nextdisgoal = nextdis + '% / ' + nextgoal + '개';
    } else if (is_available > itemdscnum2) //discount1로 판매
    {
      console.log("2");
      discount = Math.round(100 - (itemdsc1 / cur_price * 100));
      nowprice = itemdsc1;
      nextdis = 100 - Math.round((itemdsc2 / cur_price * 100));
      nextgoal = is_available - itemdscnum2;
      nextdisgoal = nextdis + '% / ' + nextgoal + '개';
    } else if (is_available > itemdscnum3) //discount2로 판매
    {
      console.log("3");
      discount = Math.round(100 - (itemdsc2 / cur_price * 100));
      nowprice = itemdsc2;
      nextdis = Math.round(100 - (itemdsc3 / cur_price * 100));
      nextgoal = is_available - itemdscnum3;
      nextdisgoal = nextdis + '% / ' + nextgoal + '개';
    } else { //discount3로 판매
      console.log("4");
      discount = Math.round(100 - (itemdsc3 / cur_price * 100));
      nowprice = itemdsc3;
      nextdisgoal = '이미 최대 할인 혜택을 받고 있는 상품입니다!';
    }

    EndDate = moment(rows[0]['EndDate'], 'YYYY-MM-DD HH:mm'); //상품만료일
    var diffTime = {
      day: moment.duration(EndDate.diff(newDate)).days(),
      hour: moment.duration(EndDate.diff(newDate)).hours(),
      minute: moment.duration(EndDate.diff(newDate)).minutes()
    };
    itemdate = diffTime.day + '일 ' + diffTime.hour + '시간 ' + diffTime.minute + '분' //res 9, 남은 날짜 출력

    res.render('customerPageHTML/product', {
      itemname: itemname,
      sellername: sellername,
      cur_price: cur_price,
      is_available: is_available,
      discount: discount,
      nowprice: nowprice,
      nextdisgoal: nextdisgoal,
      //maxdisprice: maxdisprice, res 8, 없어짐
      itemdate: itemdate,
      description: description,
      itemid: itemid,
      imgsrc: imgsrc,
      Univname: univname
    });
  });
});

module.exports = router;
