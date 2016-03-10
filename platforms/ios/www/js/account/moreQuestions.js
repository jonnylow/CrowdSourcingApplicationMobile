angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicHistory) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");
      $scope.tempGender = window.localStorage.getItem("tempGender");
      $scope.fields = {preferences_1:"", preferences_2:"", occupation:""};
      if(window.localStorage.getItem("tempPreferences1") != null || window.localStorage.getItem("tempPreferences2") != null || window.localStorage.getItem("tempOccupation") != null)
      {
        $scope.fields = {preferences_1:window.localStorage.getItem("tempPreferences1"), preferences_2:window.localStorage.getItem("tempPreferences2"), occupation:window.localStorage.getItem("tempOccupation")};
      }

      $scope.verify = function(fields)
      {
        if(fields != null && fields.preferences_1 != null && fields.preferences_2 != null && fields.occupation != null) {
            if((fields.preferences_1 == "" && fields.preferences_2 == "") || fields.preferences_1 != fields.preferences_2) {
                if(fields.occupation == "" || validateOccupation(fields.occupation) == true) {
                  window.localStorage.setItem("tempOccupation", fields.occupation);
                  window.localStorage.setItem("tempPreferences1", fields.preferences_1);
                  window.localStorage.setItem("tempPreferences2", fields.preferences_2);

                  $state.go('verify', {}, {reload: true});
                }
              else
                {
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Whoops!</h6>',
                    subTitle: '<br><h6 class="popups">Occupation should consist of alphabetical letters only</h6> ',
                    scope: $scope,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button button-stable',

                      },
                    ]
                  });
                }
            }
            else
            {
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Please choose different area of preferences.</h6> ',
                scope: $scope,
                buttons: [
                  {
                    text: '<b>Ok</b>',
                    type: 'button button-stable',

                  },
                ]
              });
            }
        }
        else
        {
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Please fill in all fields.</h6> ',
            scope: $scope,
            buttons: [
              {
                text: '<b>Ok</b>',
                type: 'button button-stable',

              },
            ]
          });
        }
      }

    $scope.skip = function()
    {
      window.localStorage.setItem("tempOccupation", "");
      window.localStorage.setItem("tempPreferences1", "");
      window.localStorage.setItem("tempPreferences2", "");

      $state.go('verify', {}, {reload: true});
    }

    $scope.landingPage = function () {
      window.localStorage.removeItem("tempName");
      window.localStorage.removeItem("tempEmail");
      window.localStorage.removeItem("tempPassword");
      window.localStorage.removeItem("tempContactnumber");
      window.localStorage.removeItem("tempDOB");
      window.localStorage.removeItem("tempGender");
      window.localStorage.removeItem("tempHaveCar");
      window.localStorage.removeItem("tempOccupation");
      window.localStorage.removeItem("tempPreferences1");
      window.localStorage.removeItem("tempPreferences2");

      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});

      $state.go('landingPage', {}, {reload: true});
      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {"direction": "down"}
        );
      }
    }

    function validateOccupation(occupation) {
      return /^[a-zA-Z\s]+$/.test(occupation);
    }

  });
