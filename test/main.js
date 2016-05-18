var app = angular.module('myApp', [
  'pluf'
]);
app.controller('myCtrl', function($scope, $usr) {
    $scope.name= "hadi";
    $usr.session().then(function(user){
      $scope.user = user;
    })

    $scope.login = function(credentioal){
      $usr.login(credentioal.login, credentioal.password).then(function(user){
        $scope.user = user;
      }, function(ex){
        alert("Login faile")
      });
    }

    $scope.logout = function(){
      $usr.logout().then(function(){
        $scope.user = null;
      })
    }
});
