//微信墙后端程序
var http = require('http');
var qs = require('qs');
var config=require('../config');
var checkSignature=require('./check');
var io=require('../service/wxapp');
var getUserInfo = require('./userInfo').getUserInfo;
var replyText = require('./reply').replyText;


var server = http.createServer(function (request, response) {

  //解析URL中的query部分，用qs模块(npm install qs)将query解析成json
  var query = require('url').parse(request.url).query;
  var params = qs.parse(query);
  //1.
  if(!checkSignature(params, config.token)){
    //如果签名不对，结束请求并返回
    response.end('signature fail');
    return;
  }
  if(request.method == "GET"){
    //如果请求是GET，返回echostr用于通过服务器有效校验
    response.end(params.echostr);
  }else{
    //否则是微信给开发者服务器的POST请求
    var postdata = "";
    request.addListener("data",function(postchunk){
        postdata += postchunk;
    });
    //获取到了POST数据
    request.addListener("end",function(){
      //将xml字符串转化为文json
      var parseString = require('xml2js').parseString;
      //将用户消息xml字符串转化为文json
      parseString(postdata, function (err, result) {
        if(err){
            console.log(err);
        } else {
          textMessage(result,response);
        }
      });
    });
  }
});
function textMessage(result,response){
  //由openID获得用户信息
  console.log('wechatMessage:', result);
  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              console.log('userInfo: ', userInfo);
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              // io.messages.push(result.xml.Content[0]);
              // io.sockets.emit("message",result.xml.Content[0]);
              io.messages.unshift(result);
              io.sockets.emit("message",result);
              var res = replyText(result, '消息发送成功！');
              response.end(res);
            });
}
server.listen(config.wxPort);
console.log("Weixin server runing at port: " + config.wxPort + ".");
