angular.module('crowdsourcing')

    .controller('leaderboardController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    $scope.loadingshow = true;
    console.log(apiUrl+"volunteerLeaderboard?token="+window.localStorage.getItem("token"))
    $http.get(apiUrl+"volunteerLeaderboard?token="+window.localStorage.getItem("token"))
      .success(function (data) {
        if(data != null)
        {
          $scope.pos = data.pos;
          $scope.rank = data.rank;
          $scope.totalHours = data.totalHours;
          //console.log(data.returnArray);
/*
          $scope.volunteersArray.push({
            distance: $scope.transportDistanceFromLatLng[i],
            time: $scope.transportTimeFromLatLng[i],
            location: $scope.transportLocationFromLatLng[i],
            elderly: $scope.elderlyIntials[i],
            marker: $scope.markers[i]
          });*/
          //console.log(data);
          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      })

  });
