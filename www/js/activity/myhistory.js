angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
        $scope.transportID=[];
        $scope.transportName=[];
      	$scope.transportDateTimeStart=[];
        $scope.transportStatus=[];

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
        }
        else {
          $state.go('login', {}, {reload: true});
        }

       	var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=2";

    $http.get(urlString)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null){
          for(var i = 0; i<transportDetails.length; i++){

            if(transportDetails[i].activity_id != null && transportDetails[i].name != null && transportDetails[i].datetime_start !=null){
              var temp =transportDetails[i].datetime_start.split(' ');

              if(transportDetails[i].approval == "withdrawn") {
                $scope.transportStatus.push("Withdraw");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
              else if(transportDetails[i].approval == "rejected")
              {
                $scope.transportStatus.push("Rejected");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
              else if(transportDetails[i].approval == "approved" && transportDetails[i].status== "completed")
              {
                $scope.transportStatus.push("Completed");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
            }
          }
        }
      })
});
