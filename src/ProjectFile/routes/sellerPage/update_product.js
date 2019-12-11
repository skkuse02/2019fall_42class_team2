var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 시작 화면 */
router.post('/', function(req, res) {
  var body = req.body;
  var name = body.
  console.log(body);
  res.render('sellerPageHTML/update_product');
});


router.post('/delete', function(req, res){
  var body = req.body;
  var items = body.check;

  for(var i = 0; i<items.length; i++){
    connection.query("update History h, Item i set h.h_status = ? where i.ItemID = ? and i.is_Available = i.cur_total"[0, items[i]]);
    connection.query("update Item set i_status = ? where ItemID = ? and is_Available = cur_total",[0, items[i]]);
  }
});

module.exports = router;
