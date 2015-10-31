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

    $scope.logout = function () {
      window.localStorage.removeItem("loginUserName");
      window.localStorage.removeItem("loginId");
      window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      //window.location.reload(true);
      $state.go('login', {}, {reload: true});
      //$state.transitionTo('loginHome', null, {'reload':true});
    }

    $scope.login = function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      $state.go('login', {}, {reload: true});
    }

    $scope.scan = function () {
      $state.go('scan', {}, {reload: true});
    }

          // .fromTemplateUrl() method
          if (window.localStorage.getItem("loginUserName") == null) {
              $ionicPopover.fromTemplateUrl('templates/home/menu_popout_guest.html', {
                scope: $scope
              }).then(function (popover) {
                $scope.popover = popover;
              });
            }
            else {
              $ionicPopover.fromTemplateUrl('templates/home/menu_popout.html', {
                scope: $scope
              }).then(function (popover) {
                $scope.popover = popover;
              });
          }

        $scope.openPopover = function($event) {
          $scope.popover.show($event);
        };
        $scope.closePopover = function() {
          $scope.popover.hide();
        };
        //Cleanup the popover when we're done with it!
        $scope.$on('$destroy', function() {
          $scope.popover.remove();
        });

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
