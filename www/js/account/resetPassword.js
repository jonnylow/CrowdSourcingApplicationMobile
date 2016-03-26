angular.module('crowdsourcing')

    .controller('resetPasswordController', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $ionicHistory, apiUrl) {

    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

      $scope.resetPassword = function(fields){
          $scope.loadingshow = true;
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.phone != null )
            {
                var tempNRIC = fields.email;
                var tempphone = fields.phone;
                $http.get(apiUrl+"verifyUserEmailandPassword?email=" + tempNRIC + "&phone=" + tempphone,{timeout: 12000})
                .success(function (data) {
                  var verfiy = data;
                  if (verfiy != null) {
                    if(verfiy.status != null)
                    {
                      var status = verfiy.status;
                          if (status == "success"){
                            $scope.loadingshow = false;
                            $ionicLoading.hide();
                            var myPopup = $ionicPopup.show({
                              title: '<h6 class="popups title">Successful!</h6>',
                              subTitle: ' <br><h6 class="popups registration">Your temporary password is sent to your email address</h6>',
                              scope: $scope,
                              buttons: [
                                {
                                  text: 'OK',
                                  type: 'button button-stable',
                                  onTap: function(e) {
                                    $ionicHistory.nextViewOptions({
                                      disableAnimate: true
                                    });
                                    $state.go('login', {}, {reload: true});
                                  }
                                }
                              ]
                            });
                          }
                         else {
                          $scope.loadingshow = false;
                          $ionicLoading.hide();
                           var myPopup = $ionicPopup.show({
                              title: '<h6 class="popups title">Whoops!</h6>',
                              subTitle: ' <br><h6 class="popups registration">Your particulars are incorrect</h6>',
                              scope: $scope,
                              buttons: [
                                {
                                  text: 'OK',
                                  type: 'button button-stable',
                                  onTap: function(e) {
                                  }
                                }
                              ]
                            });
                         }
                    }
                  }
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

        }else
          {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title error">Error</h6>',
              subTitle: '<br><h6 class="popups">Please fill in all fields.</h6>',
              scope: $scope,
                                  buttons: [
                                    {
                                      text: 'OK',
                                      type: 'button button-stable',

                                    },
                                  ]
            });
            //$scope.loadingshow = false;
          }
      }

    $scope.landingPage = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });

      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {
            'href': '#/login',
            'direction': "down",
            'duration': 500,
            'iosdelay': 0 // the new property
          }
        );
      }
      else {
        $state.go('login', {}, {reload: true});
      }
    }
    });

