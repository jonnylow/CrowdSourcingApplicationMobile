angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http) {
      $scope.login = function(fields){
          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
                var tempNRIC = fields.email;
                var tempPassword = fields.password;

                $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveUserAccounts.php")
                .success(function (data) {
                  var loginDetails = data;
                  var loginCheck = 0;

                  if (loginDetails != null) {
                    for (var i = 0; i < loginDetails.length; i++) {
                      if(tempNRIC == loginDetails[i].email && tempPassword == loginDetails[i].password)
                      {
                        if(loginDetails[i].is_approved != 0) {
                          loginCheck = 1;

                          window.localStorage.setItem("loginId", loginDetails[i].volunteer_id);
                          window.localStorage.setItem("loginUserName", loginDetails[i].name);
                          $state.go('tab.home', {}, {reload: true});
                        }
                        else {
                          loginCheck = 1;
                          var alertPopup = $ionicPopup.alert({
                            title: 'Sorry',
                            template: 'Your account has not been approve by Centre for Seniors yet. Please try another time. '
                          });
                        }
                      }
                    }

                    if(loginCheck == 0)
                    {
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