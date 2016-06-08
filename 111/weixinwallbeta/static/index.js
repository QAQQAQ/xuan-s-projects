/**
 * Created by chh on 2016/4/26.
 */
var myApp=angular.module("myApp",[]);
myApp.factory('ioService',function($rootScope){
var socket=io.connect('www.zhaoxuan.net.cn:8080');
    console.log("connect is istablish");
    return {
        //监听事
        on:function(eventName,callback){
            //监听事件
            socket.on(eventName,function(){
                var args=arguments;
                //调用回调函数，并且更新整个整个应用状态
                $rootScope.$apply(function(){ //默认情况是不会触发事件循环的
                    callback.apply(socket,args);
                });
            });
        },
        emit:function(eventName,data,callback){
            socket.emit(eventName,data,function(){
                var args=arguments;
                $rootScope.$apply(function(){
                    if(callback){
                        callback.apply(socket,args);
                    }
                });
            });
        }
    };
});
myApp.controller("ShowMessage",function($scope,ioService){

    $scope.messages=[];
    ioService.emit('messages');
    ioService.on('messages',function(messages){
        $scope.messages=messages;
    });
    ioService.on('message',function(message){
         console.log(message);
         $scope.messages.push(message);
    });
    $scope.submitInfo=function(){
        if($scope.message){
            ioService.emit('message',$scope.message);
        }
    };
});
