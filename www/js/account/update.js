/**
 * This js script will handle all logic for update. Its corresponding html file is update.html.
 * The main purpose of this page is just to handle input checks when user change its password
 */

angular.module('crowdsourcing')

    .controller('updateAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicLoading, apiUrl, $ionicHistory) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //depending with user is logged in
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.email = window.localStorage.getItem("loginEmail").toLowerCase();
        }
        else {
          $state.go('landingPage', {}, {reload: true});
        }

    if(window.localStorage.getItem("loginUserName") != null) {
      $scope.fields = {currentpassword: "", confirmpassword: "", newpassword: ""};
      $scope.update = function (fields) {
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

        if (fields != null) {
          if (fields.currentpassword != null && fields.currentpassword.trim() != "" && fields.newpassword != null && fields.newpassword.trim() != ""
            && fields.confirmpassword != null && fields.confirmpassword.trim() != "") {
            //get inputs from the input fields
            var tempCurrentPassword = fields.currentpassword;
            var tempNewPassword = fields.newpassword;
            var tempConfirmpassword = fields.confirmpassword;

            //use post when calling web service
            // to be use to port over to laraval login webservice to check if current password is correct
            var checkLoginObject = {email: $scope.email, password: tempCurrentPassword};

            var req =
            {
              method: 'POST',
              url: apiUrl + "authenticate",
              data: Object.toparams(checkLoginObject),
              headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }

            $http(req).
              success(function (data, status, headers, config) {
                /*If yes, do the relevant check to ensure that the rest pf the inputs fields are in the correct format before calling the webservice to change the password and
                update the password in the storage*/
                var status = data;
                if (status != null) {
                  if (status.token != null && status.error == null) {
                    window.localStorage.setItem("token", status.token);
                    if (tempConfirmpassword == tempNewPassword) {
                      if (tempCurrentPassword != tempNewPassword) {
                        if (validatePassword(tempNewPassword) == true) {
                          var urlString = apiUrl + "updateUserAccount?id=" + $scope.id + "&password=" + tempNewPassword;

                          $http.get(urlString, {timeout: 12000})
                            .success(function (data) {
                              var status = data;
                              if (status != null) {
                                $scope.loadingshow = false;
                                $ionicLoading.hide();

                                if (window.localStorage.getItem("loginPasswordToStore") != null) {
                                  window.localStorage.setItem("loginPasswordToStore", tempNewPassword);
                                }

                                var alertPopup = $ionicPopup.alert({
                                  title: "<h6 class='popups title'>Success</h6>'",
                                  subTitle: "<h6 class='popups'>Your password has been successfully changed.</h6>",
                                  scope: $scope,
                                  buttons: [
                                    {
                                      text: 'OK',
                                      type: 'button button-stable',
                                      onTap: function (e) {
                                        $scope.fields = {currentpassword: "", confirmpassword: "", newpassword: ""};
                                        $state.go('me', {}, {reload: true});
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

                          var alertPopup = $ionicPopup.alert({
                            title: '<h6 class="popups title">Whoops!</h6>',
                            subTitle: '<br><h6 class="popups withdraw">New password should consist of at least 6 characters with numbers and alphabets</h6> ',
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
                      else {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                          title: '<h6 class="popups title">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Old password & new password are the same</h6> ',
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
                    else {
                      $scope.loadingshow = false;
                      $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                        title: '<h6 class="popups title">Whoops!</h6>',
                        subTitle: '<br><h6 class="popups">New password & confirm password do not match</h6> ',
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
                  else {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title error">Whoops!</h6>',
                      subTitle: '<br><h6 class="popups">Current Password is not correct</h6>',
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
              }).
              error(function (data, status, headers, config) {
                //error
                console.log("error: " + status);
              });
          }
          else {
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
        else {
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

      //for POST parameters
      Object.toparams = function ObjecttoParams(obj) {
        var p = [];
        for (var key in obj) {
          p.push(key + '=' + encodeURIComponent(obj[key]));
        }
        return p.join('&');
      };

      function validatePassword(password) {
        var re = /(?=.*\d)(?=.*[A-z]).{6,20}/;
        return re.test(password);
      }
    }
    });
