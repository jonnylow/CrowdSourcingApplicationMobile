angular.module('crowdsourcing')

    .controller('myPastActivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.loadingshow = true;
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveMyTransportActivityDetails.php?transportId=" + $scope.transportId+"&id="+$scope.id)
      .success(function (data) {
        var transportDetails = data;
        if (transportDetails != null) {
          if(transportDetails[0] != null)
          {

            if(transportDetails[0].datetime_start != null && transportDetails[0].expected_duration_minutes != null && transportDetails[0].location_from != null
              && transportDetails[0].location_to !=null)
            {
              var temp =transportDetails[0].datetime_start.split(' ');
              var datesTemp = temp[0].split('-');
              $scope.date = datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0];
              $scope.time = temp[1];
              $scope.expectedDuration = transportDetails[0].expected_duration_minutes + " Mins";
              $scope.locationFrom = transportDetails[0].location_from;
              $scope.locationTo = transportDetails[0].location_to;
              if(transportDetails[0].more_information == null) {
                $scope.moreInformation = transportDetails[0].more_information;
              }
              else
              {
                $scope.moreInformation = "No additional information";
              }

              $scope.approvalStatus = capitalizeFirstLetter(transportDetails[0].approval);
              var transportStatusToDisplay;
              if(transportDetails[0].status == "new task")
              {
                transportStatusToDisplay = "Activity not started yet";
              }
              else
              {
                transportStatusToDisplay = transportDetails[0].status;
              }
              $scope.transportStatus = capitalizeFirstLetter(transportStatusToDisplay);

              if(transportDetails[0].status == "completed" && transportDetails[0].approval=="approved")
              {
                $scope.eldery = false;
              }
              else
              {
                $scope.eldery = true;
              }
            }
          }
        }
        $scope.loadingshow = false;
      })

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.proceed = function(id, name)
    {
      $state.go('elderyInformation', {transportId: id, transportActivityName: name});
    }

    $scope.back=function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.myhistory');
    }
});
