angular.module('crowdsourcing')

    .controller('recommendedController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
      $scope.transportActivity = [];
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    var url = "";
    if(window.localStorage.getItem("token") != null)
    {
      url = "http://changhuapeng.com/laravel/api/retrieveRecommendedTransportActivity?limit=5&token="+window.localStorage.getItem("token");
    }
    else
    {
      url = "http://changhuapeng.com/laravel/api/retrieveRecommendedTransportActivity?limit=5";
    }

    $http.get(url)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.activities.length; i++)
          {
            if(transportDetails.activities[i].activity_id != null)
            {
              //format date/time
              var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

               //push to arrays to store all activities in array (also use for displaying)
              $scope.transportActivity.push({
                no: i + 1,
                id: transportDetails.activities[i].activity_id,
                from:transportDetails.activities[i].departure_centre.name,
                to:transportDetails.activities[i].arrival_centre.name,
                name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
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
