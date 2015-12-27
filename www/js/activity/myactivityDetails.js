angular.module('crowdsourcing')

    .controller('myactivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.loadingshow = true;
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveMyTransportActivityDetails.php?transportId=" + $scope.transportId +"&id="+$scope.id)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          if(transportDetails[0] != null)
          {
            if(transportDetails[0].datetime_start != null && transportDetails[0].expected_duration_minutes != null && transportDetails[0].location_from != null
              && transportDetails[0].location_to !=null && transportDetails[0].more_information != null)
            {
              var t = transportDetails[0].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

              $scope.dateTime = dateTime;
              $scope.expectedDuration = transportDetails[0].expected_duration_minutes + " Mins";
              $scope.locationFrom = transportDetails[0].location_from;
              $scope.locationTo = transportDetails[0].location_to;
              $scope.moreInformation = transportDetails[0].more_information;
              if($scope.moreInformation == "")
              {
                $scope.moreInformation = "No Additional Information"
              }
              $scope.approvalStatus = capitalizeFirstLetter(transportDetails[0].approval);

              var transportStatusToDisplay;
              if(transportDetails[0].status == "new task")
              {
                transportStatusToDisplay = "Activity not started yet";
              }
              else
              {
                transportStatusToDisplay = transportDetails[0].status;
              }

              $scope.transportStatus = capitalizeFirstLetter(transportStatusToDisplay);


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

              if(transportDetails[0].approval != "withdrawn" && transportDetails[0].approval != "rejected") {
                if (transportDetails[0].status != "new task") {
                  $scope.withdrawShow = true;
                }
                else {
                  $scope.withdrawShow = false;
                }
              }
              else
              {
                $scope.withdrawShow = true;
              }
            }
          }
        }
        $scope.loadingshow = false;
      })

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.proceed = function(id, name)
    {
      $state.go('elderyInformation', {transportId: id, transportActivityName: name});
    }

    $scope.back=function()
    {
      $ionicHistory.goBack();
    }

    $scope.goStatus=function(id, name)
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
          $scope.loadingshow = true;
          urlString = "http://www.changhuapeng.com/volunteer/php/Withdraw.php?volunteer_id="+$scope.id+"&activity_id="+$scope.transportId;

          $http.get(urlString)
            .success(function (data) {
              var sendEmail = "http://changhuapeng.com/volunteer/php/email/sendEmail.php?email=jonathanlow.2013@sis.smu.edu.sg&message="+window.localStorage.getItem("loginUserName")+ " has withdrawn from a transport activity";
              $http.get(sendEmail)
                .success(function (data) {

                })

                .error(function (data) {
                  alert("Error in connection");
                });

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
      });
    }
});
