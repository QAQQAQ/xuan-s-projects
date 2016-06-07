
var appID='wxd882578b7f337c54';
var appSecret='39474f9f93c7a6c9f87109a1610573ad';

var getToken=require('./token.js').getToken;
var request=require('request');
var fs=require('fs');

function getUserInfo(openID){
    var token=getToken(appID,appSecret);
    var result;
//    JSON.parse(token);
    console.log('1'+token);    
    request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token.access_token+'&openid='+openID+'&lang=zh_CN',function(err,res,data){
        if(!err &&　res.statusCode==200){
            console.log('2'+data);
            /*if(data !==undefined){
     		console.log('---4---');
		return data;
            }*/
            result=data;
            return result;
        }
    });
}
exports.getUserInfo=getUserInfo;
