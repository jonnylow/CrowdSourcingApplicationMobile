angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http) {
        $scope.name = window.localStorage.getItem("loginUserName");

        $scope.viewAccount = function() {
          $state.go('viewAccount', {}, {reload: true});
        }

        $scope.logout = function() {
          window.localStorage.removeItem("loginUserName");
          window.localStorage.removeItem("loginUserEmail");
          window.localStorage.removeItem("loginUserPassword");
          window.localStorage.removeItem("loginUserContactNumber");
          window.localStorage.removeItem("loginUserDOB");

          $state.go('login', {}, {reload: true});
        }

        $scope.scan = function() {
          $state.go('scan', {}, {reload: true});
        }

    });
