angular.module('crowdsourcing')

    .controller('searchController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams) {
      $scope.transportActivity = [];
      $scope.activityIds= $stateParams.activityIds;
      $scope.filter= $stateParams.filter;
      if($scope.filter == "")
      {
        $scope.filter="None";
      }
      $scope.loadingshow = true;

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveTransportActivity.php")
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.length; i++)
          {
            if(transportDetails[i].activity_id != null && transportDetails[i].name && transportDetails[i].datetime_start)
            {
              //calculate distance & format date/time
              $scope.temp = transportDetails[i].datetime_start.split(' ');
              var datesTemp = $scope.temp[0].split('-');

              //if activityIds is empty, display all results (no filter)
              if($scope.activityIds == null || $scope.activityIds == "") {
                //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: i + 1,
                  id: transportDetails[i].activity_id,
                  name: transportDetails[i].name,
                  date: datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0],
                  time: $scope.temp[1]
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
                    name: transportDetails[i].name,
                    date: datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0],
                    time: $scope.temp[1]
                  });
                }
              }
            }
          }
        }
        $scope.loadingshow = false;
      })

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }


      $ionicPopover.fromTemplateUrl('templates/search/filter_popout.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });


      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });

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
