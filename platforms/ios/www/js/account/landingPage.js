angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory) {
      $scope.login = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('login', {}, {reload: true});
        if (window.plugins != null) {
          window.plugins.nativepagetransitions.slide(
            {"direction": "up"}
          );
        }
      }

      $scope.registration = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('registration', {}, {reload: true});
        if (window.plugins != null) {
          window.plugins.nativepagetransitions.slide(
            {"direction": "up"}
          );
        }
      }
    });
