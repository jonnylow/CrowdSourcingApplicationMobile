/**
 * This js script will handle all logic for the Login. Its corresponding html file is login.html.
 * The main purpose of this page is just to supply methods for user to login to the application
 */
angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $ionicHistory, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //Check storage if user stored his credentials previously. If yes, then display it in the input
      $scope.remember= {checkBox:false};
      $scope.fields= {email:"", password:""};
      if(window.localStorage.getItem("loginUsernameToStore") != null && window.localStorage.getItem("loginPasswordToStore") != null
      && window.localStorage.getItem("loginUsernameToStore").trim() != "" && window.localStorage.getItem("loginPasswordToStore").trim() != "")
      {
        $scope.fields.email = window.localStorage.getItem("loginUsernameToStore");
        $scope.fields.password = window.localStorage.getItem("loginPasswordToStore");
        $scope.remember.checkBox = true;
      }

      //Login method
      $scope.login = function(fields){
          $scope.loadingshow = true;
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
              //get inputs from input fields
                var tempNRIC = fields.email.toLowerCase();
                var tempPassword = fields.password;

              //call web service to validate email
              if (validateEmail(tempNRIC) == true) {
                $http.get(apiUrl + "checkEmail?email=" + tempNRIC,{timeout: 12000})
                  .success(function (data) {

                //use POST web service to authenticate with the application
                    var status = data;
                    if (status.status[0] == "exist") {
                // to be use to port over to laraval login webservice
                var loginObject = { email: tempNRIC,password:tempPassword};

                var req =
                {
                  method: 'POST',
                  url: apiUrl+"authenticate",
                  data: Object.toparams(loginObject),
                  headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }

                //http call
                $http(req).
                  success(function(data, status, headers, config)
                  {
                    var status = data;
                    if(status != null){
                      if(status.token != null && status.error == null) //when login successfully
                      {
                        if(status.user.is_approved == "approved") {
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                          //store user credentials if checkbox is ticked
                          if($scope.remember.checkBox == true)
                          {
                            window.localStorage.setItem("loginUsernameToStore", tempNRIC);
                            window.localStorage.setItem("loginPasswordToStore", tempPassword);
                          }
                          else
                          {
                            window.localStorage.removeItem("loginUsernameToStore");
                            window.localStorage.removeItem("loginPasswordToStore");
                          }

                          //store some user information so that other functions can use
                          window.localStorage.setItem("token", status.token);
                          window.localStorage.setItem("loginId", status.user.volunteer_id);
                          window.localStorage.setItem("loginUserName", status.user.name);
                          window.localStorage.setItem("loginEmail", status.user.email);

                          //direct user to home page after login
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
                                text: 'OK',
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
                          title: '<h6 class="popups title error">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Email and password do not match</h6>',
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
                        subTitle: '<br><h6 class="popups">Email is not recognised. Please sign up first</h6>',
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
              else {
                $scope.loadingshow = false;
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title error">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Invalid email address</h6>',
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
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title error">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Please fill in all fields</h6>',
                scope: $scope,
                                  buttons: [
                                    {
                                      text: 'OK',
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
              subTitle: '<br><h6 class="popups">Please fill in all fields</h6>',
              scope: $scope,
                                  buttons: [
                                    {
                                      text: 'OK',
                                      type: 'button button-stable',

                                    },
                                  ]
            });
            $scope.loadingshow = false;
          }
        }

    //method to validate user email using regular expression
    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    //this method will be called when user click on the 'x' on the page
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

    //this method will be called when user click on the 'registration' tab to navigate user to the registration page
    $scope.goRegistration = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.registration');
    }

    //this method will be called when user click on forget password
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
