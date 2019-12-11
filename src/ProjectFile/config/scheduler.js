var schedule = require('node-schedule');
var mysql = require("mysql");
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);
var moment = require('moment'); //날짜 계산 모듈
var async = require('async');

/* query로 item 목록 전부 뽑기, 현재 시간과 enddate 비교 + 현재 잔여 개수와 현재 가격 불러오기 (select)
or 상품 전부 팔린 거 불러오기
 enddate =< moment 일 때만 쿼리 실행
 현재 가격 구하기
 1) History에서 HitemID = ItemID 인 것들 찾아서 조회 (select)
 2) Consumer한테 포인트 재지급.   (consumer 포인트 += 현재 가격 * purchase_num)
 3) Seller에게 포인트 지급. (Seller 포인트 += 현재 가격 * (cur_total - is_Available))
 3) h_status 0으로 전부 변경
 4) item의 i_status 0으로 전부 변경
*/

var j = schedule.scheduleJob('0-59/10 * * * * *', async function() { //매 10초마다 수행
  var now = moment();
  var nowDate = now.format('YYYY-MM-DD HH:mm:ss'); //timestamp 형식으로 변경
  console.log("update!!");
// itemid 같음, cid 같음, item 판매 상태 중인 것 들 중 유효기간 지난것이나 다팔린 것 가져오기
  connection.query('select * from Consumer c, History h, Item i, Seller s where s.SID = i.ISID and i.ItemID = h.HItemID and c.CID = h.HCID and i.i_status = ? and (i.EndDate <= ? or i.is_Available = ?)', [1,nowDate,0], function(err, rows) {
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
    var itempnum = new Array(); //상품 구매 개수
    var refund = new Array(); //환불
    var sellerfund = new Array(); //판매자한테 줄 돈
    var cid = new Array();  //구매자 id
    var sid = new Array();  //판매자 id
    var pid = new Array();  //판매자 id

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
      itempnum[i] = rows[i]['Purchase_num'];
      cid[i] = rows[i]['CID'];
      sid[i] = rows[i]['SID'];
      pid[i] = rows[i]['PID'];

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
      refund[i] = itempnum[i] * (cur_price[i] - nowprice[i]);
      sellerfund[i] = itempnum[i] * nowprice[i];
    }
    //console.log(refund, sellerfund, cid, sid);
    //console.log(itemid, pid);
    // 2) Consumer한테 포인트 재지급.   (consumer 포인트 += 현재 가격 * purchase_num) + h_status 0으로 변경
    // 3) Seller에게 포인트 지급. (Seller 포인트 += 현재 가격 * (cur_total - is_Available)) + i_status 0으로 변경

    for (var i=0; i<rows.length; i++)
    {
      connection.query('update Consumer set Point = Point + ? where CID = ?',[refund[i], cid[i]]);
      connection.query('update History set h_status = ? where PID = ?', [0, parseInt(itemid[i]), pid[i]], function(err,row){
        console.log(row);
      });
      connection.query('update Seller set Point = Point + ? where SID = ?',[sellerfund[i], sid[i]]);
      connection.query('update Item set i_status = ? where ItemID = ?',[0, itemid[i]]);
    }
  })

});
