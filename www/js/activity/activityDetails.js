angular.module('crowdsourcing')

    .controller('activityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
    }
    $scope.loadingshow = true;
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    $http.get("http://changhuapeng.com/laravel/api/retrieveTransportActivityDetails?transportId=" + $scope.transportId)
      .success(function (data) {
        var transportDetails = data;
        if (transportDetails != null) {
          if(transportDetails.activity != null)
          {
            if(transportDetails.activity.datetime_start != null)
              {
                var t = transportDetails.activity.datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                $scope.dateTime = dateTime;
                $scope.expectedDuration = transportDetails.activity.expected_duration_minutes + " Mins";
                $scope.locationFrom = transportDetails.activity.departure_centre.name;
                $scope.locationFromAddress = transportDetails.activity.departure_centre.address;
                $scope.locationTo = transportDetails.activity.arrival_centre.name;
                $scope.locationToAddress = transportDetails.activity.arrival_centre.address;
                $scope.moreInformation = transportDetails.activity.more_information;
                if($scope.moreInformation == "")
                {
                  $scope.moreInformation = "No Additional Information"
                }
                $scope.loadingshow = false;
                $ionicLoading.hide();
              }
          }
        }
      })

      $scope.apply=function()
      {
        if(window.localStorage.getItem("loginUserName") != null) {
          var confirmPopup = $ionicPopup.confirm({
            title: '<h6 class="popups title">Apply?</h6>',
            subTitle: '<h6 class="popups">Are you sure you want to apply for this transport activity?</h6>' ,
            cancelType: 'button button-light',
            okType:'button button-energized'
          });

          confirmPopup.then(function(res) {
            if(res) {
              $scope.loadingshow = true;
              $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

              window.localStorage.setItem("tempADateTime", $scope.dateTime);
              window.localStorage.setItem("tempAExpectedDuration", $scope.expectedDuration);
              window.localStorage.setItem("tempALocationFrom", $scope.locationFrom);
              window.localStorage.setItem("tempALocationFromAddress", $scope.locationFromAddress);
              window.localStorage.setItem("tempALocationTo", $scope.locationTo);
              window.localStorage.setItem("tempALocationToAddress", $scope.locationToAddress);
              window.localStorage.setItem("tempAdditionalInformation", $scope.moreInformation);

              var checkUrlString = apiUrl+"CheckActivityApplication.php?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;
              $http.get(checkUrlString)
                .success(function (data) {
                  if(data.status[0]=="do not exist")
                  {
                    var urlString = apiUrl+"AddNewActivity.php?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

                    $http.get(urlString)
                      .success(function (data) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();

                        var sendEmail = apiUrl+"email/sendEmail.php?email=jonathanlow.2013@sis.smu.edu.sg&message=There is a new transport application from "+window.localStorage.getItem("loginUserName") ;
                        $http.get(sendEmail)
                          .success(function (data) {
                          //email send
                          })

                          .error(function (data) {
                            alert("Error in connection");
                          });

                        $state.go('activityConfirmation', {transportId: $scope.transportId, transportActivityName: $scope.transportActivityName});
                      })

                      .error(function (data) {
                        alert("Error in connection");
                      });
                  }
                  else
                  {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();

                    var myPopup = $ionicPopup.show({
                      title: '<h6 class="popups title">Notice</h6>',
                      subTitle: '<br><h6 class="popups">You have already applied for this activity. Please wait for centre to approve your application</h3>',
                      scope: $scope,
                      buttons: [
                        {
                          text: '<b>Ok</b>',
                          type: 'button button-energized',
                          onTap: function(e) {
                            $state.go('scan', {}, {reload: true});
                          }
                        },
                      ]
                    });
                  }
                })

                .error(function (data) {
                  alert("Error in connection");
                });
            }
          });
        }
        else {
          var myPopup = $ionicPopup.show({
            title: '<h6 class="popups title">Notice</h6>',
            subTitle: '<br><h6 class="popups">You must login first</h6>',
            scope: $scope,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button button-energized',
                onTap: function(e) {
                  $state.go('landingPage', {}, {reload: true});
                }
              },
            ]
          });
        }
      }

      $scope.back=function()
      {
        $ionicHistory.goBack();
      }
  });
