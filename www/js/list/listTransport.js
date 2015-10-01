angular.module('crowdsourcing')

    .controller('listTransportController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.transportID=[];
      $scope.transportName=[];
      $scope.transportDateTimeStart=[];

      $http.get("http://localhost/RetrieveTransportActivity.php")
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.length; i++)
          {
            if(transportDetails[i].TransportID != null && transportDetails[i].ActivityName && transportDetails[i].DateTimeStart)
            {
              $scope.transportID.push(transportDetails[i].TransportID);
              $scope.transportName.push(transportDetails[i].ActivityName);
              $scope.transportDateTimeStart.push(transportDetails[i].DateTimeStart);
            }
          }

          console.log($scope.transportName);

          /*
          for (var i = 0; i < loginDetails.length; i++) {
            if(tempNRIC == loginDetails[i].Email && tempPassword == loginDetails[i].Password)
            {
              loginCheck = 1;

              window.localStorage.setItem("loginUserName", loginDetails[i].Name);
              window.localStorage.setItem("loginUserEmail", loginDetails[i].Email);
              window.localStorage.setItem("loginUserPassword", loginDetails[i].Password);
              window.localStorage.setItem("loginUserContactNumber", loginDetails[i].Phone);
              window.localStorage.setItem("loginUserDOB", loginDetails[i].DOB);

              $state.go('tab.home', {}, {reload: true});
            }
          }*/
        }
      })
    });
