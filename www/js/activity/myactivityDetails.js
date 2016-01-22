angular.module('crowdsourcing')

    .controller('myactivityDetailsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    $http.get("http://changhuapeng.com/laravel/api/retrieveMyTransportActivityDetails?transportId=" + $scope.transportId +"&id="+$scope.id)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          if(transportDetails.activities[0] != null)
          {
            if(transportDetails.activities[0].datetime_start != null && transportDetails.activities[0].expected_duration_minutes != null)
            {
              var t = transportDetails.activities[0].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

              $scope.dateTime = dateTime;
              $scope.expectedDuration = transportDetails.activities[0].expected_duration_minutes + " Mins";
              $scope.locationFrom = transportDetails.activities[0].departure_centre.name;
              $scope.locationFromAddress = transportDetails.activities[0].departure_centre.address;
              $scope.locationFromAddressLat = transportDetails.activities[0].departure_centre.lat;
              $scope.locationFromAddressLng = transportDetails.activities[0].departure_centre.lng;
              $scope.locationTo = transportDetails.activities[0].arrival_centre.name;
              $scope.locationToAddress = transportDetails.activities[0].arrival_centre.address;
              $scope.locationToAddressLat = transportDetails.activities[0].arrival_centre.lat;
              $scope.locationToAddressLng = transportDetails.activities[0].arrival_centre.lng;
              $scope.moreInformation = transportDetails.activities[0].more_information;
              if($scope.moreInformation == "")
              {
                $scope.moreInformation = "No Additional Information"
              }
              $scope.approvalStatus = capitalizeFirstLetter(transportDetails.task[0].approval);

              var transportStatusToDisplay;
              if(transportDetails.task[0].status == "new task")
              {
                transportStatusToDisplay = "Activity not started yet";
              }
              else
              {
                transportStatusToDisplay = transportDetails.task[0].status;
              }

              $scope.transportStatus = capitalizeFirstLetter(transportStatusToDisplay);


              if(transportDetails.task[0].status != "completed" && transportDetails.task[0].approval=="approved")
              {
                  $scope.eldery = false;
                  $scope.updateStatus = false;
              }
              else
              {
                $scope.eldery = true;
                $scope.updateStatus = true;
              }

              if(transportDetails.task[0].approval != "withdrawn" && transportDetails.task[0].approval != "rejected") {
                if (transportDetails.task[0].status != "new task") {
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
        $ionicLoading.hide();
      })

    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    $scope.proceed = function(id, name, date)
    {
      $state.go('elderyInformation', {transportId: id, transportActivityName: name, transportActivityDate:date});
    }

    $scope.back=function()
    {
      if($scope.backView != null)
      {
        $scope.backView.go();
      }
      else
      {
        $state.go('tab.activity', {}, {reload: true});
      }
      //$ionicHistory.goBack();
    }

    $scope.goStatus=function(id, name)
    {
      $state.go('myactivityStatus', {transportId: id, transportActivityName: name, status: $scope.transportStatus});
    }

    $scope.withdraw=function()
    {
      var currentDate = new Date();
      currentDate.setHours(0,0,0,0);
      currentDate.setDate(currentDate.getDate() + 1);

      if($scope.dateTime > currentDate)
      {
        var confirmPopup = $ionicPopup.confirm({
          title: "<h6 class='popups title error'>Withdraw?</h6>",
          subTitle: "<h6 class='popups'>Are you sure you want to withdraw from this activity?</h6>",
          cancelType: 'button button-stable registration',
          okType:'button button-stable'
        });

        confirmPopup.then(function(res) {
          if(res) {
            $scope.loadingshow = true;
            $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

            urlString = "http://changhuapeng.com/laravel/api/withdraw?volunteer_id="+$scope.id+"&activity_id="+$scope.transportId;

            $http.get(urlString)
              .success(function (data) {
                var sendEmail = apiUrl+"email/sendEmail.php?email=jonathanlow.2013@sis.smu.edu.sg&message="+window.localStorage.getItem("loginUserName")+ " has withdrawn from a transport activity";
                $http.get(sendEmail)
                  .success(function (data) {

                  })

                  .error(function (data) {
                    alert("Error in connection");
                  });

                var status = data;
                if (status != null) {
                  $scope.loadingshow = false;
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    //title: 'Status',
                    title: "<h6 class='popups'>"+status.status[0]+"</h6>",
                    okType:'button button-stable'
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
      else
      {
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">You are not allow to withdraw from the activity on the actual date. Please call the centre if you cannot make it.</h6> ',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button button-stable',

            },
          ]
        });
      }
    }

    $scope.openUrl = function (locationFromAddressLat, locationFromAddressLng, locationToAddressLat, locationToAddressLng){
      if(ionic.Platform.isAndroid() == true) { //android
        var url = 'http://maps.google.com/maps?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
        window.open(url,'_system','location=yes');
        return false;
      }
      else { //ios
        var url = 'http://maps.apple.com/?saddr='+locationFromAddressLat+','+locationFromAddressLng+'&daddr='+locationToAddressLat+','+locationToAddressLng+'&dirflg=d"';
        window.open(url,'_system','location=yes');
        return false;
      }
    };
});
