angular.module('crowdsourcing')

    .controller('verifyController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
    $scope.tempName = window.localStorage.getItem("tempName");
    $scope.tempEmail = window.localStorage.getItem("tempEmail");
    $scope.tempPassword = window.localStorage.getItem("tempPassword");
    $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
    $scope.tempDOB = window.localStorage.getItem("tempDOB");
    $scope.tempNRIC = window.localStorage.getItem("tempNRIC");
    $scope.tempGender = window.localStorage.getItem("tempGender");
    $scope.tempHaveCar = window.localStorage.getItem("tempHaveCar");
    $scope.tempOccupation = window.localStorage.getItem("tempOccupation");
    $scope.tempPreferences1 = window.localStorage.getItem("tempPreferences1");
    $scope.tempPreferences2 = window.localStorage.getItem("tempPreferences2");
    $scope.tempFrontIC = "frontIC";
    $scope.tempBackIC = "backIC";

      $scope.fields= {otp: ""};

      $scope.verify = function(fields)
      {
        if(fields != null) {
          if (fields.otp!= null && fields.otp.trim() != "")
          {
            var tempOTP= fields.otp;
            if(tempOTP == "123") {
              window.localStorage.removeItem("tempName");
              window.localStorage.removeItem("tempEmail");
              window.localStorage.removeItem("tempPassword");
              window.localStorage.removeItem("tempContactnumber");
              window.localStorage.removeItem("tempDOB");
              window.localStorage.removeItem("tempNRIC");
              window.localStorage.removeItem("tempGender");
              window.localStorage.removeItem("tempHaveCar");
              window.localStorage.removeItem("tempOccupation");
              window.localStorage.removeItem("tempPreferences1");
              window.localStorage.removeItem("tempPreferences2");

              var urlString = "http://www.changhuapeng.com/volunteer/php/AddUserAccount.php?phone="+$scope.tempContactNumber+"&name="+$scope.tempName+"&email="+$scope.tempEmail+"&password="+$scope.tempPassword+"&dob="+$scope.tempDOB
                +"&nric="+$scope.tempNRIC+"&gender="+$scope.tempGender+"&frontIC="+$scope.tempFrontIC + "&backIC="+$scope.tempBackIC+"&haveCar="+$scope.tempHaveCar+"&preferences1="+$scope.tempPreferences1
                +"&preferences2="+$scope.tempPreferences2+"&occupation="+$scope.tempOccupation;


              $http.get(urlString)
                .success(function (data) {

                  var status = data;
                  if (status != null) {
                    var alertPopup = $ionicPopup.alert({
                      title: 'Status',
                      template: status.status[0]
                    });

                    $state.go('login', {}, {reload: true});
                  }
                })

                .error(function (data) {
                  alert("Error in connection");
                });
            }
            else
            {
              alert("Wrong One Time Password. Please try again.");
              $scope.fields= {otp: ""};
            }
          }
          else
          {
            alert("Please fill in all fields.");
          }

        }
        else
        {
          alert("Please fill in all fields.");
        }
      }
    });
