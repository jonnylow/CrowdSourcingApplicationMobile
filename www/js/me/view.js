angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $ionicHistory, $timeout, $ionicLoading, apiUrl) {
      if(window.localStorage.getItem("loginUserName") != null) {
        $scope.name = window.localStorage.getItem("loginUserName");
        $scope.id = window.localStorage.getItem("loginId");
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
      }
      else {
        var myPopup = $ionicPopup.show({
          title: '<h6 class="popups title">Who are you?</h6>',
          subTitle: '<br><h6 class="popups">Login to access this content</h6>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button button-stable',
              onTap: function(e) {
                $state.go('landingPage', {}, {reload: true});
              }
            },
          ]
        });
      }

    var urlString = apiUrl+"RetrieveUserDetails.php?id="+$scope.id;

    $http.get(urlString)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null && userDetails.length!=0 ) {
          $scope.username = userDetails[0].name;
          $scope.nric=userDetails[0].nric;
          $scope.email =userDetails[0].email;
          $scope.gender=userDetails[0].gender;
          $scope.dob=userDetails[0].date_of_birth;
          $scope.contactnumber=userDetails[0].contact_no;
          $scope.occuption=userDetails[0].occupation;
          $scope.preference1=userDetails[0].area_of_preference_1;
          $scope.preference2=userDetails[0].area_of_preference_2;
          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      })

      .error(function (data) {
        alert("Error in connection");
      });

      $scope.manageAccount = function()
      {
        $state.go('manageAccount', {id: $scope.id});
      }
    });
