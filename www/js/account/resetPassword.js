angular.module('crowdsourcing')

    .controller('resetPasswordController', function ($scope, $ionicPopup, $state, $http, $ionicLoading, $ionicHistory, apiUrl) {
      $scope.resetPassword = function(fields){
          $scope.loadingshow = true;
        //ionic loading screen
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

          if(fields != null) {
            if (fields.email != null && fields.email.trim() != "" && fields.phone != null )
            {
                var tempNRIC = fields.email;
                var tempphone = fields.phone;
                $http.get("http://www.changhuapeng.com/laravel/api/verifyUserEmailandPassword?email=" + tempNRIC + "&phone=" + tempphone)
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
                              subTitle: ' <br><h6 class="popups registration">Your password is sent to your email address</h6>',
                              scope: $scope,
                              buttons: [
                                {
                                  text: 'Ok',
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
                                  text: 'Ok',
                                  onTap: function(e) {
                                  }
                                }
                              ]
                            });
                         }
                    }
                  }
                })


              }
          else
          {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title error">Error</h6>',
              subTitle: '<br><h6 class="popups">Please fill in all fields.</h6>',
              scope: $scope,
                                  buttons: [
                                    {
                                      text: '<b>Ok</b>',
                                      type: 'button button-energized',

                                    },
                                  ]
            });
            $scope.loadingshow = false;
          }
        }
      }

    $scope.landingPage = function () {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });

      if (window.plugins != null) {
        window.plugins.nativepagetransitions.slide(
          {"direction": "down"}
        );
      }

      $state.go('login', {}, {reload: true});
    }
    });

