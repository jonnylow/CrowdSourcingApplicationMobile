angular.module('crowdsourcing')

    .controller('activityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
    }

    $http.get("http://localhost/RetrieveTransportActivityDetails.php?transportId=" + $scope.transportId)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          if(transportDetails[0] != null)
          {
            if(transportDetails[0].DateTimeStart != null && transportDetails[0].ExpectedDuration != null && transportDetails[0].LocationFrom != null
            && transportDetails[0].LocationTo !=null && transportDetails[0].MoreInformation != null && transportDetails[0].NeedCPR != null &&
              transportDetails[0].NeedCar!=null)
              {
                var temp =transportDetails[0].DateTimeStart.split(' ');
                $scope.date = temp[0];
                $scope.time = temp[1];
                $scope.expectedDuration = transportDetails[0].ExpectedDuration + " Hour";
                $scope.locationFrom = transportDetails[0].LocationFrom;
                $scope.locationTo = transportDetails[0].LocationTo;
                $scope.moreInformation = transportDetails[0].MoreInformation;
                if(transportDetails[0].NeedCPR == 1) {
                  $scope.needCPR = true;
                }
                else {
                  $scope.needCPR = false;
                }

                if(transportDetails[0].NeedCar == 1) {
                  $scope.needCar = true;
                }
                else {
                  $scope.needCar = false;
                }
                $scope.variable = {cpr: $scope.needCPR,car: $scope.needCar};
              }
          }
        }
      })

      //need to link up to backend database.
      $scope.apply=function()
      {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Apply?',
            template: 'Are you sure you want to apply for this transport activity?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              window.localStorage.setItem("tempADate", $scope.date);
              window.localStorage.setItem("tempATime", $scope.time);
              window.localStorage.setItem("tempAExpectedDuration", $scope.expectedDuration);
              window.localStorage.setItem("tempALocationFrom", $scope.locationFrom);
              window.localStorage.setItem("tempALocationTo", $scope.locationTo);

              $state.go('activityConfirmation', {transportId: $scope.transportId, transportActivityName: $scope.transportActivityName});
            }
          });
      }

      $scope.back=function()
      {
        $ionicHistory.goBack();
      }
  });
