/**
 * This js script will handle all logic for the LandingPage. Its corresponding html file is landingPage.html.
 * The main purpose of this page is just to provide navigation to login/register page and home page
 */
angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory, $ionicLoading, $ionicModal, apiUrl) {
      //Removing stored lat and lng when user enter landing page
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");

      //if user has login previously, remove all stored user information from storage
      if(window.localStorage.getItem("loginId") != null)
      {
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
      }

      //Login method (to navigate user to login/register menu)
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

        //Getting started guide, will navigate to this page if user is logging in for the first time
        if (window.localStorage.getItem("intro")==null){
          $state.go('introduction',{},{reload:true});
        }
    });
