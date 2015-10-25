angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");
    $scope.tempNRIC = window.localStorage.getItem("tempNRIC");
    $scope.tempGender = window.localStorage.getItem("tempGender");
    $scope.tempFrontIC = "frontIC";
    $scope.tempBackIC = "backIC";

      $scope.fields= {carChecked: false, occupation:""};

      $scope.verify = function(fields)
      {
        if(fields != null) {
          if (fields.occupation!= null && fields.occupation.trim() != "")
          {
            if(fields.carChecked == true) {
              $scope.tempCarChecked = 1;
            }
            else{
              $scope.tempCarChecked = 0;
            }

            window.localStorage.setItem("tempHaveCar", $scope.tempCarChecked);
            window.localStorage.setItem("tempOccupation", fields.occupation);
            window.localStorage.setItem("tempPreferences1", fields.preferences_1);
            window.localStorage.setItem("tempPreferences2", fields.preferences_2);

            $state.go('verify', {}, {reload: true});
          }
          else
          {
            alert("Please fill in all required fields.");
          }
        }
        else
        {
          alert("Please fill in all required fields.");
        }
      }
    });
