angular.module('crowdsourcing')

    .controller('myPastActivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    $http.get(apiUrl+"RetrieveMyTransportActivityDetails.php?transportId=" + $scope.transportId+"&id="+$scope.id)
      .success(function (data) {
        var transportDetails = data;
        if (transportDetails != null) {
          if(transportDetails[0] != null)
          {

            if(transportDetails[0].datetime_start != null && transportDetails[0].expected_duration_minutes != null && transportDetails[0].location_from != null
              && transportDetails[0].location_to !=null)
            {
              var t = transportDetails[0].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

              $scope.dateTime = dateTime;
              $scope.expectedDuration = transportDetails[0].expected_duration_minutes + " Mins";
              $scope.locationFrom = transportDetails[0].location_from;
              $scope.locationFromAddress = transportDetails[0].location_from_address;
              $scope.locationFromAddressLat = transportDetails[0].location_from_lat;
              $scope.locationFromAddressLng = transportDetails[0].location_from_long;
              $scope.locationTo = transportDetails[0].location_to;
              $scope.locationToAddress = transportDetails[0].location_to_address;
              $scope.locationToAddressLat = transportDetails[0].location_to_lat;
              $scope.locationToAddressLng = transportDetails[0].location_to_long;
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
        $ionicLoading.hide();
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

    $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng){
      var url = 'http://maps.google.com/maps?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
      window.open(url,'_system','location=yes');
      return false;
    };
});
