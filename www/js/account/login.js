angular.module('crowdsourcing')

    .controller('loginController', function ($scope, $ionicPopup, $state, $http) {
      $scope.login = function(fields){
        var loginDetails;

        $http.get("http://localhost/RetrieveUserAccounts.php")
          .success(function(data) {
            loginDetails = data;

            if(loginDetails != null)
            {

              for (var i = 0; i < loginDetails.length; i++)
              {
                console.log("NRIC: " + loginDetails[i].NRIC);
                console.log("Password: " + loginDetails[i].Password);
              }
            }
          })

          .error(function(data) {
            alert("ERROR");
          });


        //console.log(fields.nric);
        //console.log(fields.password);
        /*
          var alertPopup = $ionicPopup.alert({
            title: 'Success',
            template: 'weee'
          });*/
        }
    });
