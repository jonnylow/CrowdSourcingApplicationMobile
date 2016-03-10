angular.module('crowdsourcing')

    .controller('leaderboardController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl, $ionicHistory) {
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
          $scope.totalMinutes = Math.floor(data.totalMinutes/60);

          var toRun = 0;
          if(data.returnArray.length <=10)
          {
            toRun = data.returnArray.length;
          }
          else
          {
            toRun = 10;
          }
          for(var i = 0; i<toRun; i++)
          {
            var info = data.returnArray[i].split(",");

            $scope.volunteersArray.push({
              name: info[1],
              mins: Math.floor(info[0]/60),
              pos: info[2]
            });
          }

          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      })

    $scope.back=function()
    {
      if($scope.backView != null)
      {
        $scope.backView.go();
      }
      else
      {
        $state.go('tab.home', {}, {reload: true});
      }
      //$ionicHistory.goBack();
    }
  });
