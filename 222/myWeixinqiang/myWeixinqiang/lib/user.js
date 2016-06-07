/**
 * Created by ASUS on 2016/5/31.
 */
var appID='wx051fbb7030998438';
var appSecret='70cdcb7b45e93f2765392e400c7578e1';

var Promise=require('promise');
var getToken=require('./token.js').getToken;
var request=require('request');

function getUserInfo(openID){
    return getToken(appID,appSecret).then(function(res){
        var token=res.access_token;
        console.log('user.js '+token);
        return new Promise(function(resolve,reject){
            request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openID+'&lang=zh_CN',function(err,res,data){
                console.log(data);
		resolve(JSON.parse(data));
            });
        });
    }).catch(function(err){
        cnsole.log(err);
    });
}

exports.getUserInfo=getUserInfo;
