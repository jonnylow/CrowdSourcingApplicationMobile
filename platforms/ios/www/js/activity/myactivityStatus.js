angular.module('crowdsourcing')

    .controller('myactivityStatusController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName + " Status";
      $scope.transportStatus= $stateParams.status;
      $scope.id = window.localStorage.getItem("loginId");

      if($scope.transportStatus == "New Task")
      {
        $scope.pickedup = false;
        $scope.checkup=true;
        $scope.checkupcomplete = true;
        $scope.completed = true;
      }
      else if($scope.transportStatus == "Pick-up")
      {
        $scope.pickedup = true;
        $scope.checkup=false;
        $scope.checkupcomplete = true;
        $scope.completed = true;
      }
      else if($scope.transportStatus == "At Check-up")
      {
        $scope.pickedup = true;
        $scope.checkup=true;
        $scope.checkupcomplete = false;
        $scope.completed = true;
      }
      else if($scope.transportStatus == "Check-up completed")
      {
        $scope.pickedup = true;
        $scope.checkup=true;
        $scope.checkupcomplete = true;
        $scope.completed = false;
      }
    }

    $scope.updateStatus=function(status)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Update Status?',
        template: 'Are you sure you want to update status for this activity?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          urlString = "http://www.changhuapeng.com/volunteer/php/updateActivityStatus.php?volunteer_id="+$scope.id+"&activity_id="+$scope.transportId+"&status="+status;

          $http.get(urlString)
            .success(function (data) {
              var status = data;
              if (status != null) {
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

    $scope.back=function()
    {
      $ionicHistory.goBack();
    }

});
