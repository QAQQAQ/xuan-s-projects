/**
 * Created by lenovo on 2016/5/17.
 */
var myApp = angular.module("myApp",[]);
myApp.factory('ioService', function ($rootScope) {
    var socket = io.connect('http://123.206.71.158:8080');
    console.log("connecting");
    return {
        on: function (eventName, callback) {
            //�����¼�
            socket.on(eventName, function () {
                var args = arguments;
                //���ûص����������Ҹ�������Ӧ��״̬
                $rootScope.$apply(function(){
                    //Ĭ�������ǲ��ᴥ���¼�ѭ����
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
