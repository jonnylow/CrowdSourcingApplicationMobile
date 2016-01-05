angular.module('crowdsourcing')

    .controller('filterController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
      if ($stateParams.filter != null) {
        $scope.id = window.localStorage.getItem("loginId");
        $scope.filter = $stateParams.filter; //get current filter user select
        $scope.exisitingActivityIds = $stateParams.activityIds; //get any existing filter being applied already
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
      }

      if($scope.filter != null)
      {
        $scope.filterListDisplay = [];

        //depends what filter user select (start/end/time)
        if($scope.filter == 'Start Location')
        {
          $http.get(apiUrl+"RetrieveFilter.php?filter=start")
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
              $ionicLoading.hide();
            })
        }
        else if($scope.filter == 'End Location')
        {
          $http.get(apiUrl+"RetrieveFilter.php?filter=end")
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
              $ionicLoading.hide();
            })
        }
        else if($scope.filter == 'Time')
        {
          $http.get(apiUrl+"RetrieveFilter.php?filter=time")
            .success(function (data) {
              var results = data;
              var morning;
              var afternoon;
              var evening;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].time != null) {
                      var timeStart = results[i].time;
                      var activityIds = results[i].activity_ids;

                      //split up time and take the hours only
                      var timeTemp =timeStart.split(' ');
                      var hour = parseInt(timeTemp[1]);

                      if(hour >= 8 && hour < 11) //morning
                      {
                        if(morning == null) {
                          morning = activityIds;
                        }
                        else {
                          morning += "," + activityIds;
                        }
                      }
                      else if(hour >= 11 && hour <15) //afternoon
                      {
                        if(afternoon == null) {
                          afternoon = activityIds;
                        }
                        else {
                          afternoon += "," + activityIds;
                        }
                      }
                      else if(hour >= 15 && hour <18) //evening
                      {
                        if(evening == null) {
                          evening = activityIds;
                        }
                        else {
                          evening += "," + activityIds;
                        }
                      }
                    }
                  }
                }
                //console.log(morning);
                //console.log(afternoon);
                //console.log(evening);

                //three main categories to push
                //if there is existing filter, tick the checkbox. If not leave it all untick.
                if(morning != null)
                {
                  if($scope.exisitingActivityIds.indexOf(morning) != -1) {
                    $scope.filterListDisplay.push({textShown: '8am - 11am', checked: true, activityIds: morning});
                  }
                  else {
                    $scope.filterListDisplay.push({textShown: '8am - 11am', checked: false, activityIds: morning});
                  }
                }
                if(afternoon != null)
                {
                  if($scope.exisitingActivityIds.indexOf(afternoon) != -1) {
                    $scope.filterListDisplay.push({textShown: '11am - 3pm', checked: true, activityIds: afternoon});
                  }
                  else {
                    $scope.filterListDisplay.push({textShown: '11am - 3pm', checked: false, activityIds: afternoon});
                  }
                }
                if(evening != null)
                {
                  if($scope.exisitingActivityIds.indexOf(evening) != -1) {
                    $scope.filterListDisplay.push({textShown: '3pm - 6pm', checked: true, activityIds: evening});
                  }
                  else {
                    $scope.filterListDisplay.push({textShown: '3pm - 6pm', checked: false, activityIds: evening});
                  }
                }
              }
              $scope.loadingshow = false;
              $ionicLoading.hide();
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
            title: "<h6 class='popups title error'>Whoops!</h6>",
            subTitle: '<br><h6 class="popups">You have to select a filter</h6>',
            scope: $scope,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button button-stable'
              },
            ]
          });
        }
      }

    //clear checkboxed
    $scope.clear = function()
    {
      for(var i =0; i<$scope.filterListDisplay.length; i++)
      {
        //check which checkbox is tick and concat all activity ids into the final filter list
        if($scope.filterListDisplay[i].checked == true)
        {
          $scope.filterListDisplay[i].checked =false;
        }
      }
    }

    });
