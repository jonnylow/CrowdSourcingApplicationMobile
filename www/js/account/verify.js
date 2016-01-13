angular.module('crowdsourcing')

    .controller('verifyController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicHistory, $ionicLoading, $ionicHistory,apiUrl) {
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

    /*var myPopup = $ionicPopup.show({
      title: '<b>Notice</b>',
      subTitle: '<br>The one-time password will be send to you via sms',
      scope: $scope,
      buttons: [
        {
          text: '<b>Ok</b>',
          type: 'button-calm'
        },
      ]
    });*/

    //=========uncomment bottom line if do not want to use OTP========//
    otpCheck = "123";
    /*
     //=========comment this few lines if do not want to use OTP========//
     otpCheck = Math.floor(Math.random()*90000) + 10000;
     var sendURL = "http://www.changhuapeng.com/volunteer/php/sendSMS/send.php?message="+otpCheck+"&number=+65"+$scope.tempContactNumber;
    $scope.loadingshow = true;
     $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    $http.get(sendURL)
      .success(function (data) {
        //message sent
        var status = data;
        $scope.loadingshow = false;
        $ionicLoading.hide();
      })*/
     //=========comment this few lines if do not want to use OTP=========//

      $scope.verify = function(fields)
      {
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        if(fields != null) {


          if (fields.otp!= null && fields.otp.trim() != "")
          {
            $http.get("http://changhuapeng.com/laravel/api/checkEmail?email=" + $scope.tempEmail)
              .success(function (data) {

                var status = data;
                if (status.status[0] != "exist") {
                  var tempOTP = fields.otp;
                  if (tempOTP == otpCheck) {
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
                    window.localStorage.removeItem("front");
                    window.localStorage.removeItem("back");

                    var urlString = "http://changhuapeng.com/laravel/api/addUserAccount?phone=" + $scope.tempContactNumber + "&name=" + $scope.tempName + "&email=" + $scope.tempEmail + "&password=" + $scope.tempPassword + "&dob=" + $scope.tempDOB
                      + "&nric=" + $scope.tempNRIC + "&gender=" + $scope.tempGender + "&frontIC=" + $scope.tempFrontIC + "&backIC=" + $scope.tempBackIC + "&haveCar=" + $scope.tempHaveCar + "&preferences1=" + $scope.tempPreferences1
                      + "&preferences2=" + $scope.tempPreferences2 + "&occupation=" + $scope.tempOccupation + "&rank=4";

                    $http.get(urlString)
                      .success(function (data) {

                        var status = data;
                        if (status != null) {
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                            title: '<h6 class="popups title">Completed!</h6>',
                            subTitle: '<br><h6 class="popups">Your particulars is sent for approval to Centre for Seniors. We will shortly get back to you</h6>',
                            scope: $scope,
                            buttons: [
                              {
                                text: '<b>Ok</b>',
                                type: 'button button-stable',
                                onTap: function (e) {
                                  $ionicHistory.clearCache();
                                  $ionicHistory.clearHistory();
                                  $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                                  $state.go('login', {}, {reload: true});
                                }
                              },
                            ]
                          });
                        }
                      })

                      .error(function (data) {
                        alert("Error in connection");
                      });
                  }
                  else {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    $scope.fields = {otp: ""};

                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Whoops!</h6>',
                      subTitle: '<br><h6 class="popups">One-Time Password is incorrect</h6> ',
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
                else
                {
                  $scope.loadingshow = false;
                  $ionicLoading.hide();

                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Whoops!</h6>',
                    subTitle: '<br><h6 class="popups">Email address has been registered</h6> ',
                    scope: $scope,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button button-stable',

                      },
                    ]
                  });
                }
            })
          }
          else
          {
            $scope.loadingshow = false;
            $ionicLoading.hide();

            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title">Whoops!</h6>',
              subTitle: '<br><h6 class="popups">Please fill in all fields</h6> ',
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
        else
        {
          $scope.loadingshow = false;
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Please fill in all fields</h6> ',
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

      $scope.resend = function()
      {
        /*
        //=========comment this few lines if do not want to use OTP========//
        otpCheck = Math.floor(Math.random()*90000) + 10000;
        var sendURL = "http://www.changhuapeng.com/volunteer/php/sendSMS/send.php?message="+otpCheck+"&number=+65"+$scope.tempContactNumber;
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        $http.get(sendURL)
          .success(function (data) {
            //message sent
            var status = data;
            $scope.loadingshow = false;
            $ionicLoading.hide();
          })*/
        //=========comment this few lines if do not want to use OTP=========//

        var myPopup = $ionicPopup.show({
          title: '<h6 class="popups">The one-time password has been resent to you via SMS</h6>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button button-stable'
            },
          ]
        });
      }

    $scope.landingPage = function () {
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
      window.localStorage.removeItem("front");
      window.localStorage.removeItem("back");

      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});

      $state.go('landingPage', {}, {reload: true});
      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {"direction": "down"}
        );
      }
    }
    });
