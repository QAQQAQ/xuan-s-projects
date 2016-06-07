/**
 * Created by lenovo on 2016/6/7.
 */
var config = require('../config');
var io = require('socket.io').listen(config.sockPort);
console.log("socket port is " + config.sockPort);
io.messages = [];
io.sockets.on('connection', function(socket){
    //用户请求消息
    socket.on('messages', function(){
        socket.emit('messages', io.messages);
    });

   socket.on('message', function (message) {
       //用户发来消息
       io.messages.push(message);
       console.log(message);
       io.sockets.emit('message', message);//客户端更新消息
   });
});

module.exports = io;