angular.module('crowdsourcing')

    .controller('manageAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.fields= {nric: "",email: "", name:"", contactnumber:"", occupation:"", preferences_1:"", preferences_2:""};
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = $stateParams.id;
        }
        else {
          $state.go('login', {}, {reload: true});
        }

    var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveUserDetails.php?id="+$scope.id;

    $http.get(urlString)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null) {
          $scope.fields.nric=userDetails[0].nric;
          $scope.fields.email =userDetails[0].email;
          $scope.fields.name = userDetails[0].name;
          $scope.fields.contactnumber=userDetails[0].contact_no;
          $scope.fields.occupation=userDetails[0].occupation;
          $scope.fields.preferences_1=userDetails[0].area_of_preference_1;
          $scope.fields.preferences_2=userDetails[0].area_of_preference_2;
        }
      })

      .error(function (data) {
        alert("Error in connection");
      });

      $scope.update=function(fields)
      {
        if(fields != null) {
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
              && fields.occupation != null && fields.occupation.trim() != ""
            && fields.preferences_1!= null && fields.preferences_1.trim() != "" && fields.preferences_2!= null && fields.preferences_2!= null) {
            var name = fields.name;
            var contact = fields.contactnumber;
            var occupation = fields.occupation;
            var p1 = fields.preferences_1;
            var p2 = fields.preferences_2;

            urlStringUpdate = "http://www.changhuapeng.com/volunteer/php/UpdateUserDetails.php?id="+$scope.id+"&name="+name+"&number="+contact+"&occupation="+occupation+"&p1="+p1+"&p2="+p2;

            $http.get(urlStringUpdate)
              .success(function (data) {
                var status = data;
                if (status != null) {
                  var alertPopup = $ionicPopup.alert({
                    title: 'Status',
                    template: status.status[0]
                  });
                  $state.go('tab.me', {}, {reload: true});
                }
              })

              .error(function (data) {
                alert("Error in connection");
              });
          }
          else
          {
            alert("Please do not leave any fields empty.");
          }
        }
        else
        {
          alert("Please do not leave any fields empty.");
        }
      }

      $scope.back=function()
      {
        $ionicHistory.goBack();
      }
    });
