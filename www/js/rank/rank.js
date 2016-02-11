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

    $http.get(apiUrl+"retrieveRankingDetails?id="+$scope.id)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null ) {
          $scope.completed = userDetails.completed;
          $scope.withdrawn = userDetails.withdrawn;
          $ionicLoading.hide();
          $scope.loadingshow = false;
        }
      })
  });
