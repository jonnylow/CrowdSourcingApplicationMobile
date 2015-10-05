angular.module('crowdsourcing')

    .controller('updateAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
        }
        else {
          $state.go('login', {}, {reload: true});
        }

        $scope.fields= {currentpassword: "",confirmpassword: "", newpassword:""};
        $scope.update = function(fields)
        {
          if(fields != null) {
            if (fields.currentpassword != null && fields.currentpassword.trim() != "" && fields.newpassword != null && fields.newpassword.trim() != ""
              && fields.confirmpassword!= null && fields.confirmpassword.trim() != "")
            {
              var tempCurrentPassword = fields.currentpassword;
              var tempNewPassword = fields.newpassword;
              var tempConfirmpassword = fields.confirmpassword;

              var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveUserDetails.php?id="+$scope.id;

              $http.get(urlString)
                .success(function (data) {
                  var userDetails = data;
                  if (userDetails != null) {
                    if(tempCurrentPassword == userDetails[0].password)
                    {
                      if(tempConfirmpassword == tempNewPassword)
                      {
                        urlString = "http://www.changhuapeng.com/volunteer/php/UpdateUserAccount.php?id="+$scope.id+"&password="+tempNewPassword;

                        $http.get(urlString)
                          .success(function (data) {
                            var status = data;
                            if (status != null) {
                              var alertPopup = $ionicPopup.alert({
                                title: 'Status',
                                template: status.status[0]
                              });
                              window.localStorage.setItem("loginUserPassword", tempNewPassword);
                              $scope.fields= {currentpassword: "",confirmpassword: "", newpassword:""};
                              $state.go('tab.me', {}, {reload: true});
                            }
                          })

                          .error(function (data) {
                            alert("Error in connection");
                          });
                      }
                      else
                      {
                        alert("Passwords does not match. Please try again.");
                      }
                    }
                    else
                    {
                      alert("Incorrect current password entered. Please try again. ");
                    }
                  }
                })

                .error(function (data) {
                  alert("Error in connection");
                });
            }
            else
            {
              alert("Please fill in all fields.");
            }

          }
          else
          {
            alert("Please fill in all fields.");
          }
        }
    });
