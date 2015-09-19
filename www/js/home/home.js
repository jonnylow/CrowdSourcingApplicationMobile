angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http) {
        $scope.nric = window.localStorage.getItem("userNRIC");

        $scope.viewAccount = function() {
          $state.go('viewAccount', {}, {reload: true});
        }

    });
