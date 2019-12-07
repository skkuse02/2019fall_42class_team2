var schedule = require('node-schedule');
var mysql = require("mysql");
var dbconfig = require('../config/database.js');
var connection = mysql.createConnection(dbconfig);
var moment = require('moment'); //날짜 계산 모듈
var jsalert = require('js-alert');  //팝업 하게 해주는 모듈

var i=0;

/*
아마 판매자/구매자 다르게 scheduler 넣어야될듯
구매자/판매자 쿠키 불러와서 그와 관련된 Item 목록 전부 긁어옴.
그 중 EndDate(상품 만료 기간)만 현재 시간과 비교.
현재 시간 > EndDate일 경우(이미 지난 경우) : 팝업x, 업데이트만 해줌
현재 시간 = EndDate일 경우 : 팝업해줌

*/

var j = schedule.scheduleJob('0-59/1 * * * * *', function(){  //매 5초마다 수행
  var nowDate = moment(); //현재 시간
  jsalert.alert("This is an alert");
  console.log(i);
  i=i+1;
});
