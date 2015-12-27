angular.module('crowdsourcing')

    .controller('activityConfirmationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.date = window.localStorage.getItem("tempADate");
      $scope.time = window.localStorage.getItem("tempATime");
      $scope.expectedDuration = window.localStorage.getItem("tempAExpectedDuration");
      $scope.locationFrom= window.localStorage.getItem("tempALocationFrom");
      $scope.locationTo = window.localStorage.getItem("tempALocationTo");
      $scope.moreInformation= window.localStorage.getItem("tempAdditionalInformation");

      //remove resource
      window.localStorage.removeItem("tempADate");
      window.localStorage.removeItem("tempATime");
      window.localStorage.removeItem("tempAExpectedDuration");
      window.localStorage.removeItem("tempALocationFrom");
      window.localStorage.removeItem("tempALocationTo");
      window.localStorage.removeItem("tempAdditionalInformation");
    }

    $scope.back=function()
    {
      window.localStorage.removeItem("tempADate");
      window.localStorage.removeItem("tempATime");
      window.localStorage.removeItem("tempAExpectedDuration");
      window.localStorage.removeItem("tempALocationFrom");
      window.localStorage.removeItem("tempALocationTo");
      window.localStorage.removeItem("tempAdditionalInformation");
      $state.go('tab.home');
    }
  });
