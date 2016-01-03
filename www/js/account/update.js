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
                                          title: '<b>Status</b>',
                                          subTitle: status.status[0],
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
                                  alert("Old & New Password are the same. Please change a new password. ");
                                }
                              }
                              else
                              {
                                $scope.loadingshow = false;
                                $ionicLoading.hide();
                                alert("Passwords do not match. Please try again.");
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
                        title: '<b>Error</b>',
                        subTitle: '<br><h3 class="popups">Incorrect Current Password.</h3>',
                        scope: $scope,
                                  buttons: [
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'button button-energized',

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
              alert("Please fill in all fields.");
            }

          }
          else
          {
            $scope.loadingshow = false;
            $ionicLoading.hide();
            alert("Please fill in all fields.");
          }
        }
    });
