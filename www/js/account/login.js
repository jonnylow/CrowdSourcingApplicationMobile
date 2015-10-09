angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http) {
      $scope.login = function(fields){
          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
                var tempNRIC = fields.email;
                var tempPassword = fields.password;

              $http.get("http://www.changhuapeng.com/volunteer/php/CheckLogin.php?email="+tempNRIC+"&password="+tempPassword)
                .success(function (data) {
                  var status = data;

                  if (status != null) {
                    if(status.status[0] == "true")
                    {
                      $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveUserAccounts.php?email="+tempNRIC)
                        .success(function (data) {
                          var loginDetails = data;

                          if (loginDetails != null) {
                            if(loginDetails[0].is_approved != 'f') {
                              window.localStorage.setItem("loginId", loginDetails[0].volunteer_id);
                              window.localStorage.setItem("loginUserName", loginDetails[0].name);
                              $state.go('tab.home', {}, {reload: true});
                            }
                            else {
                              var alertPopup = $ionicPopup.alert({
                                title: 'Sorry',
                                template: 'Your account has not been approve by Centre for Seniors yet. Please try another time. '
                              });
                            }
                          }
                        })

                        .error(function (data) {
                          alert("Error in connection");
                        });
                    }
                    else {

                      var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Incorrect Email or Password.'
                      });
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
