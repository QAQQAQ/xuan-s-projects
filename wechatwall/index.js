//微信墙
var http = require('http');
var qs = require('qs');
var config=require('./lib/config');
var checkSignature=require('./lib/check');

var getUserInfo = require('./lib/user').getUserInfo;
var replyText = require('./lib/reply').replyText; 

var wss = require('./lib/ws.js').wss;


var server = http.createServer(function (request, response) {

  //解析URL中的query部分，用qs模块(npm install qs)将query解析成json
  var query = require('url').parse(request.url).query;
  var params = qs.parse(query);
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

      parseString(postdata, function (err, result) {
        if(!err){
        	messageType(result,response);
        }
      });
    });
  }
});

server.listen(config.wxPort);
console.log("Weixin server runing at port: " + config.wxPort + ".");


function messageType(result,response){
	switch(result.xml.MsgType[0]){
		case 'text':textMessage(result,response); break;
		case 'image':imageMessage(result,response); break;
		case 'voice':voiceMessage(result,response); break;
		case 'shortvideo':shortvideoMessage(result,response); break;
		case 'location':locationMessage(result,response); break;
		case 'link':linkMessage(result,response); break;
	}
}
function messageContent(result,response){
    switch(result.xml.MsgContent[0]){
        case '赵烜':zhaoxuanMessage(result,response); break;
        case '张浩':zhanghaoMessage(result,response); break;

    }
}
function zhaoxuanMessage(result,response){
    getUserInfo(result.xml.FromUserName[0])
        .then(function(userInfo){
            //获得用户信息，合并到消息中
            result.user = userInfo;
            //将消息通过websocket广播
            wss.broadcast(result);
            var res = replyText(result, '赵烜是小火山。');
            response.end(res);
        });
}

function zhanghaoMessage(result,response){
    getUserInfo(result.xml.FromUserName[0])
        .then(function(userInfo){
            //获得用户信息，合并到消息中
            result.user = userInfo;
            //将消息通过websocket广播
            wss.broadcast(result);
            var res = replyText(result, '张浩是小火炉。');
            response.end(res);
        });
}
function textMessage(result,response){
  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);
              var res = replyText(result, '这是一个文本消息。');
              response.end(res);
            });
}
function imageMessage(result,response){

  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);
              var res = replyText(result, '这是一个图片消息。');
              response.end(res);
            });
}
function voiceMessage(result,response){
  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);
              var res = replyText(result, '这是一个语言消息。');
              response.end(res);
            });
}
function shortvideoMessage(result,response){
  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);
              var res = replyText(result, '这是一个小视频消息。');
              response.end(res);
            });
}
function locationMessage(result,response){

  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);

              var res = replyText(result, '这是一个位置消息。');
              response.end(res);
            });
}
function linkMessage(result,response){
  getUserInfo(result.xml.FromUserName[0])
            .then(function(userInfo){
              //获得用户信息，合并到消息中
              result.user = userInfo;
              //将消息通过websocket广播
              wss.broadcast(result);
              var res = replyText(result, '这是一个链接消息。');
              response.end(res);
            });
}
