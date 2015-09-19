angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http) {
      $scope.login = function(fields){
          if(fields != null) {
            if (fields.nric != null && fields.nric.trim() != "" && fields.password != null && fields.password.trim() != "")
            {
                var tempNRIC = fields.nric;
                var tempPassword = fields.password;

                $http.get("http://localhost/RetrieveUserAccounts.php")
                .success(function (data) {
                  var loginDetails = data;
                  var loginCheck = 0;

                  if (loginDetails != null) {
                    for (var i = 0; i < loginDetails.length; i++) {
                      if(tempNRIC == loginDetails[i].NRIC && tempPassword == loginDetails[i].Password)
                      {
                        loginCheck = 1;
                        var alertPopup = $ionicPopup.alert({
                          title: 'Success',
                          template: 'Successfully Login'
                        });
                        window.localStorage.setItem("userNRIC", tempNRIC);
                        $state.go('home', {}, {reload: true});
                      }
                    }

                    if(loginCheck == 0)
                    {
                      var alertPopup = $ionicPopup.alert({
                        title: 'Error',
                        template: 'Incorrect NRIC or Password.'
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
