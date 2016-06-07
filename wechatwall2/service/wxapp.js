/**
 * Created by lenovo on 2016/6/7.
 */
var config = require('../config');
var io = require('socket.io').listen(config.sockPort);
console.log("socket port is " + config.sockPort);
io.messages = [];
io.sockets.on('connection', function(socket){
    //�û�������Ϣ
    socket.on('messages', function(){
        socket.emit('messages', io.messages);
    });

   socket.on('message', function (message) {
       //�û�������Ϣ
       io.messages.push(message);
       console.log(message);
       io.sockets.emit('message', message);//�ͻ��˸�����Ϣ
   });
});

module.exports = io;