angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory, $ionicLoading) {
      //reset userLat and userlng
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");

      $scope.login = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });

        if (window.plugins != null) {
          window.plugins.nativepagetransitions.slide(
            {
              'href': '#/login',
              'direction': "up",
              'duration': 500,
              'iosdelay': 0 // the new property
            }
          );
        }
        else {
          $state.go('login', {}, {reload: true});
        }
      }
    });
