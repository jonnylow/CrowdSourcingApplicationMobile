angular.module('crowdsourcing')

    .controller('updateAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.nric = window.localStorage.getItem("userNRIC");

        $scope.update = function(fields)
        {
          if(fields != null) {
            if (fields.currentpassword != null && fields.currentpassword.trim() != "" && fields.newpassword != null && fields.newpassword.trim() != ""
              && fields.confirmpassword!= null && fields.confirmpassword.trim() != "")
            {
              var tempCurrentPassword = fields.currentpassword;
              var tempNewPassword = fields.newpassword;
              var tempConfirmpassword = fields.confirmpassword;

              if(tempCurrentPassword == window.localStorage.getItem("password"))
              {
                if(tempConfirmpassword == tempNewPassword)
                {
                  var urlString = "http://localhost/AddUserAccount.php?nric="+$scope.nric+"&password="+tempNewPassword;

                  $http.get(urlString)
                    .success(function (data) {
                      var status = data;
                      if (status != null) {
                        var alertPopup = $ionicPopup.alert({
                          title: 'Status',
                          template: status.status[0]
                        });
                        window.localStorage.setItem("password", tempNewPassword);
                        $state.go('viewAccount', {}, {reload: true});
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


              /*
              if(tempNewPassword == tempConfirmpassword) {
                  var urlString = "http://localhost/AddUserAccount.php?nric="+tempNRIC+"&firstname="+tempFirstname+"&lastname="+tempLastname+"&contactnumber="+tempContactnumber+"&address="+tempAddress+"&password="+tempPassword+"&dob=1992-12-02&score=2&photo=www.google.com";

                  $http.get(urlString)
                    .success(function (data) {
                      var status = data;
                      if (status != null) {
                        var alertPopup = $ionicPopup.alert({
                          title: 'Status',
                          template: status.status[0]
                        });
                        $state.go('login', {}, {reload: true});
                      }
                    })

                    .error(function (data) {
                      alert("Error in connection");
                    });
              }
              else
              {
                alert("Passwords does not match. Please try again.");
              }*/
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
