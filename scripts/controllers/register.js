
angular.module('Note')
  .controller('RegisterCtrl', ['$window', '$scope', '$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';

      $scope.register = function(){
        $scope.errorMsg = '';
        var data = {
          username : $scope.username,
          password : $scope.password,
          passwordRepeat : $scope.passwordRepeat
        };

        $http.post('/register', data)
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
