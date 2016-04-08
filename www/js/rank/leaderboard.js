/**
 * This js script will handle all logic for leaderboard. Its corresponding html file is leaderboard.html.
 * The main purpose of this page is just to handle any logic for the content when displaying user's leaderboard information*/

angular.module('crowdsourcing')

    .controller('leaderboardController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl, $ionicHistory) {

    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //if user not login, direct to login
    if(window.localStorage.getItem("token") != null) {
      $scope.name = window.localStorage.getItem("loginUserName");
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }
    else {
      $scope.loadingshow = true;
      var myPopup = $ionicPopup.show({
        title: '<h6 class="popups title">Who are you?</h6>',
        subTitle: '<br><h6 class="popups">Login to access this content</h6>',
        scope: $scope,
        buttons: [
          {
            text: 'OK',
            type: 'button button-stable',
            onTap: function(e) {
              $state.go('landingPage', {}, {reload: true});
            }
          },
        ]
      });
    }

    if(window.localStorage.getItem("token") != null) {
      //use web service to get volunteer leaderboard information and get points based on the mins contributed by the user
      $http.get(apiUrl + "volunteerLeaderboard?token=" + window.localStorage.getItem("token"), {timeout: 12000})
        .success(function (data) {
          if (data != null) {
            $scope.volunteersArray = [];
            $scope.pos = data.pos;
            $scope.rank = data.rank;
            $scope.totalMinutes = Math.floor(data.totalMinutes / 60);

            var toRun = 0;
            if (data.returnArray.length <= 10) {
              toRun = data.returnArray.length;
            }
            else {
              toRun = 10;
            }
            for (var i = 0; i < toRun; i++) {
              var info = data.returnArray[i].split(",");

              $scope.volunteersArray.push({
                name: info[1],
                mins: Math.floor(info[0] / 60),
                pos: info[2]
              });
            }

            $scope.loadingshow = false;
            $ionicLoading.hide();
          }
        })

      //back function. To redirect user back to previous page, depending where the user came from, page retrieve as soon as this page is loaded
      $scope.back = function () {
        if ($scope.backView != null) {
          $scope.backView.go();
        }
        else {
          $state.go('tab.home', {}, {reload: true});
        }
        //$ionicHistory.goBack();
      }
    }
  });
