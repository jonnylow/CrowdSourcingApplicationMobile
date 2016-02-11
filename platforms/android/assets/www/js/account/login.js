angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $ionicHistory, apiUrl) {
      $scope.login = function(fields){
          $scope.loadingshow = true;
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
                var tempNRIC = fields.email;
                var tempPassword = fields.password;

              if (validateEmail(tempNRIC) == true) {

                // to be use to port over to laraval login webservice
                var loginObject = { email: tempNRIC,password:tempPassword};

                var req =
                {
                  method: 'POST',
                  url: "http://changhuapeng.com/laravel/api/authenticate",
                  data: Object.toparams(loginObject),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }

                $http(req).
                  success(function(data, status, headers, config)
                  {
                    var status = data;
                    if(status != null){
                      if(status.token != null && status.error == null)
                      {
                        if(status.user.is_approved == "approved") {
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          window.localStorage.setItem("token", status.token);
                          window.localStorage.setItem("loginId", status.user.volunteer_id);
                          window.localStorage.setItem("loginUserName", status.user.name);
                          window.localStorage.setItem("loginEmail", status.user.email);
                          $state.go('tab.home', {}, {reload: true});
                        }
                        else if(status.user.is_approved == "rejected"){
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                            title: '<h6 class="popups title">Sorry!</h6>',
                            subTitle: '<br><h6 class="popups">Your account has been rejected. Please contact Henderson Home.</h6> ',
                            scope: $scope,
                            buttons: [
                              {
                                text: '<b>Ok</b>',
                                type: 'button button-stable',

                              },
                            ]
                          });
                        }
                        else if(status.user.is_approved == "pending"){
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          var alertPopup = $ionicPopup.alert({
                            title: '<h6 class="popups title">Hello Newcomer!</h6>',
                            subTitle: '<br><h6 class="popups">Your account is currently under approval by Centre for Seniors. Please come back in 2 to 5 working days</h6> ',
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
                          title: '<h6 class="popups title error">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Email and password do not match</h6>',
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
                  }).
                  error(function(data, status, headers, config)
                  {
                    //error
                    console.log("error: " + status);
                  });
              }
              else {
                $scope.loadingshow = false;
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title error">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Email and password do not match</h6>',
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
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title error">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Username & Password cannot be blank</h6>',
                scope: $scope,
                                  buttons: [
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'button button-stable',

                                    },
                                  ]
              });
              $scope.loadingshow = false;
            }

          }
          else
          {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title error">Whoops!</h6>',
              subTitle: '<br><h6 class="popups">Username & Password cannot be blank</h6>',
              scope: $scope,
                                  buttons: [
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'button button-stable',

                                    },
                                  ]
            });
            $scope.loadingshow = false;
          }
        }

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    $scope.landingPage = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });

      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {
            'href': '#/landingPage',
            'direction': "down",
            'duration': 500,
            'iosdelay': 0 // the new property
          }
        );
      }
      else {
        $state.go('landingPage', {}, {reload: true});
      }
    }

    //for POST parameters
    Object.toparams = function ObjecttoParams(obj)
    {
      var p = [];
      for (var key in obj)
      {
        p.push(key + '=' + encodeURIComponent(obj[key]));
      }
      return p.join('&');
    };

    $scope.goRegistration = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.registration');
    }

    $scope.goReset = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });

      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {
            'href': '#/reset',
            'direction': "up",
            'duration': 500,
            'iosdelay': 0 // the new property
          }
        );
      }
      else {
        $state.go('resetPassword', {}, {reload: true});
      }
    }
    });
