angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        }
        else {
          $state.go('landingPage', {}, {reload: true});
        }

    $scope.toLoad = function()
    {
      $scope.groups = [];

      $scope.groups.push({name: "Completed", items: []});
      $scope.groups.push({name: "Pending", items: []});
      $scope.groups.push({name: "Rejected/Withdrawn", items: []});

      var urlString = apiUrl+"retrieveTransportByUser?id=" +$scope.id+"&type=2";

      $http.get(urlString,{timeout: 6000})
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.activities.length; i++){

              if(transportDetails.activities[i].activity_id != null){
                var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                if(transportDetails.task[i].approval == "approved" && transportDetails.task[i].status== "completed")
                {
                  $scope.groups[0].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Completed"});
                }
                else
                {
                  var currentDateTime = new Date();
                  if(dateTime < currentDateTime)
                  {
                    if(transportDetails.task[i].approval == "withdrawn") {
                      $scope.groups[2].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails.task[i].approval == "rejected")
                    {
                      $scope.groups[2].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails.task[i].approval == "pending")
                    {
                      $scope.groups[1].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
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

    $scope.proceed = function(id, name)
    {
      $state.go('myPastActivityDetails', {transportId: id, transportActivityName: name});
    }

    $scope.goCurrent = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.activity');
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
