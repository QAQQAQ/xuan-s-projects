
var PORT=8060;
var TOKEN="millie";

var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var qs=require('qs');
var getUserInfo=require('./lib/user.js').getUserInfo;

var messages=[];

//(微信墙前端)当用户发送请求时，返回统一的页面
app.use('/',express.static(__dirname+'/client'));

io.on('connection',function(socket){
    app.get('/',function(request,response,next){
        var query=require('url').parse(request.url).query;
        var params=qs.parse(query);

        if(!checkSignature(params,TOKEN)){
            response.end('signature fail');
            return;
        }
        response.end(params.echostr);
    });
    app.post('/',function(request,response,next){
        var postdata="";
        request.addListener("data",function(postchunk){
            postdata +=postchunk;
        });

        //获取post数据
        request.addListener("end",function(){
            var parseString =require('xml2js').parseString;
            parseString(postdata,function(err,result){
                getUserInfo(result.xml.FromUserName[0]).then(function(userInfo){
			result.user=userInfo;
                        console.log(userInfo+' '+result);
			messages.unshift(result);
                        io.sockets.emit('newMessage',result);
                        response.end('success');            
		});
            });
        });
    });
    socket.emit('connected');
    socket.broadcast.emit('newClient',new Date());
    socket.on('getAllMessages',function(){
        socket.emit('allMessages',messages);
    });
    socket.on('addMessage',function(message){
	messages.unshift(message);
        io.sockets.emit('newMessage',message);
    });
    socket.on('disconnect',function(){
        console.log('disconnect');
    });
});
function checkSignature(params,token){
    var key=[token,params.timestamp,params.nonce].sort().join('');
    var sha1=require('crypto').createHash('sha1');
    sha1.update(key);
    return sha1.digest('hex')==params.signature;
}


server.listen(PORT);
console.log("Server is running at port:"+PORT+".");



