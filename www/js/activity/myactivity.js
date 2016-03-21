angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {

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
                  text: '<b>Ok</b>',
                  type: 'button button-stable',
                  onTap: function(e) {
                    $state.go('landingPage', {}, {reload: true});
                  }
                },
              ]
            });
        }

    $scope.toLoad = function()
    {
      $scope.groups = [];

      $scope.groups.push({name: "In-Progress", items: []});
      $scope.groups.push({name: "Approved", items: []});
      $scope.groups.push({name: "Pending", items: []});
      $scope.groups.push({name: "Rejected/Withdrawn", items: []});

      var urlString = apiUrl+"retrieveTransportByUser?id=" +$scope.id+"&type=1";

      $http.get(urlString,{timeout: 6000})
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.activities.length; i++){

              if(transportDetails.activities[i].activity_id != null){
                var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                var dateTimeCompare = dateTime;
                var currentDate = new Date();

                if(transportDetails.task[i].approval == "approved")
                {
                  if(transportDetails.task[i].approval == "approved" && transportDetails.task[i].status == "new task")
                  {
                    if((dateTimeCompare.getDate() == currentDate.getDate() && dateTimeCompare.getMonth() == currentDate.getMonth() && dateTimeCompare.getYear() == currentDate.getYear()) || currentDate > dateTimeCompare)
                    {
                      $scope.groups[1].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), updateStatusEnable:true, id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Activity not yet started", statusDisplay:"Pick-Up"});
                    }
                    else
                    {
                      $scope.groups[1].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), updateStatusEnable:false, id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Activity not yet started", statusDisplay:"Pick-Up"});
                    }

                  }
                  else
                  {
                    if(transportDetails.task[i].status == "pick-up")
                    {
                      $scope.groups[0].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), updateStatusEnable:true, id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Picked Up", statusDisplay:"At Check-Up"});
                    }
                    else if(transportDetails.task[i].status == "at check-up")
                    {
                      $scope.groups[0].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), updateStatusEnable:true, id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"At Check-Up", statusDisplay:"Check-Up Completed"});
                    }
                    else if(transportDetails.task[i].status == "check-up completed")
                    {
                      $scope.groups[0].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), updateStatusEnable:true, id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Check-Up Completed", statusDisplay:"Completed"});
                    }
                  }
                }
                else //if approval status not approved, check the date/time so that only future events are shown
                {
                  var currentDateTime = new Date();
                  if(dateTime >= currentDateTime)
                  {
                    if(transportDetails.task[i].approval == "pending" && transportDetails.task[i].status == "new task") {
                      $scope.groups[2].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails.task[i].approval == "rejected" && transportDetails.task[i].status == "new task")
                    {
                      $scope.groups[3].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails.task[i].approval == "withdrawn" && transportDetails.task[i].status == "new task")
                    {
                      $scope.groups[3].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                  }
                }
              }
            }
          }
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
          alert("Error in connection, Please try again");
          $scope.loadingshow = false;
          $ionicLoading.hide();
        })

        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.toLoad();

    $scope.toggleGroup = function(group) {
      if ($scope.isGroupShown(group)) {
        $scope.shownGroup = null;
      } else {
        $scope.shownGroup = group;
      }
    };
    $scope.isGroupShown = function(group) {
      return $scope.shownGroup === group;
    };

    /*
    //arrange the array to ensure 'approved' and 'inprogress' to be at the top
    $scope.shiftArrays = function()
    {
      for(var i = 0; i<$scope.transportStatus.length; i++){
        if($scope.transportStatus[i] == "Pending"){
          //store in temp var
          var tempStatus = $scope.transportStatus[i];
          var tempID = $scope.transportID[i];
          var tempName = $scope.transportName[i];
          var dateTime = $scope.transportDateTimeStart[i];
          var tempDisplay = $scope.transportStatusToDisplay[i];

          //remove element in arrays
          $scope.transportStatus.splice(i,1);
          $scope.transportID.splice(i,1);
          $scope.transportName.splice(i,1);
          $scope.transportDateTimeStart.splice(i,1);
          $scope.transportStatusToDisplay.splice(i,1);

          //put var as the top element
          $scope.transportStatus.unshift(tempStatus);
          $scope.transportID.unshift(tempID);
          $scope.transportName.unshift(tempName);
          $scope.transportDateTimeStart.unshift(dateTime);
          $scope.transportStatusToDisplay.unshift(tempDisplay);
        }
      }

      for(var i = 0; i<$scope.transportStatus.length; i++){
        if($scope.transportStatus[i] == "Approved"){
          //store in temp var
          var tempStatus = $scope.transportStatus[i];
          var tempID = $scope.transportID[i];
          var tempName = $scope.transportName[i];
          var dateTime = $scope.transportDateTimeStart[i];
          var tempDisplay = $scope.transportStatusToDisplay[i];

          //remove element in arrays
          $scope.transportStatus.splice(i,1);
          $scope.transportID.splice(i,1);
          $scope.transportName.splice(i,1);
          $scope.transportDateTimeStart.splice(i,1);
          $scope.transportStatusToDisplay.splice(i,1);

          //put var as the top element
          $scope.transportStatus.unshift(tempStatus);
          $scope.transportID.unshift(tempID);
          $scope.transportName.unshift(tempName);
          $scope.transportDateTimeStart.unshift(dateTime);
          $scope.transportStatusToDisplay.unshift(tempDisplay);
        }
      }

      for(var i = 0; i<$scope.transportStatus.length; i++){
        if($scope.transportStatus[i] == "In-Progress"){
          //store in temp var
          var tempStatus = $scope.transportStatus[i];
          var tempID = $scope.transportID[i];
          var tempName = $scope.transportName[i];
          var dateTime = $scope.transportDateTimeStart[i];
          var tempDisplay = $scope.transportStatusToDisplay[i];

          //remove element in arrays
          $scope.transportStatus.splice(i,1);
          $scope.transportID.splice(i,1);
          $scope.transportName.splice(i,1);
          $scope.transportDateTimeStart.splice(i,1);
          $scope.transportStatusToDisplay.splice(i,1);

          //put var as the top element
          $scope.transportStatus.unshift(tempStatus);
          $scope.transportID.unshift(tempID);
          $scope.transportName.unshift(tempName);
          $scope.transportDateTimeStart.unshift(dateTime);
          $scope.transportStatusToDisplay.unshift(tempDisplay);
        }
      }
    }*/

    $scope.updateStatus=function(id, status)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: '<h6 class="popups title">Update Status?</h6>',
        subTitle: "<h6 class='popups'>Are you sure you want to update status for this activity to '" + status + "' ?</h6>",
        okType:"button button-stable",
        cancelType:"button button-stable registration"
      });

      confirmPopup.then(function(res) {
        if(res) {
          if(status == "Pick-Up")
          {
            status = "pick-up";
          }
          else if(status == "At Check-Up")
          {
            status = "at check-up";
          }
          else if(status == "Check-Up Completed")
          {
            status = "check-up completed";
          }
          else if(status == "Completed")
          {
            status = "completed";
          }

          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          urlString = apiUrl+"updateActivityStatus?volunteer_id="+$scope.id+"&activity_id="+id+"&status="+status;

          $http.get(urlString,{timeout: 6000})
            .success(function (data) {
              var status1 = data;
              if (status1 != null) {
                $scope.loadingshow = false;
                $ionicLoading.hide();

                if(status == "completed")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Status</h6>',
                    subTitle: "<h6 class='popups'>"+"Congrats, you have completed an activity! Check history tab view the activity."+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.myhistory', {}, {reload: true});
                }
                else if(status == "pick-up")
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Status</h6>',
                    subTitle: "<h6 class='popups'>"+"Update Successful! Activity is in progress"+"</h6>",
                    okType:"button button-stable"
                  });
                  $state.go('tab.activity', {}, {reload: true});
                }
                else
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Status</h6>',
                    subTitle: "<h6 class='popups'>"+"Update Successful"+"</h6>",
                    okType:"button button-stable"
                  });
                  //window.location.reload(true);
                  $state.go('tab.activity', {}, {reload: true});
                }
              }
            })

            .error(function (data) {
              alert("Error in connection, Please try again");
              $scope.loadingshow = false;
              $ionicLoading.hide();
            });
        }
        else
        {
          $state.go('tab.activity', {}, {reload: true});
        }
      });
    }

    $scope.proceed = function(id, name)
    {
      $state.go('myactivityDetails', {transportId: id, transportActivityName: name});
    }

    $scope.goHistory = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.myhistory');
    }

    function getInitials(string) {
      var names = string.split(' '),
        initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        initials += "." + names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
    }
});
