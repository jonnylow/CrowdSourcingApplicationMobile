angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      if(window.localStorage.getItem("loginUserName") != null) {
        $scope.name = window.localStorage.getItem("loginUserName");
        $scope.id = window.localStorage.getItem("loginId");
      }
      else {
        var myPopup = $ionicPopup.show({
          title: 'Notice',
          subTitle: 'You must login first',
          scope: $scope,
          buttons: [
            {
              text: 'Cancel',
              onTap: function(e) {
                $state.go('tab.home', {}, {reload: true});
              }},
            {
              text: '<b>Ok</b>',
              type: 'button-calm',
              onTap: function(e) {
                $state.go('login', {}, {reload: true});
              }
            },
          ]
        });
      }

    var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveUserDetails.php?id="+$scope.id;

    $http.get(urlString)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null) {
          $scope.username = userDetails[0].name;
          $scope.nric=userDetails[0].nric;
          $scope.email =userDetails[0].email;
          $scope.gender=userDetails[0].gender;
          $scope.dob=userDetails[0].date_of_birth;
          $scope.contactnumber=userDetails[0].contact_no;
          $scope.occuption=userDetails[0].occupation;
          $scope.preference1=userDetails[0].area_of_preference_1;
          $scope.preference2=userDetails[0].area_of_preference_2;
        }
      })

      .error(function (data) {
        alert("Error in connection");
      });
    });
