/**
 * This js script will handle all logic for feedback. Its corresponding html file is feedback.html.
 * The main purpose of this page is just to handle any logic for the feedback function.
 */
angular.module('crowdsourcing')

    .controller('feedbackController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
      if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //this function is for the submit button of the feedback
    $scope.submit = function(fields)
    {
      //this function will just check all fields on the form and do proper validation. If the input contents are accepted, it will call the web service to send the feedback
      if(fields!= null && fields.feedback != null && fields.feedback != "" && fields.email != null && fields.email!= "")
      {
        if (validateEmail(fields.email) == true) {
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
          var sendEmail = apiUrl+"sendFeedback?email="+fields.email+"&feedback="+fields.feedback;
          $http.get(sendEmail,{timeout: 12000})
            .success(function (data) {
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Submitted!</h6>',
                subTitle: '<br><h6 class="popups">Thank you for your feedback!</h6> ',
                scope: $scope,
                buttons: [
                  {
                    text: 'OK',
                    type: 'button button-stable',
                    onTap: function (e) {
                      $state.go('tab.home', {}, {reload: true});
                    }
                  },
                ]
              });
            })
            .error(function (data) {
              $scope.loadingshow = false;
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
                scope: $scope,
                buttons: [
                  {
                    text: 'OK',
                    type: 'button button-stable',
                    onTap: function (e) {
                      if ($scope.backView != null) {
                        $scope.backView.go();
                      }
                      else {
                        $state.go('landingPage', {}, {reload: true});
                      }
                    }
                  },
                ]
              });
            });
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
                text: 'OK',
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
          subTitle: '<br><h6 class="popups">Please fill in all fields</h6> ',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button button-stable',

            },
          ]
        });
      }
    }

    //function to validate the email in the input field
    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }
});
