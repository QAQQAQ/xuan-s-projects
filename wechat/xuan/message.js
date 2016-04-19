/**
 * Created by lenovo on 2016/4/18.
 */
/**
 * Created by lenovo on 2016/4/17.
 */

var PORT = 8070;
var http = require('http');
var qs = require('qs');
var TOKEN = 'millie';

function checkSignature(params, token) {
  var key = [token, params.timestamp, params.nonce].sort().join('');
  var sha1 = require('crypto').createHash('sha1');
  sha1.update(key);
  return sha1.digest('hex') == params.signature;
}

var server = http.createServer(function(request, response) {
  var query = require('url').parse(request.url).query;
  var params = qs.parse(query);
  //console.log(params);
  // console.log("token-->",TOKEN);
  //如果签名不对，结束请求并返回
  if (!checkSignature(params, TOKEN)) {
    response.end('signature fail');
    return;
  }

  if (request.method == "GET") {
    //如果请求是GET，返回echostr用于通过服务器有效校验
    response.end(params.echostr);
  } else {
    //否则是微信给开发者服务器的POST请求
    var postdata = "";
    request.addListener("data", function(postchunk) {
      postdata += postchunk;
    });
    //获取到了POST数据
    request.addListener("end", function() {
      var parseString = require('xml2js').parseString;
      var content = '';
      parseString(postdata, function(err, result) {
        if (!err) {
          console.log(result.xml.MsgType);
          var reqType = result.xml.MsgType.toString();
          var reqContent = result.xml.Content && result.xml.Content.toString();
          var currentDate = new Date();
          console.log(reqType);
          switch (reqType) {
            case "text":
              content = '这是文本消息。';
              break;
            case "image":
              content = '这是图片消息。';
              break;
            case "voice":
              content = '这是语音消息。';
              break;
            case "video":
              content = '这是视频消息。';
              break;
            case "shortvideo":
              content = '这是小视频消息。';
              break;
            case "location":
              content = '这是地理位置消息。';
              break;
            case "link":
              content = '这是链接消息。';
              break;
            default:
              break;
          }
          switch (reqContent) {
            case "赵烜":
              content = '赵烜是小火山！';
              break;
            case "张浩":
              content = '张浩是小火炉！';
              break;
            default:
              break;
          }
          resMsg = '<xml>' +
            '<ToUserName><![CDATA[' + result.xml.FromUserName.toString() + ']]></ToUserName>' +
            '<FromUserName><![CDATA[' + result.xml.ToUserName.toString() + ']]></FromUserName>' +
            '<CreateTime>' + currentDate + '</CreateTime>' +
            '<MsgType><![CDATA[text]]></MsgType>' +
            '<Content><![CDATA['+content+']]></Content>' +
            '</xml>';
          console.log('resMsg', resMsg);
          response.setHeader('Content-Type', 'text/xml');
          response.end(resMsg);
        }
      });
    });
  }

});

server.listen(PORT);
console.log("Server running at port " + PORT + ".");
