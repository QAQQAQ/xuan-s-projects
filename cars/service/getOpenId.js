
/**
请求用户信息???有问题现在
https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=ACCESS_TOKEN
{
   "userid": "zhangsan",
   "agentid": 1
}
*/
var https = require('https');
var querystring = require('querystring');
var config=require('../config');
var token = require('./token');

function getOpenId(userId,callback) {
	
	console.log('userId: ' + userId);
	token.getToken(config.corpID,config.secret).then(function(token){
        var post_data = querystring.stringify({
   			'userid': '1106579094',
   			'access_token':token
		});

		var post_option = {
		    host: 'qyapi.weixin.qq.com',
		    port: 80,
		    path: '/cgi-bin/user/convert_to_openid',
		    method: 'POST'
		};
		post_option.headers = {
   			'Content-Type' : 'application/x-www-form-urlencoded',
   		    'Content-Length' : post_data.length,
   		};

		var req = https.request(post_option, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  var data='';
		  res.on('data', function (chunk) {
		     data+=chunk;
		  });
		  res.on('end', function () {
		    callback(null,data.openid);
		  });
		});
		// write data to request body
		console.log(post_data+"ooooo");
		req.write(post_data);
		req.end();
		req.on('error', (e) => {
		  console.log("dddd");
		});
	});
}
module.exports = {getOpenId: getOpenId};