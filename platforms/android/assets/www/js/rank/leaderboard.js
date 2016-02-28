angular.module('crowdsourcing')

    .controller('leaderboardController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    $scope.loadingshow = true;
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
