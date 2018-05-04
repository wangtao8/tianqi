var express = require('express');
var router = express.Router();
const AppId = 'wx97b277a1b249d245'
const AppSecret = '6df978e4f0d3faed2fec012b76999442'
const WXBizDataCrypt = require('./WXBizDataCrypt.js')// 解密微信运动 或 解密用户信息
var pc = ''
var data = ''

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.get('/getWark', function(req, res, next) {
	console.log('1')
	//使用解密工具，链接地址：
	//https://codeload.github.com/gwjjeff/cryptojs/zip/master
	pc = new WXBizDataCrypt(AppId, req.query.session_key)
	data = pc.decryptData(req.query.encryptedData, req.query.iv)
	res.send(data)
//	console.log(data)
})

module.exports = router;
