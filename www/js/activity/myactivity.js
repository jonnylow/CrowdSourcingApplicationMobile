/**
 * This js script will handle all logic for showing user's activity. Its corresponding html file is myactivity.html.
 * The main purpose of this page is just to handle any logic when displaying activities information for a user.
 */
angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {
        //Store the backview page in a storage to be use later on
        if ($ionicHistory.backView() != null) {
          $scope.backView = $ionicHistory.backView();
        }

        //if user not login, direct to login
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
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

    if(window.localStorage.getItem("loginUserName") != null) {
      //put whole codes into method, so that 'Refresh' function could call this function
      $scope.toLoad = function () {
        $scope.groups = [];
        //create the different array for the different grouping base on the status
        $scope.groups.push({name: "In-Progress", items: []});
        $scope.groups.push({name: "Approved", items: []});
        $scope.groups.push({name: "Pending", items: []});
        $scope.groups.push({name: "Rejected/Withdrawn", items: []});

        //call web service to get activity from the user base on current or past dates.
        var urlString = apiUrl + "retrieveTransportByUser?id=" + $scope.id + "&type=1";

        $http.get(urlString, {timeout: 12000})
          .success(function (data) {
            //web service will return all activity details in an array, and information will be placed in the respective array to be displayed at the input fields of the html
            var transportDetails = data;

            //loop each activity
            if (transportDetails != null) {
              for (var i = 0; i < transportDetails.activities.length; i++) {

                if (transportDetails.activities[i].activity_id != null) {
                  var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                  var dateTime = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

                  var dateTimeCompare = dateTime;
                  var currentDate = new Date();
                  //check status of the activity
                  if (transportDetails.task[i].approval == "approved") {
                    if (transportDetails.task[i].approval == "approved" && transportDetails.task[i].status == "new task") {
                      //check the current date and the activity date to see if the update status button should be active for the user to update
                      //time could be within 24 hrs if not the button should not be active
                      if ((dateTimeCompare.getDate() == currentDate.getDate() && dateTimeCompare.getMonth() == currentDate.getMonth() && dateTimeCompare.getYear() == currentDate.getYear()) || currentDate > dateTimeCompare) {
                        $scope.groups[1].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          updateStatusEnable: true,
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          status: "Activity not yet started",
                          statusDisplay: "Pick-Up"
                        });
                      }
                      else {
                        $scope.groups[1].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          updateStatusEnable: false,
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Activity not yet started",
                          statusDisplay: "Pick-Up"
                        });
                      }

                    }
                    else {
                      if (transportDetails.task[i].status == "pick-up") {
                        $scope.groups[0].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          updateStatusEnable: true,
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Picked Up",
                          statusDisplay: "At Check-Up"
                        });
                      }
                      else if (transportDetails.task[i].status == "at check-up") {
                        $scope.groups[0].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          updateStatusEnable: true,
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "At Check-Up",
                          statusDisplay: "Check-Up Completed"
                        });
                      }
                      else if (transportDetails.task[i].status == "check-up completed") {
                        $scope.groups[0].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          updateStatusEnable: true,
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Check-Up Completed",
                          statusDisplay: "Completed"
                        });
                      }
                    }
                  }
                  else //if approval status not approved, check the date/time so that only future events are shown
                  {
                    var currentDateTime = new Date();
                    if (dateTime >= currentDateTime) {
                      if (transportDetails.task[i].approval == "pending" && transportDetails.task[i].status == "new task") {
                        $scope.groups[2].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Not Applicable",
                          statusDisplay: "No status to update"
                        });
                      }
                      else if (transportDetails.task[i].approval == "rejected" && transportDetails.task[i].status == "new task") {
                        $scope.groups[3].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Not Applicable",
                          statusDisplay: "No status to update"
                        });
                      }
                      else if (transportDetails.task[i].approval == "withdrawn" && transportDetails.task[i].status == "new task") {
                        $scope.groups[3].items.push({
                          elderlyIntials: getInitials(transportDetails.activities[i].elderly.name),
                          id: transportDetails.activities[i].activity_id,
                          from: transportDetails.activities[i].departure_centre.name,
                          to: transportDetails.activities[i].arrival_centre.name,
                          name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                          dateTime: dateTime,
                          status: "Not Applicable",
                          statusDisplay: "No status to update"
                        });
                      }
                    }
                  }
                }
              }
            }
            //sort all the activity in the groups base on dates
            $scope.groups[0].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
            $scope.groups[1].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
            $scope.groups[2].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
            $scope.groups[3].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
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
          })

          .finally(function () {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      }

      //this method will be run at the first load
      $scope.toLoad();

      //this method is to handle the toggling of the groups
      $scope.toggleGroup = function (group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function (group) {
        return $scope.shownGroup === group;
      };

      //this method is for updating of status
      $scope.updateStatus = function (id, status) {
        var confirmPopup = $ionicPopup.confirm({
          title: '<h6 class="popups title">Update Status?</h6>',
          subTitle: "<h6 class='popups body'>Are you sure you want to update status for this activity to '" + status + "' ?</h6>",
          okType:"button button-stable activity2",
          cancelType:"button button-stable activity1"
        });

        confirmPopup.then(function (res) {
          if (res) {
            if (status == "Pick-Up") {
              status = "pick-up";
            }
            else if (status == "At Check-Up") {
              status = "at check-up";
            }
            else if (status == "Check-Up Completed") {
              status = "check-up completed";
            }
            else if (status == "Completed") {
              status = "completed";
            }

            $scope.loadingshow = true;
            $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

            //using the web service to update the status based on what is display and what is the next status
            urlString = apiUrl + "updateActivityStatus?volunteer_id=" + $scope.id + "&activity_id=" + id + "&status=" + status;

            $http.get(urlString, {timeout: 12000})
              .success(function (data) {
                var status1 = data;
                if (status1 != null) {
                  $scope.loadingshow = false;
                  $ionicLoading.hide();

                  //different pop up messages for different status update
                  if (status == "completed") {
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Status</h6>',
                      subTitle: "<h6 class='popups'>" + "Congratulations! You have completed your voluntary activity today! The activity is now at the history tab for your future reference" + "</h6>",
                      okType: "button button-stable"
                    });
                    $state.go('tab.myhistory', {}, {reload: true});
                  }
                  else if (status == "pick-up") {
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Status</h6>',
                      subTitle: "<h6 class='popups body'>" + "Update Successful! Activity is in progress" + "</h6>",
                      okType: "button button-stable"
                    });
                    $state.go('tab.activity', {}, {reload: true});
                  }
                  else if (status == "at check-up") {
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Status</h6>',
                      subTitle: "<h6 class='popups update'>" + "Update Successful! Elderly is at check up now" + "</h6>",
                      okType: "button button-stable"
                    });
                    $state.go('tab.activity', {}, {reload: true});
                  }
                  else if (status == "check-up completed") {
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Status</h6>',
                      subTitle: "<h6 class='popups update'>" + "Update Successful! Elderly has completed the check up" + "</h6>",
                      okType: "button button-stable"
                    });
                    $state.go('tab.activity', {}, {reload: true});
                  }
                  else {
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Status</h6>',
                      subTitle: "<h6 class='popups update'>" + "Update Successful" + "</h6>",
                      okType: "button button-stable"
                    });
                    //window.location.reload(true);
                    $state.go('tab.activity', {}, {reload: true});
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
          else {
            $state.go('tab.activity', {}, {reload: true});
          }
        });
      }

      //this function will direct the user to the activity details of the particular activity
      $scope.proceed = function (id, name) {
        $state.go('myactivityDetails', {transportId: id, transportActivityName: name});
      }

      //this function will direct user to the history tab
      $scope.goHistory = function () {
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('tab.myhistory');
      }

      //function to get initials of a string
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
