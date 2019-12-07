var express = require('express');
var router = express.Router();


//로그아웃
router.post('/logout', function(req, res){
    res.clearCookie('SID'); //쿠키 삭제
    res.render('start', { pass: '1' });  //로그아웃, 첫 화면으로
});

module.exports = router;
