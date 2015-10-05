angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory) {

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
        }
        else {
          $state.go('login', {}, {reload: true});
        }

        $scope.logout = function() {
          window.localStorage.removeItem("loginUserName");
          window.localStorage.removeItem("loginId");
          window.localStorage.clear();
          $ionicHistory.clearCache();
          $ionicHistory.clearHistory();
          $ionicHistory.nextViewOptions({ disableBack: true, historyRoot: true });
          $scope.closePopover();

          $state.go('login', {}, {reload: true});
        }

        $scope.scan = function() {
          $state.go('scan', {}, {reload: true});
        }

        // .fromTemplateUrl() method
        $ionicPopover.fromTemplateUrl('templates/home/menu_popout.html', {
          scope: $scope
        }).then(function(popover) {
          $scope.popover = popover;
        });

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
