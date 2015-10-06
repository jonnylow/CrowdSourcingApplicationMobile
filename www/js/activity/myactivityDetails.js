angular.module('crowdsourcing')

    .controller('myactivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveMyTransportActivityDetails.php?transportId=" + $scope.transportId)
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
              $scope.transportStatus = transportDetails[0].status;
              if(transportDetails[0].status != "completed" && transportDetails[0].approval=="approved")
              {
                $scope.eldery = false;
                $scope.updateStatus = false;
              }
              else
              {
                $scope.eldery = true;
                $scope.updateStatus = true;
              }
            }
          }
        }
      })

    $scope.proceed = function(id, name)
    {
      $state.go('elderyInformation', {transportId: id, transportActivityName: name});
    }

    $scope.back=function()
    {
      $ionicHistory.goBack();
    }

    $scope.status=function(id, name)
    {
      $state.go('myactivityStatus', {transportId: id, transportActivityName: name, status: $scope.transportStatus});
    }

    $scope.withdraw=function()
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Withdraw?',
        template: 'Are you sure you want to withdraw your application?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          urlString = "http://www.changhuapeng.com/volunteer/php/Withdraw.php?volunteer_id="+$scope.id+"&activity_id="+$scope.transportId;

          $http.get(urlString)
            .success(function (data) {
              var status = data;
              if (status != null) {
                var alertPopup = $ionicPopup.alert({
                  title: 'Status',
                  template: status.status[0]
                });
                window.location.reload(true);
                $state.go('tab.activity', {}, {reload: true});
              }
            })

            .error(function (data) {
              alert("Error in connection");
            });
        }
      });
    }

});
