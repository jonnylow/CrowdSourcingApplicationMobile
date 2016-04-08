/**
 * This js script will handle all logic for the LandingPage. Its corresponding html file is landingPage.html.
 * The main purpose of this page is just to provide navigation to login/register page and home page
 */

angular.module('crowdsourcing')

    .controller('manageAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //check if user is logged in using credentials stored in storage navigate to landing page if user is not login
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.fields= {email: "", name:"", carChecked:"",occupation:"", gender:"", dob:"", preferences_1:"", preferences_2:""};
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = $stateParams.id;
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        }
        else {
          $state.go('landingPage', {}, {reload: true});
        }

    if(window.localStorage.getItem("loginUserName") != null) {
      //call laravel web service to retrieve user details to show
      var urlString = apiUrl + "retrieveUserDetails?id=" + $scope.id;
      var currentEmail = "";
      //http call with 12s timeout
      $http.get(urlString, {timeout: 12000})
        .success(function (data) {
          var userDetails = data;
          //if valid
          if (userDetails != null) {
            //set details in the respective input fields
            var temp = userDetails.volunteer[0].date_of_birth.split(" ");
            $scope.fields.dob = new Date(temp[0]);
            $scope.fields.gender = userDetails.volunteer[0].gender;

            if (userDetails.volunteer[0].has_car == true) {
              $scope.fields.carChecked = "true";
            }
            else {
              $scope.fields.carChecked = "false";
            }
            $scope.fields.email = userDetails.volunteer[0].email;
            currentEmail = userDetails.volunteer[0].email;
            $scope.fields.name = userDetails.volunteer[0].name;
            $scope.fields.occupation = userDetails.volunteer[0].occupation;
            $scope.fields.preferences_1 = userDetails.volunteer[0].area_of_preference_1;
            $scope.fields.preferences_2 = userDetails.volunteer[0].area_of_preference_2;
            $scope.loadingshow = false;
            $ionicLoading.hide();
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

      //this method will handle the update button. It will be called when user clicked on it
      $scope.update = function (fields) {
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        if (fields != null) {
          if (fields.name != null && fields.name.trim() != "" && fields.email != null && fields.email.trim() != ""
            && fields.dob != null) {
            //get details from the input fields
            var name = fields.name;
            var p1 = fields.preferences_1;
            var p2 = fields.preferences_2;
            var gender = fields.gender;
            var tempDOB = fields.dob;

            //configure the dates field so that it can be displayed accordingly
            var dd = tempDOB.getDate();
            var mm = tempDOB.getMonth() + 1;
            var yyyy = tempDOB.getFullYear();
            if (dd < 10) {
              dd = '0' + dd
            }
            if (mm < 10) {
              mm = '0' + mm
            }
            var dob = yyyy + '-' + mm + '-' + dd;
            var occupation = fields.occupation;
            var hasCar = fields.carChecked;
            if (fields.carChecked == "false") {
              hasCar = "0";
            }
            else {
              hasCar = "1";
            }

            var email = fields.email.toLowerCase();

            if (p1 == null) {
              p1 = '';
            }
            if (p2 == null) {
              p2 = '';
            }
            if (gender == null) {
              gender = '';
            }
            if (occupation == null) {
              occupation = '';
            }
            //check for validate email using the method
            if (validateEmail(email) == true) {
              if (occupation == "" || validateOccupation(occupation) == true) {

                if (validateDOBAge(fields.dob.getFullYear()) == true && validateDOB(tempDOB) == true) {
                  if (validateName(name) == true) {
                    if (p1 != '' || p2 != '') { //ensure that the preferences are not the same
                      if (p1 != p2) {
                        //check if user is changing his current email. If he is, there is different check to be done because email must be validated with the database
                        if (email == currentEmail) {

                          //http web service call
                          urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

                          $http.get(urlStringUpdate, {timeout: 12000})
                            .success(function (data) {
                              var status = data;
                              if (status != null) {
                                $scope.loadingshow = false;
                                $ionicLoading.hide();
                                var alertPopup = $ionicPopup.alert({
                                  title: '<h6 class="popups title"> ' + status.status[0]  + "</h6>",
                                  subTitle: '<br><h6 class="popups">Your account has been successfully changed</h6>',
                                  scope: $scope,
                                  buttons: [
                                    {
                                      text: 'OK',
                                      type: 'button button-stable',
                                      onTap: function (e) {
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
                          if (email != null && email.trim() != "")
                          {
                            //if changing email, have to check new email with the emails in the database
                            $http.get(apiUrl + "checkEmail?email=" + email, {timeout: 12000})
                              .success(function (data) {

                                var status = data;
                                if (status.status[0] != "exist") {
                                  urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

                                  $http.get(urlStringUpdate, {timeout: 12000})
                                    .success(function (data) {
                                      var status = data;
                                      if (status != null) {
                                        $scope.loadingshow = false;
                                        $ionicLoading.hide();
                                        if (window.localStorage.getItem("loginUsernameToStore") != null) {
                                          window.localStorage.setItem("loginUsernameToStore", email);
                                        }

                                        var alertPopup = $ionicPopup.alert({
                                          title: '<h6 class="popups title"> ' + status.status[0]  + "</h6>",
                                          subTitle: '<br><h6 class="popups">Your account has been successfully changed</h6>',
                                          scope: $scope,
                                          buttons: [
                                            {
                                              text: 'OK',
                                              type: 'button button-stable',
                                              onTap: function (e) {
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
                      }
                      }
                      else {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();

                        var alertPopup = $ionicPopup.alert({
                          title: '<h6 class="popups title">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Please choose different area of preferences.</h6> ',
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
                      if (email == currentEmail) {
                        urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

                        $http.get(urlStringUpdate, {timeout: 12000})
                          .success(function (data) {
                            var status = data;
                            if (status != null) {
                              $scope.loadingshow = false;
                              $ionicLoading.hide();
                              var alertPopup = $ionicPopup.alert({
                                title: '<h6 class="popups title"> ' + status.status[0]  + "</h6>",
                                subTitle: '<br><h6 class="popups">Your account has been successfully changed</h6>',
                                scope: $scope,
                                buttons: [
                                  {
                                    text: 'OK',
                                    type: 'button button-stable',
                                    onTap: function (e) {
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
                      else { //if preferences are not empty, it will enter this loop
                        $http.get(apiUrl + "checkEmail?email=" + email, {timeout: 12000})
                          .success(function (data) {

                            var status = data;
                            if (status.status[0] != "exist") {
                              urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

                              $http.get(urlStringUpdate, {timeout: 12000})
                                .success(function (data) {
                                  var status = data;
                                  if (status != null) {
                                    $scope.loadingshow = false;
                                    $ionicLoading.hide();
                                    if (window.localStorage.getItem("loginUsernameToStore") != null) {
                                      window.localStorage.setItem("loginUsernameToStore", email);
                                    }

                                    var alertPopup = $ionicPopup.alert({
                                      title: '<h6 class="popups title"> ' + status.status[0]  + "</h6>",
                                      subTitle: '<br><h6 class="popups">Your account has been successfully changed</h6>',
                                      scope: $scope,
                                      buttons: [
                                        {
                                          text: 'OK',
                                          type: 'button button-stable',
                                          onTap: function (e) {
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
                    }
                  }
                  else {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Whoops!</h6>',
                      subTitle: '<br><h6 class="popups">Name should consist of alphabetical letters only</h6> ',
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
                    subTitle: '<br><h6 class="popups dob">Date of Birth cannot be larger than the current date or volunteers of CareGuide are required to be between 16 to 70 years old</h6> ',
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
                  subTitle: '<br><h6 class="popups">Occupation should consist of alphabetical letters only</h6> ',
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
                subTitle: '<br><h6 class="popups">Invalid email address</h6> ',
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
              subTitle: '<br><h6 class="popups">Please fill in all required fields</h6> ',
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
            subTitle: '<br><h6 class="popups">Please fill in all required fields</h6> ',
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

      //method to validate occupation
      function validateOccupation(occupation) {
        return /^[a-zA-Z\s]+$/.test(occupation);
      }

      //method to validate email
      function validateEmail(email) {
        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(email);
      }

      //method to validate name
      function validateName(name) {
        return /^[a-zA-Z\s]+$/.test(name);
      }

      //method to validate DOB
      function validateDOB(tempDOB) {
        if (tempDOB > new Date()) {
          //larger
          return false;
        }
        else {
          //ok
          return true;
        }
      }

      //method to check that user dob is within a certain year
      function validateDOBAge(year) {
        var currentDate = new Date();
        if (currentDate.getFullYear() - year >= 16 && currentDate.getFullYear() - year <= 70) {
          return true;
        }
        else {
          return false;
        }
      }

      $scope.back = function () {
        $ionicHistory.goBack();
      }
    }
    });
