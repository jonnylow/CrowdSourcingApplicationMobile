angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout) {
    //checkConnection();
    //window.location.reload(true);
    if(typeof cordova != 'undefined'){
      cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
        if(!enabled)
        {
          $state.go('login', {}, {reload: true});
          var myPopup = $ionicPopup.show({
            title: '<b>Notice</b>',
            subTitle: 'No location services detected. Please enable before using iCare.',
            scope: $scope,
            buttons: [
              {
                text: 'Proceed to Location Services',
                type: 'button-calm',
                onTap: function(e) {
                  cordova.plugins.diagnostic.switchToLocationSettings();
                }
              },
            ]
          });
        }
      }, function(error){
        alert("The following error occurred: "+error);
      });
    }

    //NOTE BACKEND DEVELOPERS: remove latlng global vars from other logout function when stable
    navigator.geolocation.getCurrentPosition(function(pos) {
      window.localStorage.setItem("userLat", pos.coords.latitude);
      window.localStorage.setItem("userLong", pos.coords.longitude);
    });

    if (window.localStorage.getItem("loginUserName") != null) {
      $timeout(function() {
        $scope.name = window.localStorage.getItem("loginUserName");
      },1);
    }
    else {
      $timeout(function() {
        $scope.name = "Guest";
      },1);
    }

    $scope.scan = function () {
      $state.go('scan', {}, {reload: true});
    }


    //check connection
    function checkConnection() {
      var networkState = navigator.connection.type;

      var states = {};
      states[Connection.UNKNOWN] = 'Unknown connection';
      states[Connection.ETHERNET] = 'Ethernet connection';
      states[Connection.WIFI] = 'WiFi connection';
      states[Connection.CELL_2G] = 'Cell 2G connection';
      states[Connection.CELL_3G] = 'Cell 3G connection';
      states[Connection.CELL_4G] = 'Cell 4G connection';
      states[Connection.CELL] = 'Cell generic connection';
      states[Connection.NONE] = 'No network connection';

      if (states[networkState] == 'No network connection' || states[networkState] == 'Unknown connection'){
        var myPopup = $ionicPopup.show({
          title: '<b>Notice</b>',
          subTitle: 'No network connection detected. Please enable before using iCare.',
          scope: $scope,
          buttons: [
            {
              text: 'Proceed to Network Settings',
              type: 'button-calm',
              onTap: function(e) {
                cordova.plugins.diagnostic.switchToMobileDataSettings();
              }
            },
          ]
        });
      }
    }

    });
