var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* 구매 확정 페이지 시작 화면 */
router.post('/', function(req, res, next) {
  var CID = req.cookies.CID; //구매자의 고유 id
  var UnivID = req.cookies.UnivID; //상품 학교 id
  var itemid = req.body.ItemID; //상품의 고유 id res 10
  var discount = req.body.discount; //상품의 현재 할인율 res 5
  var nowprice = req.body.nowprice; //상품의 현재 가격, res 2
  var univname; //res 9, 학교 정보

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
  //상품 이름, 상품 가격, 현재 포인트, 결제 후 포인트, 현재 할인율, 구매 확정 후 돌려받을 가격
  // + 상품 이미지 url + 구매 개수
  connection.query("select * from Item where ItemID = ? and i_status = ?", [itemid,1], function(err, rows) {
    if (err) {
      throw err
    };
    var itemname = rows[0]['i_name']; // res 1, 상품이름
    var imgsrc = rows[0]['img_src']; //res 7 이미지 링크
    var cur_price = rows[0]['cur_price'];
    connection.query("select * from Consumer where CID = ?", [CID], function(err, rows2) {
      if (err) {
        throw err
      };
      var nowpoint = rows2[0]['Point']; //res 3, 현재 포인트
      //afterpoint 결제 후 포인트 : - 으로 보냄 res 4
      //payback 구매 확정 후 돌려받을 가격 : 0으로 보냄 res 6
      //productnum 구매 하려는 상품의 개수: 0으로 보냄 res 8
      return res.render('customerPageHTML/buy', {
        itemname: itemname,
        nowprice: nowprice,
        nowpoint: nowpoint,
        afterpoint: '-',
        discount: discount,
        payback: 0,
        imgsrc: imgsrc,
        productnum: 0,
        Univname: univname,
        itemid: itemid,
        curprice: cur_price
      });

    });
  });
});


//buy.ejs 동적 변경
router.post('/buynum', function(req, res) {
  var pval = parseInt(req.body.pval); //구매할 상품 개수 전송
  var itemid = req.body.itemid; //상품 고유 id
  var nowpoint = parseInt(req.body.nowpoint); //상품 포인트
  connection.query('select * from Item where ItemID = ?', [itemid], function(err, rows) {
    var is_available = parseInt(rows[0]['is_Available']); //현재 남은 개수
    var cur_total = parseInt(rows[0]['cur_total']); // 총 상품 개수
    var cur_price = parseInt(rows[0]['cur_price']); //본래 상품 가격
    var itemdsc1 = parseInt(rows[0]['Discount1']); //상품 할인된 가격
    var itemdsc2 = parseInt(rows[0]['Discount2']);
    var itemdsc3 = parseInt(rows[0]['Discount3']);
    var itemdscnum1 = parseInt(rows[0]['Disc_num1']); //상품 할인 개수 달성 지표
    var itemdscnum2 = parseInt(rows[0]['Disc_num2']);
    var itemdscnum3 = parseInt(rows[0]['Disc_num3']);

    var afterpoint = 0; //결제 후 포인트
    var payback = 0; //구매 확정 후 (예정)돌려받을 가격

    //남은 개수 < 구매할 상품 개수 돌려보내기
    if (is_available < pval) {
      return res.send({
        ohno: 0, // 구매 개수 초과
        pval: 0, // 0
        afterpoint: nowpoint,
        payback: 0
      });
    } else { //조건 만족함
      //afterpoint 결제 후 포인트 = nowpoint - pval * (할인 가격)
      // payback 돌려받을 돈 = pval*(cur_price - 할인 가격)
      if (is_available - pval > itemdscnum1) //cur_price(본래 가격)으로 판매
      {
        payback = 0;
      } else if (is_available - pval > itemdscnum2) //discount1로 판매
      {
        payback = pval * (cur_price - itemdsc1);
      } else if (is_available - pval > itemdscnum3) //discount2로 판매
      {
        payback = pval * (cur_price - itemdsc2);
      } else { //discount3로 판매
        payback = pval * (cur_price - itemdsc3);
      }
      afterpoint = nowpoint - (pval * cur_price);

      if (afterpoint < 0) //구매 후 포인트가 부족해질 경우
      {
        return res.send({
          ohno: 2, // 구매 불가능
          pval: 0, //최대 구매 가능 개수 돌려보내기
          afterpoint: nowpoint,
          payback: 0
        });
      } else { // 정상적인 경우
        return res.send({
          ohno: 1,
          pval: pval,
          afterpoint: afterpoint,
          payback: payback
        });
      }
    }
  })
});

//구매 할 시 query
router.post('/buy', function(req, res) {
  var CID = req.cookies.CID; //구매자의 고유 id
  var UnivID = req.cookies.UnivID; //상품 학교 id
  var b_itemid = req.body.ItemID; //상품의 고유 id
  var buy_num = req.body.buy_buynum; //상품 구매할 개수
  var afterpoint2 = req.body.afterpoint2; //구매한 뒤 포인트

  //구매 시
  //History에 CID, HCID 일치하는 것 찾아서 update
  connection.query('insert into History values (0, ?, ?, ?, 1)', [buy_num, CID, b_itemid], function(err, rows) {
    if (err) {
      throw err
    };
  });
  //Item의 is_Available 수정
  connection.query('update Item set is_Available = is_Available - ? where ItemID = ?', [buy_num, b_itemid], function(err, rows) {
    if (err) {
      throw err
    };
  });
  var univname;
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
  //나의 point 수정
  connection.query('update Consumer set Point = ?', [afterpoint2], function(err, rows) {
    if (err) {
      throw err
    };
  });

  //학교 ID에 맞는 최대 6개의 Item 목록 랜덤하게 뽑아오기
  connection.query('select * from Item where Univ_ID = ? and i_status = ? order by rand() limit 6', [UnivID,1], function(err, row) {
    var itemurl = new Array(); //res 2, 상품url
    var itemname = new Array(); //res 3, 상품이름
    var itemprice = new Array(); //res 4, 상품할인된가격
    var description = new Array(); //res 5, 상품설명
    var itemid = new Array(); //res 6, 상품 고유 ID
    var is_available; //상품 잔여 개수

    for (var i = 0; i < row.length; i++) {
      itemurl[i] = row[i]['img_src'];
      itemname[i] = row[i]['i_name'];
      description[i] = row[i]['description'];
      is_available = row[i]['is_Available'];
      itemid[i] = row[i]['ItemID'];
      if (is_available > row[i]['Disc_num1']) //가격 그대로
      {
        itemprice[i] = row[i]['cur_price'];
      } else if (is_available > row[i]['Disc_num2']) //할인율 1
      {
        itemprice[i] = row[i]['Discount1'];
      } else if (is_available > row[i]['Disc_num2']) //할인율 2
      {
        itemprice[i] = row[i]['Discount2'];
      } else // 할인율 3
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
      pass: 1
    });
  });
});


module.exports = router;
