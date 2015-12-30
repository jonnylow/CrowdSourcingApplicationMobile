angular.module('crowdsourcing')

    .controller('searchController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading) {
      $scope.transportActivity = [];
      $scope.activityIds= $stateParams.activityIds;
      $scope.filter= $stateParams.filter;
      if($scope.filter == "")
      {
        $scope.filter="None";
      }

      $scope.filterOptions = [{
        value: 'start',
        label: 'Start Location'
      }, {
        value: 'end',
        label: 'End Location'
      }, {
        value: 'time',
        label: 'Time'
      }];

    $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveTransportActivity.php")
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

              //if activityIds is empty, display all results (no filter)
              if($scope.activityIds == null || $scope.activityIds == "") {
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
              else //if activityIds not empty, split up results into array and only display those in the array
              {
                var activity_ids = $scope.activityIds.split(",");
                if(activity_ids.indexOf(transportDetails[i].activity_id) != -1)
                {
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
          }
        }
        $scope.loadingshow = false;
        $ionicLoading.hide();
      })

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

      //go to the filter page depending on which filter user select (start/end/time)
      $scope.goFilter= function(filter) {
        if(filter=='start') {
          //if past filter is not the same as current filter user is selecting, remove the activityIds so it will not be send over to filter page
          if($scope.filter != 'Start Location')
          {
            $scope.activityIds = "";
          }

          //go to filter page, passing over filter type and activityids that are currently being filter (if any)
          $state.go('filter', {filter: 'Start Location', activityIds: $scope.activityIds});
        }
        else if(filter == 'end')
        {
          //if past filter is not the same as current filter user is selecting, remove the activityIds so it will not be send over to filter page
          if($scope.filter != 'End Location')
          {
            $scope.activityIds = "";
          }

          //go to filter page, passing over filter type and activityids that are currently being filter (if any)
          $state.go('filter', {filter: 'End Location', activityIds: $scope.activityIds});
        }
        else if(filter == 'time')
        {
          //if past filter is not the same as current filter user is selecting, remove the activityIds so it will not be send over to filter page
          if($scope.filter != 'Time')
          {
            $scope.activityIds = "";
          }

          //go to filter page, passing over filter type and activityids that are currently being filter (if any)
          $state.go('filter', {filter: 'Time', activityIds: $scope.activityIds});
        }
      };
    });
