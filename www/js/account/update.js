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

        $scope.fields= {currentpassword: "",confirmpassword: "", newpassword:""};
        $scope.update = function(fields)
        {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          if(fields != null) {
            if (fields.currentpassword != null && fields.currentpassword.trim() != "" && fields.newpassword != null && fields.newpassword.trim() != ""
              && fields.confirmpassword!= null && fields.confirmpassword.trim() != "")
            {
              var tempCurrentPassword = fields.currentpassword;
              var tempNewPassword = fields.newpassword;
              var tempConfirmpassword = fields.confirmpassword;

              $http.get(apiUrl+"CheckLogin.php?email="+ $scope.email+"&password="+tempCurrentPassword)
                .success(function (data) {
                  var status = data;

                  if (status != null) {
                    if(status.status[0] == "true")
                    {
                      var urlString = apiUrl+"RetrieveUserDetails.php?id="+$scope.id;

                      $http.get(urlString)
                        .success(function (data) {
                          var userDetails = data;
                          if (userDetails != null) {
                              if(tempConfirmpassword == tempNewPassword)
                              {
                                if(tempCurrentPassword != tempNewPassword) {
                                  urlString = apiUrl+"UpdateUserAccount.php?id=" + $scope.id + "&password=" + tempNewPassword;

                                  $http.get(urlString)
                                    .success(function (data) {
                                      var status = data;
                                      if (status != null) {
                                        $scope.loadingshow = false;
                                        $ionicLoading.hide();

                                        var alertPopup = $ionicPopup.alert({
                                          //title: '<b>Status</b>',
                                          subTitle: "<h6 class='popups'>"+status.status[0]+"</h6>",
                                          scope: $scope,
                                          buttons: [
                                            {
                                              text: '<b>Ok</b>',
                                              type: 'button button-energized',
                                              onTap: function (e) {
                                                window.localStorage.setItem("loginUserPassword", tempNewPassword);
                                                $scope.fields = {currentpassword: "", confirmpassword: "", newpassword: ""};
                                                $state.go('tab.me', {}, {reload: true});
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
                                else
                                {
                                  $scope.loadingshow = false;
                                  $ionicLoading.hide();
                                  var alertPopup = $ionicPopup.alert({
                                    title: '<h6 class="popups title">Whoops!</h6>',
                                    subTitle: '<br><h6 class="popups">Old password & new password are the same</h6> ',
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
                                  subTitle: '<br><h6 class="popups">New password & confirm password do not match</h6> ',
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
                        subTitle: '<br><h6 class="popups">Current Password is not correct</h6>',
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
    });
