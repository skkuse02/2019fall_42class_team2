var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var moment = require('moment'); //날짜 계산 모듈


// search query 안에 들어가는 함수. res로 보내줄 인자 만듦
var queryfunc = function(err, data, res, vocab, univname) {
  if (err) {
    console.log(err);
  }
  var itemurl = new Array(); //res 1, 상품url
  var itemname = new Array(); //res 2, 상품이름
  var itemprice = new Array(); //res 3, 상품할인된가격
  var is_available = new Array(); //res 4, 현재 남은 개수
  var nowdisc = new Array(); // res 5, 현재할인율
  var maxdisc = new Array(); // res 6, 최대할인율
  var itemdate = new Array(); //res 7, 만료 기간
  var itemid = new Array(); //res 8, 상품 고유 id
  var newDate = moment(); //현재 시간
  var EndDate; //구매 만료 날짜

  for (var i = 0; i < data.length; i++) {
    itemurl[i] = data[i]['img_src']; //res 1
    itemname[i] = data[i]['i_name']; //res 2
    itemid[i] = data[i]['ItemID'];  //res 8
    is_available[i] = data[i]['is_Available']; //res 4
    //res 3, 5
    if (is_available[i] > data[i]['Disc_num1']) //가격 그대로
    {
      itemprice[i] = data[i]['cur_price'];
      nowdisc[i] = 0;
    } else if (is_available[i] > data[i]['Disc_num2']) //할인율 1
    {
      itemprice[i] = data[i]['Discount1'];
      nowdisc[i] = 100 - Math.round(data[i]['Discount1'] / data[i]['cur_price'] * 100);
    } else if (is_available[i] > data[i]['Disc_num2']) //할인율 2
    {
      itemprice[i] = data[i]['Discount2'];
      nowdisc[i] = 100 - Math.round(data[i]['Discount2'] / data[i]['cur_price'] * 100);
    } else // 할인율 3
    {
      itemprice[i] = data[i]['Discount3'];
      nowdisc[i] = 100 - Math.round(data[i]['Discount3'] / data[i]['cur_price'] * 100);
    }
    //res 6, 반올림 해서 넣음
    maxdisc[i] = 100 - Math.round(data[i]['Discount3'] / data[i]['cur_price'] * 100);
    //res 7, 만료 기간 계산.
    EndDate = moment(data[i]['EndDate'], 'YYYY-MM-DD HH:mm'); //상품만료일
    var diffTime = {
      day: moment.duration(EndDate.diff(newDate)).days(),
      hour: moment.duration(EndDate.diff(newDate)).hours(),
      minute: moment.duration(EndDate.diff(newDate)).minutes()
    };
    itemdate[i] = diffTime.day + '일 ' + diffTime.hour + '시간 ' + diffTime.minute + '분 남음';
  }
  return res.render('customerPageHTML/search', {
    itemurl: itemurl,
    itemname: itemname,
    itemprice: itemprice,
    is_available: is_available,
    nowdisc: nowdisc,
    maxdisc: maxdisc,
    itemdate: itemdate,
    itemid: itemid,
    Length: i,
    vocab: vocab,
    univname: univname
  });
}

/* (mainPage -> search)검색 화면 띄우기*/
router.post('/', function(req, res, next) {
  var UnivID = req.cookies.UnivID; // 구매자 학교id 받아오기
  var vocab = req.body.search;
  var univname; //학교 이름 보내주기
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
  //이미지, 이름, 현재 가격, 현재 개수, 현재 할인율, 최대할인율, 기간
  connection.query('select * from Item where Univ_ID = ? and i_status = ? and i_name like ?', [UnivID, 1, "%" + vocab + "%"], function(err, data) {
    queryfunc(err, data, res, vocab, univname);
  })
});

// (search -> search) 조건 추가 상세 정보 검색
router.post('/plussearch', function(req, res, next) {
  var UnivID = req.cookies.UnivID; // 구매자 학교id 받아오기
  var vocab = req.body.search;
  var univname; //학교 이름 보내주기
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
  //이미지, 이름, 현재 가격, 현재 개수, 현재 할인율, 최대할인율, 기간
  connection.query('select * from Item where Univ_ID = ? and i_status = ? and i_name like ?', [UnivID, 1, "%" + vocab + "%"], function(err, data) {
    queryfunc(err, data, res, vocab, univname);
  })
});

//jquery 통신






module.exports = router;
