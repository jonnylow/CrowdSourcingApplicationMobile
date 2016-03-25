angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory, $ionicLoading, $ionicModal, apiUrl) {
      //reset userLat and userlng
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");

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

        if (window.localStorage.getItem("intro")==null){
          $state.go('introduction',{},{reload:true});
        }
    });
