angular.module('crowdsourcing')

    .controller('rankController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    $scope.loadingshow = true;
    if ($stateParams.id != null) {
      $scope.id= $stateParams.id;
      $scope.rank = $stateParams.currentRank;
      $scope.hoursCompleted = $stateParams.hoursCompleted;
      $scope.nextRank = $stateParams.nextRank;
      $scope.nextRankMin = $stateParams.nextRankMin;
      $scope.minsCompleted = $stateParams.minsCompleted;
      $scope.nextPts = parseInt($scope.nextRankMin) - parseInt($scope.hoursCompleted);
      if($scope.nextRank == "NA" && $scope.nextRankMin == "NA")
      {
        $scope.toDisplayInformation = "Platinum is the highest rank available.";
      }
      else
      {
        $scope.toDisplayInformation = $scope.nextPts +" points to "+$scope.nextRank;
      }
    }

    $http.get(apiUrl+"retrieveRankingDetails?id="+$scope.id,{timeout: 6000})
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null ) {
          $scope.completed = userDetails.completed;
          $scope.withdrawn = userDetails.withdrawn;
          $ionicLoading.hide();
          $scope.loadingshow = false;
        }
      })
      .error(function (data) {
        $scope.loadingshow = false;
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">Error in connection. Please try again.</h6> ',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button button-stable',

            },
          ]
        });
      });
  });
