angular.module('crowdsourcing')

    .controller('activityConfirmationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.dateTime = new Date(window.localStorage.getItem("tempADateTime"));
      $scope.expectedDuration = window.localStorage.getItem("tempAExpectedDuration");
      $scope.locationFrom= window.localStorage.getItem("tempALocationFrom");
      $scope.locationTo = window.localStorage.getItem("tempALocationTo");
      $scope.locationFromAddress = window.localStorage.getItem("tempALocationFromAddress");
      $scope.locationToAddress = window.localStorage.getItem("tempALocationToAddress");
      $scope.moreInformation= window.localStorage.getItem("tempAdditionalInformation");

      //remove resource
      window.localStorage.removeItem("tempADateTime");
      window.localStorage.removeItem("tempAExpectedDuration");
      window.localStorage.removeItem("tempALocationFromAddress");
      window.localStorage.removeItem("tempALocationToAddress");
      window.localStorage.removeItem("tempALocationFrom");
      window.localStorage.removeItem("tempALocationTo");
      window.localStorage.removeItem("tempAdditionalInformation");
    }

    $scope.back=function()
    {
      window.localStorage.removeItem("tempADateTime");
      window.localStorage.removeItem("tempAExpectedDuration");
      window.localStorage.removeItem("tempALocationFrom");
      window.localStorage.removeItem("tempALocationTo");
      window.localStorage.removeItem("tempALocationFromAddress");
      window.localStorage.removeItem("tempALocationToAddress");
      window.localStorage.removeItem("tempAdditionalInformation");
      $state.go('tab.home');
    }
  });
