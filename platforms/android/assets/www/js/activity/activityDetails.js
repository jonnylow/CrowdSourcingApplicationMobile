angular.module('crowdsourcing')

    .controller('activityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.backView = $ionicHistory.backView();
    }

    $scope.myLocation = {lng : '', lat: ''};

    $scope.loadingshow = true;
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    $http.get(apiUrl+"retrieveTransportActivityDetails?transportId=" + $scope.transportId)
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
                $scope.locationFromAddressLat = transportDetails.activity.departure_centre.lat;
                $scope.locationFromAddressLng = transportDetails.activity.departure_centre.lng;
                $scope.locationTo = transportDetails.activity.arrival_centre.name;
                $scope.locationToAddress = transportDetails.activity.arrival_centre.address;
                $scope.locationToAddressLat = transportDetails.activity.arrival_centre.lat;
                $scope.locationToAddressLng = transportDetails.activity.arrival_centre.lng;
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
            cancelType: 'button button-stable registration',
            okType:'button button-stable'
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

              var checkUrlString = apiUrl+"checkActivityApplication?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

              $http.get(checkUrlString)
                .success(function (data) {
                  if(data.status[0]=="do not exist")
                  {
                    var urlString = apiUrl+"addNewActivity?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

                    $http.get(urlString)
                      .success(function (data) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();

                        var sendEmail = "http://www.changhuapeng.com/volunteer/php/email/sendEmail.php?email=imchosen6@gmail.com&title=[CareRide Alert] New Applicant on CareRide&message=There is a new transport application from "+window.localStorage.getItem("loginUserName") ;
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
                      title: '<h6 class="popups title">Hold on...</h6>',
                      subTitle: '<br><h6 class="popups">You already have a activity happening at the same date/time.</h3>',
                      scope: $scope,
                      buttons: [
                        {
                          text: '<b>Ok</b>',
                          type: 'button button-stable',
                          onTap: function(e) {
                            $state.go('tab.home', {}, {reload: true});
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
            title: '<h6 class="popups title">Who are you?</h6>',
            subTitle: '<br><h6 class="popups">Login to access this content</h6>',
            scope: $scope,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button button-stable',
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
        if($scope.backView != null)
        {
          $scope.backView.go();
        }
        else
        {
          $state.go('tab.home', {}, {reload: true});
        }
        //$ionicHistory.goBack();
      }

      $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng){
        if(ionic.Platform.isAndroid() == true) { //android
          var url = 'http://maps.google.com/maps?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
          window.open(url,'_system','location=yes');
          return false;
        }
        else { //ios
          var url = 'http://maps.apple.com/?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
          window.open(url,'_system','location=yes');
          return false;
        }
      };
  });
