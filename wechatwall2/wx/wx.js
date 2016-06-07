/**
 * Created by lenovo on 2016/6/7.
 */
//微信墙后端程序
var http = require('http');
var qs = require('qs');
var config = require('../config');
var checkSignature = require('./check');
var io = require('../service/wxapp');
var getUserInfo = require('./userInfo').getUserInfo();
var replyText = require('./reply').replyText;

var server = http.createServer(function (request, response) {
    //解析URL中的query部分，用qs模块(npm install qs)将query解析成json
    var query = require('url').parse(request.url).query;
    var params = qs.parse(query);
    if(!checkSignature(params, config, token)){
        response.end('signature  fail');
        return;
    }
    if(request.method == 'GET'){
    //如果请求是GET，返回echostr用于通过服务器有效校验
        response.end(params.echostr);
    }else{
        //否则是微信给开发者服务器的POST请求
        var postdata = '';
        request.addListener("data", function (postchunk) {
            postdata += postchunk;
        });
        //获取到了POST数据
        request.addListener("end", function () {
            //将XML字符串转化为json
            parseString(postdata, function (err, result) {
                if(err){
                    console.log(err);
                }else{
                    textMessage(result, response);
                }
            });
        });
    }
});
function textMessage(result, response){
    //由openID获得用户信息
    getUserInfo(result.xml.FromUserName[0])
        .then(function (userInfo) {
            //获取用户信息，合并到消息中
            console.log("ddddddddddd")
            result.user = userInfo;
            //将消息通过websocket广播
            io.message.push(reslut.xml.Content[0]);
            io.socket.emit("message", result.xml.Content[0]);
            var res = replyText(result, '消息发送成功！');
            response.end(res);
        });
    server.listen(config.wxPort);
}