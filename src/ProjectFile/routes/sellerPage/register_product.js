var express = require('express');
var router = express.Router();
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);

/* 시작 화면 */
router.get('/', function(req, res) {
  res.render('sellerPageHTML/register_product');
});

router.post('/register', function(req, res) {
  var sellerID = req.cookies.SID;

  var body = req.body;
  var product_img = body.product_img;
  var product_name = body.product_name;
  var product_price = body.product_price;
  var total_number = body.total_number;
  var discount_num1 = body.discount_num1;
  var discount_num2 = body.discount_num2;
  var discount_num3 = body.discount_num3;
  var date = body.date;
  var time = body.time;
  var school = body.school;
  var discount1 = body.discount1;
  var discount2 = body.discount2;
  var discount3 = body.discount3;
  var description = body.description;

  connection.query("INSERT INTO Item VALUES (?,?,?,now(),?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[0,sellerID,product_img, date+" "+time,total_number,
  description,total_number,product_price,
  product_name,school,discount1, discount2,
  discount3, discount_num1, discount_num2,
  discount_num3, 1], function(err, result){
    if(err) throw err;
    console.log(result);
    console.log("Item inserted successfully");
  })
});




module.exports = router;
