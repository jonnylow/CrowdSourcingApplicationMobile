angular.module('crowdsourcing')

    .controller('leaderboardController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
    if(window.localStorage.getItem("token") != null) {
      $scope.name = window.localStorage.getItem("loginUserName");
      $scope.id = window.localStorage.getItem("loginId");
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
            text: '<b>Ok</b>',
            type: 'button button-stable',
            onTap: function(e) {
              $state.go('landingPage', {}, {reload: true});
            }
          },
        ]
      });
    }

    $http.get(apiUrl+"volunteerLeaderboard?token="+window.localStorage.getItem("token"))
      .success(function (data) {
        if(data != null)
        {
          $scope.volunteersArray=[];
          $scope.pos = data.pos;
          $scope.rank = data.rank;
          $scope.totalHours = data.totalHours;

          for(var i = 0; i<data.returnArray.length; i++)
          {
            var info = data.returnArray[i].split(",");

            $scope.volunteersArray.push({
              name: info[0],
              mins: Math.floor(info[1]/60),
              pos: info[2]
            });
          }

          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      })
  });
