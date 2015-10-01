angular.module('crowdsourcing')

    .controller('scanController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.myLocation = {
          lng : '',
          lat: ''
        }
        $scope.drawMap = function(position) {
          //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
          $scope.$apply(function() {
            $scope.myLocation.lng = position.coords.longitude;
            $scope.myLocation.lat = position.coords.latitude;

            $scope.map = {
              center: {
                latitude: $scope.myLocation.lat,
                longitude: $scope.myLocation.lng
              },
              zoom: 11,
              pan: 1
            };

            $scope.marker = {
              id: 0,
              coords: {
                latitude: $scope.myLocation.lat,
                longitude: $scope.myLocation.lng
              }
            };

            $scope.marker1 = {
              id: 1,
              coords: {
                latitude: 45,
                longitude: -73
              }
            };
          });
        }

        navigator.geolocation.getCurrentPosition($scope.drawMap);
    });
