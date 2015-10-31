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
    var otpCheck;

    var myPopup = $ionicPopup.show({
      title: 'Notice',
      subTitle: 'The one-time password will be send to you via sms',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-calm'
        },
      ]
    });

    //=========uncomment bottom line if do not want to use OTP========//
    //otpCheck = "123";

     //=========comment this few lines if do not want to use OTP========//
     otpCheck = Math.floor(Math.random()*90000) + 10000;
     var sendURL = "http://www.changhuapeng.com/volunteer/php/sendSMS/send.php?message="+otpCheck+"&number=+65"+$scope.tempContactNumber;
    $scope.loadingshow = true;
    $http.get(sendURL)
      .success(function (data) {
        //message sent
        var status = data;
        $scope.loadingshow = false;
      })
     //=========comment this few lines if do not want to use OTP=========//

      $scope.verify = function(fields)
      {
        $scope.loadingshow = true;
        if(fields != null) {
          if (fields.otp!= null && fields.otp.trim() != "")
          {
            var tempOTP= fields.otp;
            if(tempOTP == otpCheck) {
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
                    $scope.loadingshow = false;
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
              $scope.loadingshow = false;
              alert("Wrong One Time Password. Please try again.");
              $scope.fields= {otp: ""};
            }
          }
          else
          {
            $scope.loadingshow = false;
            alert("Please fill in all fields.");
          }

        }
        else
        {
          $scope.loadingshow = false;
          alert("Please fill in all fields.");
        }
      }

      $scope.resend = function()
      {
        var myPopup = $ionicPopup.show({
          title: 'Notice',
          subTitle: 'The one-time password will be send to you via sms',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button-calm'
            },
          ]
        });
      }
    });
