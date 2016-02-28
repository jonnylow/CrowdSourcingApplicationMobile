angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout, $ionicLoading, apiUrl) {
    //define month array to use
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";

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
                    text: '<h5 class="popups"><font color="#29A29C">Proceed to Location Services</font></h5>',
                    type: 'button button-stable',
                    onTap: function (e) {
                      $state.go('landingPage', {}, {reload: true});
                      cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                  },
                  {
                    text: '<h5 class="popups"><font color="#29A29C">Proceed without Location Services</font></h5>',
                    type: 'button button-stable',
                    onTap: function (e) {
                      //use default location
                      window.localStorage.setItem("userLat", "1.297507");
                      window.localStorage.setItem("userLong", "103.850436");

                      $scope.loadingshow = false;
                      $ionicLoading.hide();
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

                          $scope.loadingshow = false;
                          $ionicLoading.hide();
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

      var url = "";
      var secondUrl = "";

      if(window.localStorage.getItem("token") != null)
      {
        url = apiUrl+"retrieveRecommendedTransportActivity?limit=1&token="+window.localStorage.getItem("token");
        secondUrl = apiUrl+"graphInformation?token="+window.localStorage.getItem("token");
        var todayUrl = apiUrl+"todayActivity?token="+window.localStorage.getItem("token");
        var inProgressUrl = apiUrl+"todayActivityInProgress?token="+window.localStorage.getItem("token");

        $scope.totalVolunteers = "";
        $scope.totalTaskHours = "";
        $http.get(secondUrl)
          .success(function (data) {
            if(data != null)
            {
              $scope.rank = data.rank;
              $scope.totalhours = data.totalHours;
              var d1 = new Date();
              var d2 = new Date();
              d2.setMonth(d2.getMonth()-1);
              var d3 = new Date();
              d3.setMonth(d3.getMonth()-2);
              var d4 = new Date();
              d4.setMonth(d4.getMonth()-3);

              $scope.colours=[{fillColor:["#99B898", "#4FECEAB", "#FF847C", "#E84A5F"]}];
              $scope.labels = [month[d4.getMonth()], month[d3 .getMonth()], month[d2.getMonth()], month[d1.getMonth()]];
              $scope.data = [[data.fourMonthsAgo, data.threeMonthsAgo, data.twoMonthsAgo, data.oneMonthAgo]];
              $scope.chartOptions = {
                responsive : true,
                tooltipTemplate: "<%= value %>",
                tooltipFillColor: "rgba(0,0,0,0)",
                tooltipFontColor: "#444",
                tooltipEvents: [],
                tooltipCaretSize: 0,
                onAnimationComplete: function()
                {
                  this.showTooltip(this.datasets[0].bars, true);
                }
              };
            }
          })

        $http.get(inProgressUrl)
          .success(function (data) {
            if(data != null)
            {
              if(data.activityToReturn != null)
              {
                var t = data.activityToReturn.datetime_start.split(/[- :]/);
                $scope.inProgressId = data.activityToReturn.activity_id;
                $scope.InProgressActivityDate = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                $scope.InProgressStatus = data.taskStatus;
                $scope.showUrgent = false;
                $scope.inProgress = true;
              }
              else
              {
                //check if there is activities happening today
                $http.get(todayUrl)
                  .success(function (data) {
                    if(data != null)
                    {
                      if(data.activityToReturn.length != 0)
                      {
                        var t = data.activityToReturn[0].datetime_start.split(/[- :]/);
                        $scope.todayActivityDate = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                        $scope.todayId = data.activityToReturn[0].activity_id;
                        $scope.todayStatus = "New Task";
                        $scope.showUrgent = false;
                        $scope.inProgress = false;
                      }
                      else
                      {
                        $scope.showUrgent = true;
                        $scope.inProgress = false;
                      }
                    }
                  })
              }
            }
          })
      }
      else
      {
        url = apiUrl+"retrieveRecommendedTransportActivity?limit=1";
        secondUrl = apiUrl+"getAllVolunteerContribution";
        $http.get(secondUrl)
          .success(function (data) {
            if(data != null)
            {
              $scope.totalVolunteers = data.totalVolunteers;
              $scope.totalTaskHours = data.totalTaskHours;
            }
          })
        $scope.showUrgent = true;
        $scope.inProgress = false;
      }

      $http.get(url)
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
          //to check that application also got user location && data finish loading
            $scope.loadingshow = false;
            $ionicLoading.hide();
        })

      $scope.scan = function () {
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Getting your location...'})

        //NOTE BACKEND DEVELOPERS: remove latlng global vars from other logout function when stable
        //NOTE BACKEND DEVELOPERS: set timeout to only fire error once
        if(window.localStorage.getItem("userLat") == null) {
          var onSuccess = function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            console.log(lat);
            window.localStorage.setItem("userLat", lat);
            window.localStorage.setItem("userLong", lng);

            $state.go('scan', {}, {reload: true});

            $scope.loadingshow = false;
            $ionicLoading.hide();
          };

          function onError(err) {
            //$ionicLoading.hide();
            //$state.go('landingPage', {}, {reload: true});
            $scope.loadingshow = false;
            $ionicLoading.hide();
          }

          //get location with 10 secs timeout
          navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000, enableHighAccuracy: true });
        }
        else
        {
          $scope.loadingshow = false;
          $ionicLoading.hide();
          $state.go('scan', {}, {reload: true});
        }
      }

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

    $scope.updateStatus=function(id, status)
    {
      if(status == "New Task")
      {
        status = "pick-up";
      }
      else if(status == "pick-up")
      {
        status = "at check-up";
      }
      else if(status == "at check-up")
      {
        status = "check-up completed";
      }
      else if(status == "check-up completed")
      {
        status = "completed";
      }

      var confirmPopup = $ionicPopup.confirm({
        title: '<h6 class="popups title">Update Status?</h6>',
        subTitle: "<h6 class='popups'>Are you sure you want to update status for this activity to '" + status + "' ?</h6>",
        okType:"button button-stable",
        cancelType:"button button-stable registration"
      });

      confirmPopup.then(function(res) {
        if(res) {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          urlString = apiUrl+"updateActivityStatus?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+id+"&status="+status;

          $http.get(urlString)
            .success(function (data) {
              var status = data;
              if (status != null) {
                $scope.loadingshow = false;
                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Status</h6>',
                  subTitle: "<h6 class='popups'>"+"Update Successful"+"</h6>",
                  okType:"button button-stable"
                });

                if(status == "completed")
                {
                  $state.go('tab.myhistory', {}, {reload: true});
                }
                else
                {
                  //window.location.reload(true);
                  $state.go('tab.home', {}, {reload: true});
                }
              }
            })

            .error(function (data) {
              alert("Error in connection");
            });
        }
        else
        {
          $state.go('tab.home', {}, {reload: true});
        }
      });
    }
    });
