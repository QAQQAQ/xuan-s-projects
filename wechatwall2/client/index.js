/**
 * Created by lenovo on 2016/5/17.
 */
var myApp = angular.module("myApp",[]);
myApp.factory('ioService', function ($rootScope) {
    var socket = io.connect('http://123.206.71.158:8062');
    console.log("connecting");
    return {
        on: function (eventName, callback) {
            //监听事件
            socket.on(eventName, function () {
                var args = arguments;
                //调用回调函数，并且更新整个应用状态
                $rootScope.$apply(function(){
                    //默认情况是不会触发事件循环的
                    callback.apply(socket, args);
                });
            })
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback){
                        callback.apply(socket, args);
                    }
                })
            })
        }
    }
})
myApp.controller("ShowMessage", function ($scope, ioService){
    $scope.messages = [];
    ioService.emit('messages');
    ioService.on('messages', function (messages) {
        $scope.messages = messages;
    });
    ioService.on('messages', function (messages) {
        console.log(messages);
        $scope.messages.push(messages);
    });
    $scope.submitInfo = function () {
        if($scope.messages){
            ioService.emit('messages', $scope.messages);
        }
    }
});