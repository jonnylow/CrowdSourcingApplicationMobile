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

      var urlString = apiUrl+"RetrieveTransportByUser.php?id="+$scope.id+"&type=1";

      $http.get(urlString)
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.length; i++){

              if(transportDetails[i].activity_id != null){
                var t = transportDetails[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                if(transportDetails[i].approval == "approved")
                {
                  if(transportDetails[i].approval == "approved" && transportDetails[i].status == "new task")
                  {
                    $scope.groups[1].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Activity not yet started", statusDisplay:"Pick-Up"});
                  }
                  else
                  {
                    if(transportDetails[i].status == "pick-up")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Picked Up", statusDisplay:"At Check-Up"});
                    }
                    else if(transportDetails[i].status == "at check-up")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"At Check-Up", statusDisplay:"Check-Up Completed"});
                    }
                    else if(transportDetails[i].status == "check-up completed")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Check-Up Completed", statusDisplay:"Completed"});
                    }
                  }
                }
                else //if approval status not approved, check the date/time so that only future events are shown
                {
                  var currentDateTime = new Date();
                  if(dateTime >= currentDateTime)
                  {
                    if(transportDetails[i].approval == "pending" && transportDetails[i].status == "new task") {
                      $scope.groups[2].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails[i].approval == "rejected" && transportDetails[i].status == "new task")
                    {
                      $scope.groups[3].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails[i].approval == "withdrawn" && transportDetails[i].status == "new task")
                    {
                      $scope.groups[3].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                  }
                }
              }
            }
          }
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

          urlString = "http://changhuapeng.com/laravel/api/updateActivityStatus?volunteer_id="+$scope.id+"&activity_id="+id+"&status="+status;
          console.log(urlString);
          $http.get(urlString)
            .success(function (data) {
              var status = data;
              if (status != null) {
                $scope.loadingshow = false;
                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Status</h6>',
                  subTitle: "<h6 class='popups'>"+status.status[0]+"</h6>",
                  okType:"button button-stable"
                });
                //window.location.reload(true);
                $state.go('tab.activity', {}, {reload: true});
              }
            })

            .error(function (data) {
              alert("Error in connection");
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
});
