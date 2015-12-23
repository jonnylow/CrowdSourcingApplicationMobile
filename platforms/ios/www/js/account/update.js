angular.module('crowdsourcing')

    .controller('updateAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
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
          if(fields != null) {
            if (fields.currentpassword != null && fields.currentpassword.trim() != "" && fields.newpassword != null && fields.newpassword.trim() != ""
              && fields.confirmpassword!= null && fields.confirmpassword.trim() != "")
            {
              var tempCurrentPassword = fields.currentpassword;
              var tempNewPassword = fields.newpassword;
              var tempConfirmpassword = fields.confirmpassword;

              $http.get("http://www.changhuapeng.com/volunteer/php/CheckLogin.php?email="+ $scope.email+"&password="+tempCurrentPassword)
                .success(function (data) {
                  var status = data;

                  if (status != null) {
                    if(status.status[0] == "true")
                    {
                      var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveUserDetails.php?id="+$scope.id;

                      $http.get(urlString)
                        .success(function (data) {
                          var userDetails = data;
                          if (userDetails != null) {
                              if(tempConfirmpassword == tempNewPassword)
                              {
                                if(tempCurrentPassword != tempNewPassword) {
                                  urlString = "http://www.changhuapeng.com/volunteer/php/UpdateUserAccount.php?id=" + $scope.id + "&password=" + tempNewPassword;

                                  $http.get(urlString)
                                    .success(function (data) {
                                      var status = data;
                                      if (status != null) {
                                        $scope.loadingshow = false;

                                        var alertPopup = $ionicPopup.alert({
                                          title: 'Status',
                                          template: status.status[0]
                                        });
                                        window.localStorage.setItem("loginUserPassword", tempNewPassword);
                                        $scope.fields = {currentpassword: "", confirmpassword: "", newpassword: ""};
                                        $state.go('tab.me', {}, {reload: true});
                                      }
                                    })

                                    .error(function (data) {
                                      alert("Error in connection");
                                    });
                                }
                                else
                                {
                                  $scope.loadingshow = false;
                                  alert("Old & New Password are the same. Please change a new password. ");
                                }
                              }
                              else
                              {
                                $scope.loadingshow = false;
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
                      var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Incorrect Current Password.'
                      });
                    }
                  }
                })
            }
            else
            {
              $scope.loadingshow = false;
              alert("Please fill in all fields.");
            }

          }
          else
          {
            $scope.loadingshow = false;
            alert("Please fill in all fields.");
          }
        }
    });
