angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout, $ionicLoading, apiUrl) {

    if(window.localStorage.getItem("userLat") == null || window.localStorage.getItem("userLong") == null) {
      if (typeof cordova != 'undefined') {
        if(ionic.Platform.isAndroid() == true) {

          //check location whether is it enabled
          cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
            if (!enabled) {
              $ionicLoading.hide();
              var myPopup = $ionicPopup.show({
                title: '<b>Notice</b>',
                subTitle: '<h5 class="popups home">No location services detected. Please enable before using CareRide.</h5>',
                scope: $scope,
                cssClass: "popup-vertical-buttons",
                buttons: [
                  {
                    text: '<h5 class="popups">Proceed to Location Services</h5>',
                    type: 'button button-stable',
                    onTap: function (e) {
                      $state.go('landingPage', {}, {reload: true});
                      cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                  },
                  {
                    text: '<h5 class="popups">Proceed without Location Services</h5>',
                    type: 'button button-stable',
                    onTap: function (e) {
                      //use default location
                      window.localStorage.setItem("userLat", "1.297507");
                      window.localStorage.setItem("userLong", "103.850436");

                      getLocation = true;
                      //to check that application also got user location && data finish loading
                      if (getLocation == true && loadData == true) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();
                      }
                    }

                  },
                ]
              });
            }
            else {
              //check whether settings is set to high accuracy
              cordova.plugins.diagnostic.getLocationMode(function (mode) {
                if (mode != "high_accuracy") {
                  $ionicLoading.hide();

                  var myPopup = $ionicPopup.show({
                    title: '<b>Notice</b>',
                    subTitle: 'Please switch location service mode to High Accuracy.',
                    scope: $scope,
                    buttons: [
                      {
                        text: 'Proceed to Location Services',
                        type: 'button button-stable',
                        onTap: function (e) {
                          $state.go('landingPage', {}, {reload: true});
                          cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                      },
                      {
                        text: 'Proceed without Location Services',
                        type: 'button button-stable',
                        onTap: function (e) {
                          //use default location
                          window.localStorage.setItem("userLat", "1.297507");
                          window.localStorage.setItem("userLong", "103.850436");

                          getLocation = true;
                          //to check that application also got user location && data finish loading
                          if (getLocation == true && loadData == true) {
                            $scope.loadingshow = false;
                            $ionicLoading.hide();
                          }
                        }
                      },
                    ]
                  });
                }
              }, function (error) {
                console.error("The following error occurred: " + error);
              });
            }
          }, function (error) {
            alert("The following error occurred: " + error);
          });
        }
      }
    }

      //ionic loading screen
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

      $scope.transportActivity = [];
      $scope.loadingshow = true;
      var getLocation = false;
      var loadData = false;

      //NOTE BACKEND DEVELOPERS: remove latlng global vars from other logout function when stable
      //NOTE BACKEND DEVELOPERS: set timeout to only fire error once
    if(window.localStorage.getItem("userLat") == null) {
      var onSuccess = function(position) {
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;

        window.localStorage.setItem("userLat", lat);
        window.localStorage.setItem("userLong", lng);

        getLocation = true;

        //to check that application also got user location && data finish loading
        if(getLocation == true && loadData == true) {
          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      };

      function onError(err) {
        //$ionicLoading.hide();
        //$state.go('landingPage', {}, {reload: true});
      }

      //get location with 10 secs timeout
      navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000, enableHighAccuracy: true });
    }
    else {
      getLocation = true;

      //to check that application also got user location && data finish loading
      if(getLocation == true && loadData == true) {
        $scope.loadingshow = false;
        $ionicLoading.hide();
      }
    }

      $http.get("http://changhuapeng.com/laravel/api/retrieveRecommendedTransportActivity?limit=2")
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null) {
            for(var i = 0; i<transportDetails.activities.length; i++)
            {
              if(transportDetails.activities[i].activity_id != null)
              {
                //calculate distance & format date/time
                var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                 //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: i + 1,
                  id: transportDetails.activities[i].activity_id,
                  start:transportDetails.activities[i].departure_centre.name,
                  end:transportDetails.activities[i].arrival_centre.name,
                  dateTime: dateTime,
                  name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name
                });
              }
            }
          }
          loadData = true;

          //to check that application also got user location && data finish loading
          if(getLocation == true && loadData == true) {
            $scope.loadingshow = false;
            $ionicLoading.hide();

          }
        })

      $scope.scan = function () {
        $state.go('scan', {}, {reload: true});
      }

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

    });
