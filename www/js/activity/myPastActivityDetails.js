/**
 * This js script will handle all logic for activity details. Its corresponding html file is myPastActivityDetails.html.
 * The main purpose of this page is just to handle any logic when displaying activity that user click on.
 */
angular.module('crowdsourcing')

    .controller('myPastActivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }
    //get activity id and name from the url
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      //call the web service to get details based on the id retrieve from the url parameters
      //after which display the information on the respective input fields in the html file
      //getting just the elderly information/initials to display on the details page
      $http.get(apiUrl + "retrieveElderyInformation?transportId=" + $scope.transportId, {timeout: 12000})
        .success(function (elderly) {
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
                    if ($scope.moreInformation == "" || $scope.moreInformation == "null") {
                      $scope.moreInformation = "No Additional Information"
                    }
                    $scope.approvalStatus = capitalizeFirstLetter(transportDetails.task[0].approval);
                    var transportStatusToDisplay;
                    if (transportDetails.task[0].status == "new task") {
                      transportStatusToDisplay = "Activity not started yet";
                    }
                    else {
                      transportStatusToDisplay = transportDetails.task[0].status;
                    }
                    $scope.transportStatus = capitalizeFirstLetter(transportStatusToDisplay);

                    if (transportDetails.task[0].status == "completed" && transportDetails.task[0].approval == "approved") {
                      if (elderly != null) {
                        $scope.eldery = false;
                        $scope.elderlyName = elderly.elderly.name;
                      }
                    }
                    else {
                      $scope.eldery = true;
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
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('tab.myhistory');
      }

      //this function is use when user click on the google map icon to open the directions based on the user current lat/lng to the destination lat/lng
      $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng) {
        var url = 'http://maps.google.com/maps?saddr=' + locationFromAddressLat + ',' + locationFromAddressLng + '&daddr=' + locationToAddressLat + ',' + locationToAddressLng + '&dirflg=d"';
        window.open(url, '_system', 'location=yes');
        return false;
      };
    }
});
