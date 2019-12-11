var express = require('express');
var router = express.Router();
//var path = require('path');
var mysql = require("mysql");
var dbconfig = require('../../config/database.js');
var connection = mysql.createConnection(dbconfig);


/* 시작 화면 */
<<<<<<< HEAD
router.post('/', function(req, res, next) {
  var name = req.body.data;
  res.render('sellerPageHTML/update_product');
});

router.post('/', function(req, res){
  var name = req.body.data;
  var sid = req.cookies.SID
  console.log("test"+name);
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


=======
router.get('/', function(req, res, next) {

  res.render('start');
});

>>>>>>> origin
module.exports = router;
