angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicHistory, $ionicPopover, $ionicLoading) {
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

      var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=2";

      $http.get(urlString)
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.length; i++){

              if(transportDetails[i].activity_id != null){
                var t = transportDetails[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                if(transportDetails[i].approval == "approved" && transportDetails[i].status== "completed")
                {
                  $scope.groups[0].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, statusDisplay:"Completed"});
                }
                else
                {
                  var currentDateTime = new Date();
                  if(dateTime < currentDateTime)
                  {
                    if(transportDetails[i].approval == "withdrawn") {
                      $scope.groups[2].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails[i].approval == "rejected")
                    {
                      $scope.groups[2].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails[i].approval == "pending")
                    {
                      $scope.groups[1].items.push({id:transportDetails[i].activity_id, from:transportDetails[i].location_from, to:transportDetails[i].location_to, name:transportDetails[i].location_from + " - " + transportDetails[i].location_to, dateTime:dateTime, statusDisplay:"Not Applicable"});
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
});
