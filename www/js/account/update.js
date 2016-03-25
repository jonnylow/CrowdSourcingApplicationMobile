angular.module('crowdsourcing')

    .controller('updateAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicLoading, apiUrl) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.email = window.localStorage.getItem("loginEmail");
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
            var tempCurrentPassword = fields.currentpassword;
            var tempNewPassword = fields.newpassword;
            var tempConfirmpassword = fields.confirmpassword;

            // to be use to port over to laraval login webservice
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
                                subTitle: '<br><h6 class="popups">Error in connection. Please try again.</h6> ',
                                scope: $scope,
                                buttons: [
                                  {
                                    text: 'OK',
                                    type: 'button button-stable',

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
