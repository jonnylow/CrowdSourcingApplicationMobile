/**
 * This js script will handle all logic for creation of a new account. Its corresponding html file is verify.html.
 * The main purpose of this page is just to handle input checks, OTP management and creation of new user account.
 */
angular.module('crowdsourcing')

    .controller('verifyController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicHistory, $ionicLoading, $ionicHistory,apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //get relevant data needed from storage before removing inforamtion from the storage
    $scope.tempName = window.localStorage.getItem("tempName");
    $scope.tempEmail = window.localStorage.getItem("tempEmail").toLowerCase();
    $scope.tempPassword = window.localStorage.getItem("tempPassword");
    $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
    $scope.tempDOB = window.localStorage.getItem("tempDOB");
    $scope.tempGender = window.localStorage.getItem("tempGender");
    $scope.tempHaveCar = window.localStorage.getItem("tempHaveCar");
    $scope.tempOccupation = window.localStorage.getItem("tempOccupation");
    $scope.tempPreferences1 = window.localStorage.getItem("tempPreferences1");
    $scope.tempPreferences2 = window.localStorage.getItem("tempPreferences2");

    $scope.fields= {otp: ""};
    var otpCheck;

    //create and send OTP using web service
    var myPopup = $ionicPopup.show({
      title: '<h6 class="popups title">Notice</h6>',
      subTitle: '<br><h6 class="popups registration">The one-time password will be sent to you via sms</h6>',
      scope: $scope,
      buttons: [
        {
          text: 'OK',
          type: 'button button-stable',
          onTap: function(e) {
            //=========uncomment bottom line if do not want to use OTP========//
            //otpCheck = "123";

            //=========comment this few lines if do not want to use OTP========//

            otpCheck = Math.floor(Math.random()*90000) + 10000;
            var sendURL = apiUrl + "sendSMS?message="+otpCheck+"&number=+65"+$scope.tempContactNumber;
            $scope.loadingshow = true;
            $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Sending OTP...'})
            $http.get(sendURL,{timeout: 12000})
              .success(function (data) {
                //message sent
                var status = data;
                $scope.loadingshow = false;
                $ionicLoading.hide();
              })
            //=========comment this few lines if do not want to use OTP=========//
          }
        },
      ]
    });

      //this function is called when user click on the button after keying in the otp.
      //it will check the otp information is correct, before using the details retrieve from the storage and calling the web service to create the account
      //it will then direct the user back to the login page after creation.
      $scope.verify = function(fields)
      {
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Verifying OTP...'})
        if(fields != null) {


          if (fields.otp!= null && fields.otp.trim() != "")
          {
            $http.get(apiUrl+"checkEmail?email=" + $scope.tempEmail)
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
                    window.localStorage.removeItem("tempGender");
                    window.localStorage.removeItem("tempHaveCar");
                    window.localStorage.removeItem("tempOccupation");
                    window.localStorage.removeItem("tempPreferences1");
                    window.localStorage.removeItem("tempPreferences2");


                    var urlString = apiUrl+"addUserAccount?phone=" + $scope.tempContactNumber + "&name=" + $scope.tempName + "&email=" + $scope.tempEmail + "&password=" + $scope.tempPassword + "&dob=" + $scope.tempDOB
                      + "&gender=" + $scope.tempGender + "&haveCar=" + $scope.tempHaveCar + "&preferences1=" + $scope.tempPreferences1
                      + "&preferences2=" + $scope.tempPreferences2 + "&occupation=" + $scope.tempOccupation + "&rank=4";

                    $http.get(urlString,{timeout: 12000})
                      .success(function (data) {

                        var status = data;
                        if (status != null) {
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                            title: '<h6 class="popups title">Completed!</h6>',
                            subTitle: '<br><h6 class="popups long">Your particulars are sent for approval to Centre for Seniors. We will shortly get back to you</h6>',
                            scope: $scope,
                            buttons: [
                              {
                                text: 'OK',
                                type: 'button button-stable',
                                onTap: function (e) {
                                  $ionicHistory.clearCache();
                                  $ionicHistory.clearHistory();
                                  $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
                                  $state.go('landingPage', {}, {reload: true});
                                }
                              },
                            ]
                          });
                        }
                      })
                      .error(function (data) {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                          title: '<h6 class="popups title">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
                          scope: $scope,
                          buttons: [
                            {
                              text: 'OK',
                              type: 'button button-stable',
                              onTap: function (e) {
                                if ($scope.backView != null) {
                                  $scope.backView.go();
                                }
                                else {
                                  $state.go('landingPage', {}, {reload: true});
                                }
                              }
                            },
                          ]
                        });
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
                          text: 'OK',
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
                        text: 'OK',
                        type: 'button button-stable',

                      },
                    ]
                  });
                }
            })
              .error(function (data) {
                $scope.loadingshow = false;
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
                  scope: $scope,
                  buttons: [
                    {
                      text: 'OK',
                      type: 'button button-stable',
                      onTap: function (e) {
                        if ($scope.backView != null) {
                          $scope.backView.go();
                        }
                        else {
                          $state.go('landingPage', {}, {reload: true});
                        }
                      }
                    },
                  ]
                });
              });
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
                  text: 'OK',
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
                text: 'OK',
                type: 'button button-stable',

              },
            ]
          });
        }
      }

      //This method is for the resend password function. It will be called when user pressed the resend password button.
      $scope.resend = function()
      {
        var confirmPopup = $ionicPopup.confirm({
          title: "<h6 class='popups title'>Resend OTP</h6>",
          subTitle: "<h6 class='popups body'>Are you sure you want us to resend the one-time password?</h6>",
          cancelType: 'button button-stable activity1',
          okType: 'button button-stable activity2'
        });

        confirmPopup.then(function (res) {
          if (res) {
            var myPopup = $ionicPopup.show({
              title: '<h6 class="popups title">Success!</h6>',
              subTitle: '<h6 class="popups status">The one-time password will be resent to you via SMS.</h6>',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button button-stable',
                  onTap: function(e) {
                    //=========comment this few lines if do not want to use OTP========//
                    otpCheck = Math.floor(Math.random()*90000) + 10000;
                    var sendURL = apiUrl + "sendSMS?message="+otpCheck+"&number=+65"+$scope.tempContactNumber;
                    $scope.loadingshow = true;
                    $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Sending OTP...'})
                    $http.get(sendURL,{timeout: 12000})
                      .success(function (data) {
                        //message sent
                        var status = data;
                        $scope.loadingshow = false;
                        $ionicLoading.hide();
                      })
                    //=========comment this few lines if do not want to use OTP=========//
                  }
                },
              ]
            });
          }
        });
      }

    //this method will be activated when user click on the 'x' button. It will delete current registration details from the storage
    $scope.landingPage = function () {
      window.localStorage.removeItem("tempName");
      window.localStorage.removeItem("tempEmail");
      window.localStorage.removeItem("tempPassword");
      window.localStorage.removeItem("tempContactnumber");
      window.localStorage.removeItem("tempDOB");
      window.localStorage.removeItem("tempGender");
      window.localStorage.removeItem("tempHaveCar");
      window.localStorage.removeItem("tempOccupation");
      window.localStorage.removeItem("tempPreferences1");
      window.localStorage.removeItem("tempPreferences2");

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
