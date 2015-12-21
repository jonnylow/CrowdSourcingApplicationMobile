angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover) {

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
        }
        else {
            var myPopup = $ionicPopup.show({
              title: 'Notice',
              subTitle: 'You must login first',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-calm',
                  onTap: function(e) {
                    $state.go('login', {}, {reload: true});
                  }
                },
              ]
            });
        }

    $scope.toLoad = function()
    {
      $scope.groups = [];

      $scope.groups.push({name: "In-Progress", items: []});
      $scope.groups.push({name: "Pending", items: []});
      $scope.groups.push({name: "Approved", items: []});
      $scope.groups.push({name: "Rejected/Withdrawn", items: []});

      var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=1";

      $http.get(urlString)
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.length; i++){

              if(transportDetails[i].activity_id != null && transportDetails[i].name != null && transportDetails[i].datetime_start !=null){
                var temp =transportDetails[i].datetime_start.split(' ');
                var datesTemp = temp[0].split('-');
                if(transportDetails[i].approval == "approved")
                {
                  if(transportDetails[i].approval == "approved" && transportDetails[i].status == "new task")
                  {
                    $scope.groups[2].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Activity not yet started", statusDisplay:"Pick-Up"});
                  }
                  else
                  {
                    if(transportDetails[i].status == "pick-up")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Picked Up", statusDisplay:"At Check-Up"});
                    }
                    else if(transportDetails[i].status == "at check-up")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"At Check-Up", statusDisplay:"Check-Up Completed"});
                    }
                    else if(transportDetails[i].status == "check-up completed")
                    {
                      $scope.groups[0].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Check-Up Completed", statusDisplay:"Completed"});
                    }
                  }
                }
                else //if approval status not approved, check the date/time so that only future events are shown
                {
                  var date_temp = temp[0] + " " + temp[1];
                  var transportDateTime = new Date(date_temp.replace(/-/g,"/"));
                  var currentDateTime = new Date();
                  if(transportDateTime >= currentDateTime)
                  {
                    if(transportDetails[i].approval == "pending" && transportDetails[i].status == "new task") {
                      $scope.groups[1].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails[i].approval == "rejected" && transportDetails[i].status == "new task")
                    {
                      $scope.groups[3].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                    else if(transportDetails[i].approval == "withdrawn" && transportDetails[i].status == "new task")
                    {
                      $scope.groups[3].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], status:"Not Applicable", statusDisplay:"No status to update"});
                    }
                  }
                }
              }
            }
          }
          $scope.loadingshow = false;
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
        title: 'Update Status?',
        template: "Are you sure you want to update status for this activity to '" + status + "' ?"
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
          urlString = "http://www.changhuapeng.com/volunteer/php/updateActivityStatus.php?volunteer_id="+$scope.id+"&activity_id="+id+"&status="+status;

          $http.get(urlString)
            .success(function (data) {
              var status = data;
              if (status != null) {
                $scope.loadingshow = false;
                var alertPopup = $ionicPopup.alert({
                  title: 'Status',
                  template: status.status[0]
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

    // .fromTemplateUrl() method
    if (window.localStorage.getItem("loginUserName") == null) {
      $ionicPopover.fromTemplateUrl('templates/home/menu_popout_guest.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
    }
    else {
      $ionicPopover.fromTemplateUrl('templates/home/menu_popout.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
    }

    $scope.openPopover = function($event) {
      $scope.popover.show($event);
    };
    $scope.closePopover = function() {
      $scope.popover.hide();
    };
    //Cleanup the popover when we're done with it!
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
    });

    $scope.logout = function () {
      window.localStorage.removeItem("loginUserName");
      window.localStorage.removeItem("loginId");
      window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      //window.location.reload(true);
      $state.go('login', {}, {reload: true});
      //$state.transitionTo('loginHome', null, {'reload':true});
    }

    $scope.goHistory = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.myhistory');
    }
});
