var express = require('express')
var app = express()
var router = express.Router()
var path = require('path')
var mysql = require('mysql')



var connection = mysql.createConnection({
    host     : '',
    user     : '',
    password : '',
    port     : 3306,
    database : ''
});

connection.connect();


router.get('/', function(req,res){
    console.log('get join url')
    res.sendFile(path.join(__dirname, '../../public/htmlFile/HTML/loginPageHTML/register_consumer.html'))
})

router.post('/', function(req,res){
    /*var body = req.body;
    var email = body.email;
    var name = body.name;
    var passwd = body.password;
    */
   /* var query = connection.query('insert into consumer (테이블 속성 넣을 곳) values ("' + email + '","' + name + '","' + passwd + '")', function(err, rows) {
        if(err) { throw err;}
        console.log("inserted");
    })*/
})



module.exports = router;