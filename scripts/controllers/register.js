
angular.module('Note')
  .controller('RegisterCtrl', ['$window', '$scope', '$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';

      $scope.register = function(){
        var data = {
          username : $scope.username,
          password : $scope.password,
          passwordRepeat : $scope.passwordRepeat
        };

        $http.post('/register', data)
          .success(function(data, status){
            $scope.errorMsg = data;
          });
      };
    }
  ]);
