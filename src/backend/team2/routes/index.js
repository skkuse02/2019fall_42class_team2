var express = require('express')
 var app = express()
 var router = express.Router()
 var path = require('path')


 var join = require('./join/index')

 router.get('/', function(req,res){
     console.log('indexjs . path loaded');
     res.sendFile(path.join(__dirname + "/../public/htmlFile/HTML/loginPageHTML/register_consumer.html"))
 });
 router.use('/join', join)

 module.exports = router;