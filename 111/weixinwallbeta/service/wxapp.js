//接收用户发送的请求
var config=require('../config')
var io=require('socket.io').listen(config.sockPort);
console.log("socket port is "+config.sockPort)
io.messages=[];
io.sockets.on('connection',function(socket){
	//用户请求消息
	socket.on('messages',function(){
		socket.emit('messages',io.messages);
	});
	
	socket.on('message',function(message){
		//用户发来消息
		io.messages.push(message);
		console.log(message);
		//socket.broadcast.emit('message',message);//客户端跟新消息
		io.sockets.emit('message',message);//客户端跟新消息
	});
});
module.exports=io;

