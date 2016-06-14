
angular.module('Cars')
  .controller('PublishCtrl', ['$window', '$scope', '$http',
    function($window, $scope, $http) {
      $scope.errorMsg = '';
      $scope.routeList = [
        {
          id: 1,
          name: '软微到高米店'
        },
        {
          id: 2,
          name: '高米店到软微'
        },
        {
          id: 3,
          name: '软微到本部'
        },
        {
          id: 4,
          name: '本部到软微'
        }
      ];
      $scope.hourList = [
        { id: 1,name: '1'},
        { id: 2,name: '2'},
        { id: 3,name: '3'},
        { id: 4,name: '4'},
        { id: 4,name: '5'},
        { id: 5,name: '6'},
      ];
      $scope.minuteList = [
        { id: 1,name: '10'},
        { id: 2,name: '20'},
        { id: 3,name: '30'},
        { id: 4,name: '40'},
        { id: 4,name: '50'},
        { id: 5,name: '60'},
      ];
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
