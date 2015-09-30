angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http) {
      $scope.login = function(fields){
          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
                var tempNRIC = fields.email;
                var tempPassword = fields.password;

                $http.get("http://localhost/RetrieveUserAccounts.php")
                .success(function (data) {
                  var loginDetails = data;
                  var loginCheck = 0;

                  if (loginDetails != null) {
                    for (var i = 0; i < loginDetails.length; i++) {
                      if(tempNRIC == loginDetails[i].Email && tempPassword == loginDetails[i].Password)
                      {
                        loginCheck = 1;
                        var alertPopup = $ionicPopup.alert({
                          title: 'Success',
                          template: 'Successfully Login'
                        });

                        window.localStorage.setItem("loginUserName", loginDetails[i].Name);
                        window.localStorage.setItem("loginUserEmail", loginDetails[i].Email);
                        window.localStorage.setItem("loginUserPassword", loginDetails[i].Password);
                        window.localStorage.setItem("loginUserContactNumber", loginDetails[i].Phone);
                        window.localStorage.setItem("loginUserDOB", loginDetails[i].DOB);

                        $state.go('tab.home', {}, {reload: true});
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
