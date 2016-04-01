angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout, $ionicLoading, apiUrl) {

    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

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
                subTitle: '<h5 class="popups home">Turn On Location Services to Allow "CareGuide" to Determine Your Current Location</h5>',
                scope: $scope,
                buttons: [
                  {
                    text: '<h5 class="popups option"><font color="#29A29C">Location Settings</font></h5>',
                    type: 'button button-stable home1',
                    onTap: function (e) {
                      $state.go('landingPage', {}, {reload: true});
                      cordova.plugins.diagnostic.switchToLocationSettings();
                    }
                  },
                  {
                    text: '<h5 class="popups option"><font color="#29A29C">Skip</font></h5>',
                    type: 'button button-stable home2',
                    onTap: function (e) {
                      //use default location
                      window.localStorage.setItem("userLat", "1.367870");
                      window.localStorage.setItem("userLong", "103.802889");

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
                    subTitle: '<h5 class="popups home">Turn On Location Service Mode to High Accuracy</h5>',
                    scope: $scope,
                    buttons: [
                      {
                        text: '<h5 class="popups option"><font color="#29A29C">Location Settings</font></h5>',
                        type: 'button button-stable home1',
                        onTap: function (e) {
                          $state.go('landingPage', {}, {reload: true});
                          cordova.plugins.diagnostic.switchToLocationSettings();
                        }
                      },
                      {
                        text: '<h5 class="popups option"><font color="#29A29C">Skip</font></h5>',
                        type: 'button button-stable home2',
                        onTap: function (e) {
                          //use default location
                          window.localStorage.setItem("userLat", "1.367870");
                          window.localStorage.setItem("userLong", "103.802889");

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
        else
        {
          cordova.plugins.diagnostic.requestLocationAuthorization(function(status){

          }, function(error){
              console.error(error);
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

        $scope.totalVolunteers = null;
        $scope.totalTaskHours = null;
        $http.get(secondUrl,{timeout: 12000})
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

        $http.get(inProgressUrl,{timeout: 12000})
          .success(function (data) {
            if(data != null)
            {
              if(data.activityToReturn != null)
              {
                var t = data.activityToReturn.datetime_start.split(/[- :]/);
                $scope.inProgressId = data.activityToReturn.activity_id;
                $scope.InProgressActivityDate = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                if(data.taskStatus == "pick-up") {
                  $scope.InProgressStatus = "Picked-up";
                }
                else {
                  $scope.InProgressStatus = $scope.capitalizeFirstLetter(data.taskStatus);
                }
                $scope.showUrgent = false;
                $scope.inProgress = true;
              }
              else
              {
                //check if there is activities happening today
                $http.get(todayUrl,{timeout: 12000})
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
      else
      {
        url = apiUrl+"retrieveRecommendedTransportActivity?limit=1";
        secondUrl = apiUrl+"getAllVolunteerContribution";
        $http.get(secondUrl,{timeout: 12000})
          .success(function (data) {
            if(data != null)
            {
              $scope.totalVolunteers = data.totalVolunteers;
              $scope.totalTaskHours = data.totalTaskHours;
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
        $scope.showUrgent = true;
        $scope.inProgress = false;
      }

      $http.get(url,{timeout: 12000})
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

      $scope.scan = function () {
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Getting your location...'})

        if(window.localStorage.getItem("userLat") == null) {
          var onSuccess = function(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;

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
            if (typeof cordova != 'undefined') {
              if(ionic.Platform.isAndroid() == false) {
                cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
                    if(!enabled)
                    {
                      $ionicLoading.hide();
                      var myPopup = $ionicPopup.show({
                        subTitle: '<h5 class="popups home">Turn On Location Services to Allow "CareGuide" to Determine Your Current Location</h5>',
                        scope: $scope,
                        buttons: [
                          {
                            text: '<h5 class="popups option"><font color="#29A29C">Location Settings</font></h5>',
                            type: 'button button-stable registration',
                            onTap: function (e) {
                              $state.go('landingPage', {}, {reload: true});
                              cordova.plugins.diagnostic.switchToSettings(function(){

                              }, function(error){
                                  console.error("The following error occurred: "+error);
                              });
                            }
                          },
                          {
                            text: '<h5 class="popups option"><font color="#29A29C">Skip</font></h5>',
                            type: 'button button-stable',
                            onTap: function (e) {
                              //use default location
                              window.localStorage.setItem("userLat", "1.367870");
                              window.localStorage.setItem("userLong", "103.802889");

                              $scope.loadingshow = false;
                              $ionicLoading.hide();
                            }

                          },
                        ]
                      });
                    }
                  },
                  function(error){
                    console.error("The following error occurred: "+error);
                  });
              }
            }
          }

          //get location with 10 secs timeout
          navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 15000, enableHighAccuracy: true });
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
      else if(status == "Picked-up")
      {
        status = "at check-up";
      }
      else if(status == "At Check-up")
      {
        status = "check-up completed";
      }
      else if(status == "Check-up Completed")
      {
        status = "completed";
      }

      var confirmPopup = $ionicPopup.confirm({
        title: '<h6 class="popups title">Update Status?</h6>',
        subTitle: "<h6 class='popups'>Are you sure you want to update status for this activity to '" + $scope.capitalizeFirstLetter(status) + "' ?</h6>",
        okType:"button button-stable home3",
        cancelType:"button button-stable home4"
      });

      confirmPopup.then(function(res) {
        if(res) {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          urlString = apiUrl+"updateActivityStatus?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+id+"&status="+status;

          $http.get(urlString,{timeout: 12000})
            .success(function (data) {
              var status1 = data;
              if (status1 != null) {
                $scope.loadingshow = false;
                $ionicLoading.hide();

                if(status == "completed")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Congratulations!</h6>',
                    subTitle: "<h6 class='popups'>"+"You have completed your voluntary activity today! The activity is now at the history tab for your future reference"+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.myhistory', {}, {reload: true});
                }
                else if(status == "pick-up")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Success!</h6>',
                    subTitle: "<h6 class='popups status'>"+"Update Successful! Activity is in progress"+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.home', {}, {reload: true});
                }
                else if(status == "at check-up")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Success!</h6>',
                    subTitle: "<h6 class='popups status'>"+"Update Successful! Elderly is at check up now"+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.home', {}, {reload: true});
                }
                else if(status == "check-up completed")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Success!</h6>',
                    subTitle: "<h6 class='popups status'>"+"Update Successful! Elderly has completed the check up"+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.home', {}, {reload: true});
                }
                else
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Success!</h6>',
                    subTitle: "<h6 class='popups status'>"+"Update Successful"+"</h6>",
                    okType:"button button-stable"
                  });
                  //window.location.reload(true);
                  $state.go('tab.home', {}, {reload: true});
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
        }
        else
        {
          $state.go('tab.home', {}, {reload: true});
        }
      });
    }
    $scope.capitalizeFirstLetter=function(str)
    {
      return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
    });
