angular.module('crowdsourcing')

    .controller('verifyController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");

      $scope.fields= {otp: ""};

      $scope.verify = function(fields)
      {
        if(fields != null) {
          if (fields.otp!= null && fields.otp.trim() != "")
          {
            var tempOTP= fields.otp;
            if(tempOTP == "123") {
              $state.go('moreQuestions', {}, {reload: true});
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
