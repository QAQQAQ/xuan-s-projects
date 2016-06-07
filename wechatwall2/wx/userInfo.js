/**
 * Created by lenovo on 2016/5/31.
 */
var appID = require('../config').appID;
var appSecret = require('../config').appSecret;

var getToken = require('./token').getToken;

var request = require('request');
/*
 由openID获取用户的信息
 */

function getUserInfo(openID){
    console.log("openID" + openID);
    return getToken(appID, appSecret).then(function(res){
        var token = res.access_token;

        return new Promise(function(resolve, reject){
            request('https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openID+'&lang=zh_CN',function(err, res, data){
                resolve(JSON.parse(data));
            });
        });
    }).catch(function (err) {
        console.log(err);
    });
}

module.exports = {
    getUserInfo:getUserInfo
};