angular.module('crowdsourcing')

    .controller('activityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveTransportActivityDetails.php?transportId=" + $scope.transportId)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          if(transportDetails[0] != null)
          {
            if(transportDetails[0].datetime_start != null && transportDetails[0].expected_duration_minutes != null && transportDetails[0].location_from != null
            && transportDetails[0].location_to !=null && transportDetails[0].more_information != null)
              {
                var temp =transportDetails[0].datetime_start.split(' ');
                $scope.date = temp[0];
                $scope.time = temp[1];
                $scope.expectedDuration = transportDetails[0].expected_duration_minutes + " Mins";
                $scope.locationFrom = transportDetails[0].location_from;
                $scope.locationTo = transportDetails[0].location_to;
                $scope.moreInformation = transportDetails[0].more_information;
              }
          }
        }
      })

      //need to link up to backend database.
      $scope.apply=function()
      {
        if(window.localStorage.getItem("loginUserName") != null) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Apply?',
            template: 'Are you sure you want to apply for this transport activity?'
          });

          confirmPopup.then(function(res) {
            if(res) {
              window.localStorage.setItem("tempADate", $scope.date);
              window.localStorage.setItem("tempATime", $scope.time);
              window.localStorage.setItem("tempAExpectedDuration", $scope.expectedDuration);
              window.localStorage.setItem("tempALocationFrom", $scope.locationFrom);
              window.localStorage.setItem("tempALocationTo", $scope.locationTo);

              var urlString = "http://www.changhuapeng.com/volunteer/php/AddNewActivity.php?volunteer_id="+window.localStorage.getItem("loginId")+"&activity_id="+$scope.transportId;

              $http.get(urlString)
                .success(function (data) {
                  /*success
                   var status = data;
                   if (status != null) {
                   var alertPopup = $ionicPopup.alert({
                   title: 'Status',
                   template: status.status[0]
                   });
                   }*/

                  $state.go('activityConfirmation', {transportId: $scope.transportId, transportActivityName: $scope.transportActivityName});
                })

                .error(function (data) {
                  alert("Error in connection");
                });
            }
          });
        }
        else {
          var myPopup = $ionicPopup.show({
            title: 'Notice',
            subTitle: 'You must login first',
            scope: $scope,
            buttons: [
              {
                text: 'Cancel',
                onTap: function(e) {
                  $state.go('scan', {}, {reload: true});
                }},
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
      }

      $scope.back=function()
      {
        $ionicHistory.goBack();
      }
  });
