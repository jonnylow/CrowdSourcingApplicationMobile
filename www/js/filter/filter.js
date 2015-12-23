angular.module('crowdsourcing')

    .controller('filterController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicHistory) {
      if ($stateParams.filter != null) {
        $scope.id = window.localStorage.getItem("loginId");
        $scope.filter = $stateParams.filter; //get current filter user select
        $scope.exisitingActivityIds = $stateParams.activityIds; //get any existing filter being applied already
        $scope.loadingshow = true;
      }

      if($scope.filter != null)
      {
        $scope.filterListDisplay = [];

        //depends what filter user select (start/end/time)
        if($scope.filter == 'Start Location')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=start")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].location_from != null) {
                      var locationFrom = results[i].location_from;
                      var activityIds = results[i].activity_ids;

                      //if there is existing filter, tick the checkbox. If not leave it all untick.
                      if($scope.exisitingActivityIds.indexOf(activityIds) != -1) {
                        $scope.filterListDisplay.push({
                          textShown: locationFrom,
                          checked: true,
                          activityIds: activityIds
                        });
                      }
                      else {
                        $scope.filterListDisplay.push({
                          textShown: locationFrom,
                          checked: false,
                          activityIds: activityIds
                        });
                      }
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
        else if($scope.filter == 'End Location')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=end")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].location_to != null) {
                      var locationTo = results[i].location_to;
                      var activityIds = results[i].activity_ids;

                      //if there is existing filter, tick the checkbox. If not leave it all untick.
                      if($scope.exisitingActivityIds.indexOf(activityIds) != -1) {
                        $scope.filterListDisplay.push({
                          textShown: locationTo,
                          checked: true,
                          activityIds: activityIds
                        });
                      }
                      else {
                        $scope.filterListDisplay.push({
                          textShown: locationTo,
                          checked: false,
                          activityIds: activityIds
                        });
                      }
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
        else if($scope.filter == 'Time')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=time")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].time != null) {
                      var timeStart = results[i].time;
                      var activityIds = results[i].activity_ids;

                      //if there is existing filter, tick the checkbox. If not leave it all untick.
                      if($scope.exisitingActivityIds.indexOf(activityIds) != -1) {
                        $scope.filterListDisplay.push({textShown: timeStart, checked: true, activityIds: activityIds});
                      }
                      else {
                        $scope.filterListDisplay.push({textShown: timeStart, checked: false, activityIds: activityIds});
                      }
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
      }

      $scope.goBack = function()
      {
        $ionicHistory.goBack();
      }

      //when user click on filter to go back to the filtered list
      $scope.goFilter = function()
      {
        //variable for final activityids to be display at filtered list
        var finalFilterLists;

        for(var i =0; i<$scope.filterListDisplay.length; i++)
        {
          //check which checkbox is tick and concat all activity ids into the final filter list
          if($scope.filterListDisplay[i].checked == true)
          {
            if(finalFilterLists == null) {
              finalFilterLists = $scope.filterListDisplay[i].activityIds;
            }
            else
            {
              finalFilterLists += "," + $scope.filterListDisplay[i].activityIds;
            }
          }
        }

        //if the list is not empty, go back to filtered list with the results if not show an error message
        if(finalFilterLists != null)
        {
          $state.go('search', {filter: $scope.filter, activityIds: finalFilterLists});
        }
        else
        {
          var alertPopup = $ionicPopup.alert({
            title: '<b>Error</b>',
            subTitle: '<br>Please select a filter before continuing',
            scope: $scope,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button-calm'
              },
            ]
          });
        }
      }

    });
