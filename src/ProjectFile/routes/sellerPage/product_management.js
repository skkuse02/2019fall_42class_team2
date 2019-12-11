var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);
var moment = require('moment');

// 상품관리 페이지 띄우기
router.get('/',function (req,res){

  var sid = req.cookies.SID; // 판매자 쿠키 받아오기

  connection.query("SELECT * FROM Item i, Seller s WHERE i.i_status = 1 and i.ISID = s.SID and s.SID=?",[sid], function(err, row){
    if(err) throw err;
    var newDate = moment();
    var EndDate;

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
    var img_src = new Array();
    var univ = new Array();

    for(var i = 0; i < row.length; i++){
      EndDate = moment(row[i]['EndDate'], 'YYYY-MM-DD HH:mm');
      var diffTime = {
        day: moment.duration(EndDate.diff(newDate)).days(),
        hour: moment.duration(EndDate.diff(newDate)).hours(),
        minute: moment.duration(EndDate.diff(newDate)).minutes()
      };
      period[i] = diffTime.day + '일 ' + diffTime.hour + '시간 ' + diffTime.minute + '분' //res 5, 남은 날짜 출력
      univ[i] = row[i]['Univ_ID'];
      item_name[i] = row[i]['i_name'];
      price[i] = row[i]['cur_price'];
      item_number[i] = row[i]['cur_total'];
      sale1[i] = row[i]['Discount1'];
      sale2[i] = row[i]['Discount2'];
      max_sale[i] = row[i]['Discount3'];
      disc_num1[i] = row[i]['Disc_num1'];
      disc_num2[i] = row[i]['Disc_num2'];
      disc_num3[i] = row[i]['Disc_num2'];
      img_src[i] = row[i]['img_src'];
     }
    return res.render("sellerPageHTML/product_management",{
      item_name: item_name,
      period: period,
      item_number: item_number,
      price: price,
      sale1: sale1,
      sale2: sale2,
      max_sale: max_sale,
      cur_sale: cur_sale,
      length: i,
      img_src: img_src,
      univ: univ
    })
  })
});


router.post('/update', function(req, res){
  var body = req.body;
  var sid = req.cookies.SID
  var name = body.name;
 
  connection.query('SELECT * From Item WHERE ISID=? and i_name=?',[sid, name], function(err, row){
    if(err) throw err;

    var description = row[0]['description'];
    var img_src = row[0]['img_src'];
    var name = row[0]['i_name'];
    res.render('sellerPageHTML/update_Seller',{
      name: name,
      description: description,
      img_src: img_src
    });
  });
});



/*상품 등록 */
router.get('/register_product', function(req, res) {
  res.render('sellerPageHTML/register_product');
});




module.exports = router;
