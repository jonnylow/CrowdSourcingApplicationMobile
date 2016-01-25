angular.module('crowdsourcing')

    .controller('landingPageController', function ($scope, $ionicPopup, $state, $http, $ionicHistory, $ionicLoading, $ionicModal, apiUrl) {
      //reset userLat and userlng
      window.localStorage.removeItem("userLat");
      window.localStorage.removeItem("userLong");

      if(window.localStorage.getItem("loginId") != null)
      {
        $state.go('tab.home', {}, {reload: true});
      }
      else {
        $scope.login = function () {
          $ionicHistory.nextViewOptions({
            disableAnimate: true
          });

          if (window.plugins != null) {
            window.plugins.nativepagetransitions.slide(
              {
                'href': '#/login',
                'direction': "up",
                'duration': 500,
                'iosdelay': 0 // the new property
              }
            );
          }
          else {
            $state.go('login', {}, {reload: true});
          }
        }

        //FOR USER STUDY
        if(window.localStorage.getItem("survey") == null)
        {
          $ionicModal.fromTemplateUrl('templates/account/survey.html', function ($ionicModal) {
            $scope.modal = $ionicModal;
            $scope.modal.show();
          }, {
            // Use our scope for the scope of the modal to keep it simple
            scope: $scope,
            // The animation we want to use for the modal entrance
            animation: 'slide-in-up',
            backdropClickToClose: false,
            hardwareBackButtonClose: false
          });
        }

        $scope.submit = function (fields) {
          if (fields != null && fields.survey != null && fields.survey != "" && fields.willing != null && fields.willing != "" && fields.day != null && fields.day != "" && fields.email != null && fields.email != "") {
            if (validateEmail(fields.email) == true) {
              $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
              var sendEmail = apiUrl + "email/sendEmail.php?email=jonathanlow.2013@sis.smu.edu.sg&title=[CareRide Alert] Survey for CareRide&message=Willing: " + fields.willing + ", Area volunteer: " + fields.survey + ", Day of week: " + fields.day + ", Contact email: " + fields.email;
              $http.get(sendEmail)
                .success(function (data) {
                  $ionicLoading.hide();
                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Submitted!</h6>',
                    subTitle: '<br><h6 class="popups">Thank you for your response!</h6> ',
                    scope: $scope,
                    buttons: [
                      {
                        text: '<b>Ok</b>',
                        type: 'button button-stable',
                        onTap: function (e) {
                          window.localStorage.setItem("survey", "done");
                          $scope.modal.hide();
                        }
                      },
                    ]
                  });
                })
            }
            else
            {
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
          else {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title">Whoops!</h6>',
              subTitle: '<br><h6 class="popups">Please fill in all fields before submitting</h6> ',
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
      }
    });
