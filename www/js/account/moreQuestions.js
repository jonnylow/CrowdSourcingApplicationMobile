angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");

      $scope.fields= {carChecked: false, cprChecked:false};

      $scope.verify = function(fields)
      {
        if(fields != null) {
          if(fields.carChecked == true) {
            $scope.tempCarChecked = 1;
          }
          else{
            $scope.tempCarChecked = 0;
          }

          if(fields.cprChecked == true) {
            $scope.tempCPRChecked = 1;
          }
          else{
            $scope.tempCPRChecked = 0;
          }

          window.localStorage.removeItem("tempName");
          window.localStorage.removeItem("tempEmail");
          window.localStorage.removeItem("tempPassword");
          window.localStorage.removeItem("tempContactnumber");
          window.localStorage.removeItem("tempDOB");

          var urlString = "http://localhost/AddUserAccount.php?phone="+$scope.tempContactNumber+"&name="+$scope.tempName+"&email="+$scope.tempEmail+"&password="+$scope.tempPassword+"&dob="+$scope.tempDOB+"&haveCar="+$scope.tempCarChecked+"&knowCPR="+$scope.tempCPRChecked;

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
          alert("Please fill in all fields.");
        }
      }
    });
