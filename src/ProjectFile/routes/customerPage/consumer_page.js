var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var dateutil = require('date-utils'); // 현재 시간 구하기
var moment = require('moment'); //날짜 계산 모듈

/* 구매자 my page. */
router.post('/', function(req, res, next) {
  var CID = req.cookies.CID;
  var UnivID = req.cookies.UnivID; //res 1
  var univname;
  //res 10
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

  //구매자 정보 가져오기
  connection.query('select * from Consumer where CID=?', [CID], function(err, rows) {
    if (err) {
      throw err
    };
    var c_name = rows[0]['c_name']; //res 2
    var c_point = rows[0]['Point']; //res 3

    //구매 현황 가져오기 상품명, 남은 기간, 상품 금액, 구매한 개수, 현재 할인율
    connection.query('select * from History h, Item i where h.HCID = ?  and i.i_status = ? and h.HItemID = i.ItemID', [CID,1], function(err, rows) {
      if (err) {
        throw err
      };
      var itemname = new Array(); //res 4, 상품 이름
      //var Period; //구매한 날짜
      var newDate = moment(); //현재 시간
      var EndDate; //구매 만료 날짜
      var itemdate = new Array(); //res 5, 남은 날짜
      var cur_total; // 전체 상품 개수
      var is_available; //상품 잔여 개수   (전체 - 잔여 = 판매된 상품 개수)
      var itemcount = new Array(); //res 7, 구매한 개수

      var cur_price; // 상품 할인되기 전 가격
      var itemdsc1; //상품 할인된 가격
      var itemdsc2;
      var itemdsc3;
      var itemdscnum1; //상품 할인 개수 달성 지표
      var itemdscnum2;
      var itemdscnum3;
      // 할인율 보여주기
      var discount_price = new Array(); // res 6, 할인된 가격 * 구매한 개수
      var discount_rate = new Array(); // res 8, 할인율, 100-(item_dscx / cur_price * 100) : 할인율

      for (var i = 0; i < rows.length; i++) {
        itemname[i] = rows[i]['i_name']; //res 4, 상품 이름
        //Period=rows[i]['Period'];
        EndDate = moment(rows[i]['EndDate'], 'YYYY-MM-DD HH:mm'); //상품만료일
        var diffTime = {
          day: moment.duration(EndDate.diff(newDate)).days(),
          hour: moment.duration(EndDate.diff(newDate)).hours(),
          minute: moment.duration(EndDate.diff(newDate)).minutes()
        };
        itemdate[i] = diffTime.day + '일 ' + diffTime.hour + '시간 ' + diffTime.minute + '분' //res 5, 남은 날짜 출력

        cur_total = rows[i]['cur_total'];
        is_available = rows[i]['is_Available']; //상품 남은 개수
        itemcount[i] = rows[i]['Purchase_num']; //res 7 구매한 개수

        //할인율 정보 가져오기
        cur_price = rows[i]['cur_price'];
        itemdsc1 = rows[i]['Discount1'];
        itemdsc2 = rows[i]['Discount2'];
        itemdsc3 = rows[i]['Discount3'];
        itemdscnum1 = rows[i]['Disc_num1'];
        itemdscnum2 = rows[i]['Disc_num2'];
        itemdscnum3 = rows[i]['Disc_num3'];

        //res 6 - 할인된 가격, res 8 - 할인율 전달
        if (is_available > itemdscnum1) //cur_price(본래 가격)으로 판매
        {
          discount_price[i] = cur_price * itemcount[i];
          discount_rate[i] = 0;
        } else if (is_available > itemdscnum2) //discount1로 판매
        {
          discount_price[i] = itemdsc1 * itemcount[i];
          discount_rate[i] = 100 - (itemdsc1 / cur_price * 100);
          discount_rate[i] = Math.round(discount_rate[i]); //반올림
        } else if (is_available > itemdscnum3) //discount2로 판매
        {
          discount_price[i] = itemdsc2 * itemcount[i];
          discount_rate[i] = 100 - (itemdsc2 / cur_price * 100);
          discount_rate[i] = Math.round(discount_rate[i]); //반올림
        } else { //discount3로 판매
          discount_price[i] = itemdsc3 * itemcount[i];
          discount_rate[i] = 100 - (itemdsc3 / cur_price * 100);
          discount_rate[i] = Math.round(discount_rate[i]); //반올림
        }
      }

      res.render('customerPageHTML/consumer_page', {
        UnivID: UnivID,
        c_name: c_name,
        c_point: c_point,
        itemname: itemname,
        itemdate: itemdate,
        price: discount_price,
        itemcount: itemcount,
        disrate: discount_rate,
        Length: i, //res 9
        univname: univname
      });

    });
  });
});


