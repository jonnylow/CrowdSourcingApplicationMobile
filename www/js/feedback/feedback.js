angular.module('crowdsourcing')

    .controller('feedbackController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {
    $scope.submit = function(fields)
    {
      if(fields!= null && fields.feedback != null && fields.feedback != "" && fields.email != null && fields.email!= "")
      {
        if (validateEmail(fields.email) == true) {
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
          var sendEmail = apiUrl+"sendFeedback?email="+fields.feedback+"&feedback="+fields.feedback;
          $http.get(sendEmail)
            .success(function (data) {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Submitted!</h6>',
                subTitle: '<br><h6 class="popups">Thank you for your feedback!</h6> ',
                scope: $scope,
                buttons: [
                  {
                    text: '<b>Ok</b>',
                    type: 'button button-stable',
                    onTap: function (e) {
                      $state.go('tab.home', {}, {reload: true});
                    }
                  },
                ]
              });
            })
        }
        else
        {
          $scope.loadingshow = false;
          $ionicLoading.hide();

          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Invalid email address</h6> ',
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
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">Please enter a feedback before submitting</h6> ',
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

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }
});
