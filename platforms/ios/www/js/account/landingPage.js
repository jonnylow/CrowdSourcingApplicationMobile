angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory, $ionicLoading) {
      //reset userLat and userlng
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");

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
