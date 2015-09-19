angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http) {
        $scope.nric = window.localStorage.getItem("userNRIC");

        $scope.viewAccount = function() {
          $state.go('viewAccount', {}, {reload: true});
        }

        $scope.logout = function() {
          window.localStorage.removeItem("userNRIC");
          window.localStorage.removeItem("firstName");
          window.localStorage.removeItem("lastName");
          window.localStorage.removeItem("contactNo");
          window.localStorage.removeItem("address");
          window.localStorage.removeItem("password");
          window.localStorage.removeItem("dateOfBirth");
          window.localStorage.removeItem("score");
          window.localStorage.removeItem("photo");

          $state.go('login', {}, {reload: true});
        }
    });
