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


    $http.get("http://changhuapeng.com/laravel/api/retrieveUserDetails?id="+$scope.id)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null && userDetails.length!=0 ) {
          $scope.username = userDetails.volunteer.name;
          $scope.nric=userDetails.volunteer.nric;
          $scope.email =userDetails.volunteer.email;
          $scope.gender=userDetails.volunteer.gender;
          $scope.dob=userDetails.volunteer.date_of_birth;
          $scope.contactnumber=userDetails.volunteer.contact_no;
          $scope.occuption=userDetails.volunteer.occupation;
          $scope.preference1=userDetails.volunteer.area_of_preference_1;
          $scope.preference2=userDetails.volunteer.area_of_preference_2;
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
