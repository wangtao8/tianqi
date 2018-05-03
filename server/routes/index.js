var express = require('express');
var router = express.Router();
var WXBizDataCrypt = require('./WXBizDataCrypt')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send({ title: 'Express' });
});

router.get('/getWark',function(req, res, next) {
  var appId = 'wx97b277a1b249d245'
  var sessionKey = req.query.session_key
  var iv = req.query.iv
  var encryptedData = req.query.encryptedData
  
  var pc = new WXBizDataCrypt(appId, sessionKey)
  var data = pc.decryptData(encryptedData, iv)
	console.log('2222:', data)
  res.send('1')
})
module.exports = router;
