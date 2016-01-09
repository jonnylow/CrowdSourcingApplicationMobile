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

/* to be use to port over to laraval login webservice
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
                    console.log(data);
                  }).
                  error(function(data, status, headers, config)
                  {
                    //error
                    console.log(status);
                  });
*/

                $http.get(apiUrl+"CheckLogin.php?email="+tempNRIC+"&password="+tempPassword)
                  .success(function (data) {
                    var status = data;

                    if (status != null) {
                      if(status.status[0] == "true")
                      {
                        $http.get(apiUrl+"RetrieveUserAccounts.php?email="+tempNRIC)
                          .success(function (data) {
                            var loginDetails = data;

                            if (loginDetails != null) {
                              if(loginDetails[0].is_approved != 'f') {
                                $scope.loadingshow = false;
                                $ionicLoading.hide();
                                window.localStorage.setItem("loginId", loginDetails[0].volunteer_id);
                                window.localStorage.setItem("loginUserName", loginDetails[0].name);
                                window.localStorage.setItem("loginEmail", loginDetails[0].email);
                                $state.go('tab.home', {}, {reload: true});
                              }
                              else {
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
                          })

                          .error(function (data) {
                            alert("Error in connection");
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
                  })

                  .error(function (data) {
                    alert("Error in connection");
                  });
              }
              else {
                $scope.loadingshow = false;
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title error">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Email is not recognised. Please sign up first</h6>',
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
      $state.go('landingPage', {}, {reload: true});
      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {"direction": "down"}
        );
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
    });
