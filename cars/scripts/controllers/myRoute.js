
angular.module('Cars')
  .controller('MyRouteCtrl', ['$window', '$scope', '$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';
      $scope.dataList = [
        {
          route: '从软微到高米店',
          time: '9:30',
          personCount: 2
        },
        {
          route: '从软微到本部',
          time: '19:30',
          personCount: 2
        }
      ];
      $scope.join = function(){
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
