/**
 * Created by ASUS on 2016/5/30.
 */
var appID='wx051fbb7030998438';
var appSecret='70cdcb7b45e93f2765392e400c7578e1';

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
