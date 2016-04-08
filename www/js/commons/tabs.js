/**
 * This js script will handle all logic for dropdown menu. Its corresponding html file is tabs.html.
 * The main purpose of this page is just to handle any logic when user click on the dropdown menu buttons.
 */
angular.module('crowdsourcing')

    .controller('tabsController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout) {
      //depending on the user login status, display the correct menu
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

    //function for user to logout; it will remove all the runtime data store on storage
    $scope.logout = function () {
      var username = "";
      var password = "";
      window.localStorage.removeItem("loginUserName");
      window.localStorage.removeItem("loginId");
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");
      window.localStorage.removeItem("token");
      if(window.localStorage.getItem("loginUsernameToStore") != null && window.localStorage.getItem("loginPasswordToStore") != null)
      {
        username = window.localStorage.getItem("loginUsernameToStore");
        password = window.localStorage.getItem("loginPasswordToStore");
      }
      window.localStorage.clear();
      window.localStorage.setItem("intro", "done");
      window.localStorage.setItem("loginUsernameToStore", username);
      window.localStorage.setItem("loginPasswordToStore", password);
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      //window.location.reload(true);
      $state.go('landingPage', {}, {reload: true});
      //$state.transitionTo('loginHome', null, {'reload':true});
    }

    //function for user to login; provide the redirection to login page
    $scope.login = function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      $state.go('login', {}, {reload: true});
    }
    });
