angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $ionicHistory, $timeout) {
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
        }
      })

      .error(function (data) {
        alert("Error in connection");
      });

      $scope.manageAccount = function()
      {
        $state.go('manageAccount', {id: $scope.id});
      }

      // .fromTemplateUrl() method
      if (window.localStorage.getItem("loginUserName") == null) {
        $ionicPopover.fromTemplateUrl('templates/home/menu_popout_guest.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
        });
      }
      else {
        $ionicPopover.fromTemplateUrl('templates/home/menu_popout.html', {
          scope: $scope
        }).then(function (popover) {
          $scope.popover = popover;
        });
      }

      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });

    $scope.logout = function () {
      window.localStorage.removeItem("loginUserName");
      window.localStorage.removeItem("loginId");
      window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      //window.location.reload(true);
      $state.go('loginHome', {}, {reload: true});
      //$state.transitionTo('loginHome', null, {'reload':true});
    }


    });
