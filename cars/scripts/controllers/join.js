
angular.module('Cars')
  .controller('JoinCtrl', ['$window', '$scope', '$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';
      $scope.dataList = [
        {
          route: '从软微到高米店',
          time: '9:30',
          personCount: 2
        },
        {
          route: '从高米店到软微',
          time: '5:40',
          personCount: 1
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
