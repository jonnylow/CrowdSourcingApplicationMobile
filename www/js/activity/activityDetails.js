/**
 * This js script will handle all logic for activity details. Its corresponding html file is activityDetails.html.
 * The main purpose of this page is just to handle any logic when displaying activity that user click on.
 */
angular.module('crowdsourcing')

    .controller('activityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //get activity id and name from the url
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.backView = $ionicHistory.backView();
    }

    $scope.myLocation = {lng : '', lat: ''};

    $scope.loadingshow = true;
    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

    //call the web service to get details based on the id retrieve from the url parameters
    //after which display the information on the respective input fields in the html file
    $http.get(apiUrl+"retrieveTransportActivityDetails?transportId=" + $scope.transportId,{timeout: 12000})
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
                //getting just the elderly information/initials to display on the details page
                $http.get(apiUrl+"retrieveElderyInformation?transportId=" + transportDetails.activity.activity_id,{timeout: 12000})
                  .success(function (data) {
                    var elderyInformation = data;

                    if (elderyInformation != null) {
                      if(elderyInformation != null)
                      {
                        if(elderyInformation.elderly.name != null && elderyInformation.elderly.next_of_kin_name != null
                          && elderyInformation.elderly.next_of_kin_contact !=null )
                        {
                          $scope.Elderly= getInitials(elderyInformation.elderly.name);
                        }
                      }
                    }
                  })
                  .error(function (data) {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Whoops!</h6>',
                      subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
                      scope: $scope,
                      buttons: [
                        {
                          text: 'OK',
                          type: 'button button-stable',
                          onTap: function (e) {
                            if ($scope.backView != null) {
                              $scope.backView.go();
                            }
                            else {
                              $state.go('landingPage', {}, {reload: true});
                            }
                          }
                        },
                      ]
                    });
                  });

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
      .error(function (data) {
        $scope.loadingshow = false;
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button button-stable',
              onTap: function (e) {
                if ($scope.backView != null) {
                  $scope.backView.go();
                }
                else {
                  $state.go('landingPage', {}, {reload: true});
                }
              }
            },
          ]
        });
      });

    //this function will be called when user click on the apply button
      $scope.apply=function()
      {
        //ask for a confirmation
        if(window.localStorage.getItem("loginUserName") != null) {
          var confirmPopup = $ionicPopup.confirm({
            title: '<h6 class="popups title">Apply?</h6>',
            subTitle: '<h6 class="popups body">Are you sure you want to apply for this transport activity?</h6>' ,
            cancelType: 'button button-stable activity1',
            okType:'button button-stable activity2'
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

              //call webservice to check that user does not have a actvity happening at the same time/has applied for this activity already
              var checkUrlString = apiUrl+"checkActivityApplication?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

              $http.get(checkUrlString,{timeout: 12000})
                .success(function (data) {
                  if(data.status[0]=="do not exist")
                  {
                    //if all is ok, add new activity in the database and direct user to the confirmation page
                    var urlString = apiUrl+"addNewActivity?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

                    $http.get(urlString,{timeout: 12000})
                      .success(function (data) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();

                        $state.go('activityConfirmation', {transportId: $scope.transportId, transportActivityName: $scope.transportActivityName});
                      })
                      .error(function (data) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                          title: '<h6 class="popups title">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups body">Something went wrong. Please try again.</h6> ',
                          scope: $scope,
                          buttons: [
                            {
                              text: 'OK',
                              type: 'button button-stable',
                              onTap: function (e) {
                                if ($scope.backView != null) {
                                  $scope.backView.go();
                                }
                                else {
                                  $state.go('landingPage', {}, {reload: true});
                                }
                              }
                            },
                          ]
                        });
                      });
                  }
                  else
                  {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();

                    var myPopup = $ionicPopup.show({
                      title: '<h6 class="popups title">Hold on...</h6>',
                      subTitle: '<br><h6 class="popups">You already have an activity happening at the same date/time.</h3>',
                      scope: $scope,
                      buttons: [
                        {
                          text: 'OK',
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
                  $scope.loadingshow = false;
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Whoops!</h6>',
                    subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
                    scope: $scope,
                    buttons: [
                      {
                        text: 'OK',
                        type: 'button button-stable',
                        onTap: function (e) {
                          if ($scope.backView != null) {
                            $scope.backView.go();
                          }
                          else {
                            $state.go('landingPage', {}, {reload: true});
                          }
                        }
                      },
                    ]
                  });
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
                text: 'OK',
                type: 'button button-stable',
                onTap: function(e) {
                  $state.go('landingPage', {}, {reload: true});
                }
              },
            ]
          });
        }
      }

      //back function. To redirect user back to previous page, depending where the user came from, page retrieve as soon as this page is loaded
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

      //this function is use when user click on the google map icon to open the directions based on the user current lat/lng to the destination lat/lng
      $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng){
        var url = 'http://maps.google.com/maps?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
        window.open(url,'_system','location=yes');
        return false;
      };

    //function to get initials of a string
    function getInitials(string) {
      var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        initials += "." + names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
    }
  });
