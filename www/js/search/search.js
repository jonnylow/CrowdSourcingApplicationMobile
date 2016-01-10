angular.module('crowdsourcing')

    .controller('searchController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl) {
      //use for conversion of dates
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      $scope.transportActivity = [];
      $scope.activityIds= $stateParams.activityIds;
      $scope.filter= $stateParams.filter;

      //check icon
      $scope.startCheck = false;
      $scope.endCheck = false;
      $scope.timeCheck = false;
      if($scope.filter == "")
      {
        $scope.filter="None";
        $scope.startCheck = false;
        $scope.endCheck = false;
        $scope.timeCheck = false;
      }
      else if($scope.filter == "Start Location")
      {
        $scope.startCheck = true;
      }
      else if($scope.filter == "End Location")
      {
        $scope.endCheck = true;
      }
      else if($scope.filter == "Time")
      {
        $scope.timeCheck = true;
      }
/*
      $scope.filterOptions = [{
        value: 'start',
        label: 'Start Location'
      }, {
        value: 'end',
        label: 'End Location'
      }, {
        value: 'time',
        label: 'Time'
      }];*/

    $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    $http.get(apiUrl+"RetrieveTransportActivity.php")
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

              //format date to be use for searching
              var dd = dateTime.getDate();
              var mm = dateTime.getMonth();
              var yyyy = dateTime.getFullYear();
              var date = dd + ' ' + monthNames[mm]+ ' ' + yyyy;

              //if activityIds is empty, display all results (no filter)
              if($scope.activityIds == null || $scope.activityIds == "") {
                //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: i + 1,
                  id: transportDetails[i].activity_id,
                  from:transportDetails[i].location_from,
                  to:transportDetails[i].location_to,
                  name: transportDetails[i].location_from + " - " + transportDetails[i].location_to,
                  date:date,
                  time:formatAMPM(dateTime),
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
                    date:date,
                    time:formatAMPM(dateTime),
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

    function formatAMPM(date) {
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? '0'+minutes : minutes;
      var strTime = hours + ':' + minutes + ' ' + ampm;
      return strTime;
    }

  });
