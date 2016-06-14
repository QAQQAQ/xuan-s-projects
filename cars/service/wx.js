var request = require('request');
var token = require('./token');
var config = require('../config');

function wx(code,callback) {
	//微信获取用户资料第二步通过code换取网页授权access_token
	token.getToken(config.corpID,config.secret).then(function(token){
			//console.log("wx 中获得的url");
			//console.log('https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code)
			request.get({
				url : 'https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token='+token+'&code='+code
			}, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var jsondata = JSON.parse(body);
					//console.log("jsondata:");
					//console.log(jsondata);
					//第四步拉取用户信息,
					request.get({
						//url : 'https://api.weixin.qq.com/sns/userinfo?access_token=' +  + '&openid=' + jsondata.openid + '&lang=zh_CN'
						url:"https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token="+token+"&userid="+jsondata.UserId
					}, function(error, response, body) {
						if (!error && response.statusCode == 200) {
							var userdata = JSON.parse(body);
							callback(error,userdata);
						} else {
							callback(error);
						}
					});
				} else {
		//			console.log("请求用户userid失败");
					callback(error);
				}
			});
	});
	
}
exports.wx = wx;
