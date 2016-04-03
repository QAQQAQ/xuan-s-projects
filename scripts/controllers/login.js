
angular.module('Note')
  .controller('LoginCtrl', ['$window', '$scope','$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';
      $scope.login = function(){
        $scope.errorMsg = '';
        var data = {
          username : $scope.username,
          password : $scope.password
        };
        $http.post('/login',data)
          .success(function(data, status){
            if(data === 'success'){
              $window.location.href = '/';
            }else{
              $scope.errorMsg = data;
            }
          });
      };
    }
  ]);
