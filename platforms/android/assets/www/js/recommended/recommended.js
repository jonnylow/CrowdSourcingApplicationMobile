angular.module('crowdsourcing')

    .controller('recommendedController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
      $scope.transportActivity = [];
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    $http.get(apiUrl+"RetrieveRecommendedTransportActivity.php?limit=5")
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.length; i++)
          {
            if(transportDetails[i].activity_id != null)
            {
              //format date/time
              var t = transportDetails[i].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

               //push to arrays to store all activities in array (also use for displaying)
              $scope.transportActivity.push({
                no: i + 1,
                id: transportDetails[i].activity_id,
                from:transportDetails[i].location_from,
                to:transportDetails[i].location_to,
                name: transportDetails[i].location_from + " - " + transportDetails[i].location_to,
                dateTime: dateTime
              });
            }
          }
        }
        $scope.loadingshow = false;
        $ionicLoading.hide();
      })

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }
    });