//point refresh
router.post('/refreshpoint', function(req, res) {
  var CID = req.cookies.CID;
  connection.query('SELECT Point FROM Consumer WHERE CID=?', [CID], function(err, row) {
      var point=row[0]['Point'];
      console.log(point);
      return res.send({
        c_point: point
      });
  });
});


module.exports = router;






//scheduler.js


/*

// enddate <= moment or is_available = 0일 때 query문 실행
connection.query('select * from Item where i_status = ? and (EndDate <= ? or is_Available = ?)', [1, nowDate, 0], function(err, rows) {
  var itemid = new Array(); //상품 고유 id
  var nowprice = new Array(); //현재 가격
  var is_available = new Array(); //남은 상품 개수
  var cur_price = new Array(); //처음 가격
  var itemdsc1 = new Array();
  var itemdsc2 = new Array();
  var itemdsc3 = new Array();
  var itemdscnum1 = new Array();
  var itemdscnum2 = new Array();
  var itemdscnum3 = new Array();

  for (var i = 0; i < rows.length; i++) {
    itemid[i] = rows[i]['ItemID'];
    is_available[i] = rows[i]['is_Available']; //할인율 정보 가져오기
    cur_price[i] = rows[i]['cur_price'];
    itemdsc1[i] = rows[i]['Discount1'];
    itemdsc2[i] = rows[i]['Discount2'];
    itemdsc3[i] = rows[i]['Discount3'];
    itemdscnum1[i] = rows[i]['Disc_num1'];
    itemdscnum2[i] = rows[i]['Disc_num2'];
    itemdscnum3[i] = rows[i]['Disc_num3'];
    //
    if (is_available[i] > itemdscnum1[i]) //cur_price(본래 가격)으로 판매
    {
      nowprice[i] = cur_price[i];
    } else if (is_available[i] > itemdscnum2[i]) //discount1로 판매
    {
      nowprice[i] = itemdsc1[i];
    } else if (is_available[i] > itemdscnum3[i]) //discount2로 판매
    {
      nowprice[i] = itemdsc2[i];
    } else { //discount3로 판매
      nowprice[i] = itemdsc3[i];
    }
  }
});

// 4) item의 i_status 0으로 전부 변경
connection.query('update Item set i_status = ? where EndDate <= ? or is_Available = ?', [1, nowDate, 0], function(err, rows5) {
  if (err) {
    throw err
  };
});


// 1) History에서 HitemID = ItemID 인 것들 찾아서 조회 (select)
//2) Consumer한테 포인트 재지급.   (consumer 포인트 += 현재 가격 * purchase_num)
connection.query('select * from History h, Consumer c where h.HItemID = ? and h.HCID = c.CID', [itemid], function(err, rows2) {
  console.log("22222");
  console.log(rows2);
  var purchase_num; //구매 개수
  var hcid; //consumer id
  var pid; //history의 고유 id
  for (var j = 0; j < rows2.length; j++) {
    purchase_num = rows2[j]['Purchase_num'];
    hcid = rows2[j]['CID'];
    pid = rows2[j]['PID'];
    // Consumer 포인트 업데이트
    connection.query('update Consumer set Point = Point + ? where CID = ?', [parseInt(nowprice) * parseInt(purchase_num), hcid], function(err, rows) {
      console.log("33333");
      console.log(rows);
      if (err) {
        throw err
      };
    });
    // 3) h_status 0으로 전부 변경
    console.log(itemid);
    connection.query('update History set h_status = ? where HItemID = ? and HCID = ?', [0, itemid, pid], function(err, rows) {
      console.log("44444");
      console.log(rows);
      if (err) {
        throw err
      };
    });
  }
});
*/
