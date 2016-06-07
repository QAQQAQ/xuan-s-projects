var express=require('express');
var app=express();
var http=require('http').Server(app);
app.use(express.static(__dirname+'/client'));

//(微信墙前端)当用户发送请求时，返回统一的页面
app.use(function(req,res){
    res.sendFile(__dirname+'/client/index.html');
});


var io=require('socket.io').listen(server);

io.sockets.on('connection',function(socket){
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

var server=app.listen(3006,function(){
    console.log("app is listen at port 3006");
});

