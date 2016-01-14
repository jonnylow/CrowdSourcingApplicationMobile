angular.module('crowdsourcing')

    .controller('rankController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
    if ($stateParams.id != null) {
      $scope.id= $stateParams.id;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    $http.get(apiUrl+"RetrieveRankingDetails.php?id="+$scope.id)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null ) {
          $scope.completed = userDetails[0].completed;
          $scope.withdrawn = userDetails[0].withdrawn;
          $ionicLoading.hide();
        }
      })
  });
