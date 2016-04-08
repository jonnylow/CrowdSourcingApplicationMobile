/**
 * This js script will handle all logic for activity details. Its corresponding html file is myactivityDetails.html.
 * The main purpose of this page is just to handle any logic when displaying activity that user click on.
 */
angular.module('crowdsourcing')

    .controller('myactivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //get activity id and name from the url
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      //call the web service to get details based on the id retrieve from the url parameters
      //after which display the information on the respective input fields in the html file
      $http.get(apiUrl + "retrieveMyTransportActivityDetails?transportId=" + $scope.transportId + "&id=" + $scope.id, {timeout: 12000})
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null) {
            if (transportDetails.activities[0] != null) {
              if (transportDetails.activities[0].datetime_start != null && transportDetails.activities[0].expected_duration_minutes != null) {
                var t = transportDetails.activities[0].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

                $scope.dateTime = dateTime;
                $scope.expectedDuration = transportDetails.activities[0].expected_duration_minutes + " Mins";
                $scope.locationFrom = transportDetails.activities[0].departure_centre.name;
                $scope.locationFromAddress = transportDetails.activities[0].departure_centre.address;
                $scope.locationFromAddressLat = transportDetails.activities[0].departure_centre.lat;
                $scope.locationFromAddressLng = transportDetails.activities[0].departure_centre.lng;
                $scope.locationTo = transportDetails.activities[0].arrival_centre.name;
                $scope.locationToAddress = transportDetails.activities[0].arrival_centre.address;
                $scope.locationToAddressLat = transportDetails.activities[0].arrival_centre.lat;
                $scope.locationToAddressLng = transportDetails.activities[0].arrival_centre.lng;
                $scope.moreInformation = transportDetails.activities[0].more_information;
                if ($scope.moreInformation == "") {
                  $scope.moreInformation = "No Additional Information"
                }
                $scope.approvalStatus = capitalizeFirstLetter(transportDetails.task[0].approval);

                //getting just the elderly information/initials to display on the details page
                $http.get(apiUrl + "retrieveElderyInformation?transportId=" + transportDetails.activities[0].activity_id, {timeout: 12000})
                  .success(function (data) {
                    var elderyInformation = data;

                    if (elderyInformation != null) {
                      if (elderyInformation != null) {
                        if (elderyInformation.elderly.name != null && elderyInformation.elderly.next_of_kin_name != null
                          && elderyInformation.elderly.next_of_kin_contact != null) {
                          $scope.Elderly = getInitials(elderyInformation.elderly.name);
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

                var transportStatusToDisplay;
                if (transportDetails.task[0].status == "new task") {
                  transportStatusToDisplay = "Activity not started yet";
                }
                else {
                  transportStatusToDisplay = transportDetails.task[0].status;
                }

                $scope.transportStatus = capitalizeFirstLetter(transportStatusToDisplay);

                //based on the activity status check what button to show
                if (transportDetails.task[0].status != "completed" && transportDetails.task[0].approval == "approved") {
                  $scope.eldery = false;
                  $scope.updateStatus = false;
                }
                else {
                  $scope.eldery = true;
                  $scope.updateStatus = true;
                }

                if (transportDetails.task[0].approval != "withdrawn" && transportDetails.task[0].approval != "rejected") {
                  if (transportDetails.task[0].status != "new task") {
                    $scope.withdrawShow = true;
                  }
                  else {
                    $scope.withdrawShow = false;
                  }
                }
                else {
                  $scope.withdrawShow = true;
                }

                if (transportDetails.task[0].approval == "rejected") {
                  $scope.rejection = transportDetails.task[0].comment;
                }
              }
            }
          }
          $scope.loadingshow = false;
          $ionicLoading.hide();
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

      //this function is to capitalize the first letter of the string
      function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }

      //this method is to direct user to the elderly information page
      $scope.proceed = function (id, name, date) {
        $state.go('elderyInformation', {transportId: id, transportActivityName: name, transportActivityDate: date});
      }

      //back function. To redirect user back to previous page, depending where the user came from, page retrieve as soon as this page is loaded
      $scope.back = function () {
        if ($scope.backView != null) {
          $scope.backView.go();
        }
        else {
          $state.go('tab.activity', {}, {reload: true});
        }
        //$ionicHistory.goBack();
      }

      $scope.goStatus = function (id, name) {
        $state.go('myactivityStatus', {transportId: id, transportActivityName: name, status: $scope.transportStatus});
      }

      //this function is for withdraw function
      $scope.withdraw = function () {
        //check whether user can withdraw. withdraw period is 2 days before activity start date
        var currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 2);

        if ($scope.dateTime > currentDate) {
          var confirmPopup = $ionicPopup.confirm({
            title: "<h6 class='popups title'>Withdraw?</h6>",
            subTitle: "<h6 class='popups body'>Are you sure you want to withdraw from this activity?</h6>",
            cancelType: 'button button-stable activity1',
            okType: 'button button-stable activity2'
          });

          confirmPopup.then(function (res) {
            if (res) {
              $scope.loadingshow = true;
              $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

              urlString = apiUrl + "withdraw?volunteer_id=" + $scope.id + "&activity_id=" + $scope.transportId;

              $http.get(urlString, {timeout: 12000})
                .success(function (data) {
                  var status = data;
                  if (status != null) {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                      title: "<h6 class='popups title'>Success",
                      subTitle: "<h6 class='popups body'>You have withdrawn from this activity</h6>",
                      okType: 'button button-stable'
                    });
                    //window.location.reload(true);
                    $state.go('tab.activity', {}, {reload: true});
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
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups withdraw">You are not allowed to withdraw from the activity on the actual date. Please call the centre if you cannot make it.</h6> ',
            okType: 'button button-stable activity2'

          });
        }
      }

      //this function is use when user click on the google map icon to open the directions based on the user current lat/lng to the destination lat/lng
      $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng) {
        var url = 'http://maps.google.com/maps?saddr=' + locationFromAddressLat + ',' + locationFromAddressLng + '&daddr=' + locationToAddressLat + ',' + locationToAddressLng + '&dirflg=d"';
        window.open(url, '_system', 'location=yes');
        return false;
      };

      function getInitials(string) {
        var names = string.split(' '),
          initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
          initials += "." + names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
      }
    }
});
