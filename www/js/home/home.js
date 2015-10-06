angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout) {

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
      window.location.reload(true);
      $state.go('loginHome', {}, {reload: true});
    }


    $scope.mainpage = function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      $state.go('loginHome', {}, {reload: true});
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

    });
