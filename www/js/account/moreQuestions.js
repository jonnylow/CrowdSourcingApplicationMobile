angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");
    $scope.tempNRIC = window.localStorage.getItem("tempNRIC");
    $scope.tempGender = window.localStorage.getItem("tempGender");
    $scope.tempFrontIC = window.localStorage.getItem("tempFrontIC");
    $scope.tempBackIC = window.localStorage.getItem("tempBackIC");

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

            window.localStorage.removeItem("tempName");
            window.localStorage.removeItem("tempEmail");
            window.localStorage.removeItem("tempPassword");
            window.localStorage.removeItem("tempContactnumber");
            window.localStorage.removeItem("tempDOB");
            window.localStorage.removeItem("tempNRIC");
            window.localStorage.removeItem("tempGender");
            window.localStorage.removeItem("tempFrontIC");
            window.localStorage.removeItem("tempBackIC");

            var urlString = "http://localhost/AddUserAccount.php?phone="+$scope.tempContactNumber+"&name="+$scope.tempName+"&email="+$scope.tempEmail+"&password="+$scope.tempPassword+"&dob="+$scope.tempDOB
              +"&nric="+$scope.tempNRIC+"&gender="+$scope.tempGender+"&frontIC="+$scope.tempFrontIC + "&backIC="+$scope.tempBackIC+"&haveCar="+$scope.tempCarChecked+"&preferences1="+fields.preferences_1
              +"&preferences2="+fields.preferences_2+"&occupation="+fields.occupation;


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
            alert("Please fill in all fields.");
          }
        }
        else
        {
          alert("Please fill in all fields.");
        }
      }
    });
