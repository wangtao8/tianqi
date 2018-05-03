var WXBizDataCrypt = require('./WXBizDataCrypt')
var getInfo = function (appId, sessionKey, iv, encryptedData){

  var pc = new WXBizDataCrypt(appId, sessionKey)

  var data = pc.decryptData(encryptedData, iv)

  console.log('后台打印:', data)

  return data
}
// console.log('解密后 data: ', data)
export default {
  getInfo
}