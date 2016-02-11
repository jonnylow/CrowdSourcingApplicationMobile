angular.module('crowdsourcing')

    .controller('manageAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.fields= {nric: "",email: "", name:"", contactnumber:"", occupation:"", preferences_1:"", preferences_2:""};
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = $stateParams.id;
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        }
        else {
          $state.go('landingPage', {}, {reload: true});
        }

    var urlString = "http://changhuapeng.com/laravel/api/retrieveUserDetails?id="+$scope.id;

    $http.get(urlString)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null) {
          $scope.fields.nric=userDetails.volunteer[0].nric;
          $scope.fields.email =userDetails.volunteer[0].email;
          $scope.fields.name = userDetails.volunteer[0].name;
          $scope.fields.contactnumber=userDetails.volunteer[0].contact_no;
          $scope.fields.occupation=userDetails.volunteer[0].occupation;
          $scope.fields.preferences_1=userDetails.volunteer[0].area_of_preference_1;
          $scope.fields.preferences_2=userDetails.volunteer[0].area_of_preference_2;
          $scope.loadingshow = false;
          $ionicLoading.hide();
        }
      })

      $scope.update=function(fields)
      {
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        if(fields != null) {
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
              && fields.occupation != null && fields.occupation.trim() != ""
            && fields.preferences_1!= null && fields.preferences_1.trim() != "" && fields.preferences_2!= null && fields.preferences_2!= null) {
            var name = fields.name;
            var contact = fields.contactnumber;
            var occupation = fields.occupation;
            var p1 = fields.preferences_1;
            var p2 = fields.preferences_2;

            if (validateName(name) == true) {
              if (contact.length == 8 && !isNaN(contact) && validateContact(contact) == true) {
                if(p1 != p2){
                urlStringUpdate = "http://changhuapeng.com/laravel/api/updateUserDetails?id=" + $scope.id + "&name=" + name + "&number=" + contact + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2;

                $http.get(urlStringUpdate)
                  .success(function (data) {
                    var status = data;
                    if (status != null) {
                      $scope.loadingshow = false;
                      $ionicLoading.hide();
                      var alertPopup = $ionicPopup.alert({
                        //title: '<b><h6 class="popups title">Status</h6></b>',
                        title: '<br><h6 class="popups"> ' + status.status[0] + "</h6>",
                        scope: $scope,
                        buttons: [
                          {
                            text: '<b>Ok</b>',
                            type: 'button button-stable',
                            onTap: function (e) {
                              $state.go('tab.me', {}, {reload: true});
                            }
                          },
                        ]
                      });
                    }
                  })

                  .error(function (data) {
                    alert("Error in connection");
                  });
                }
                else {
                  $scope.loadingshow = false;
                  $ionicLoading.hide();

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
                $scope.loadingshow = false;
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Contact number should start with 6/8/9 and contains 8 numbers</h6> ',
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
              $scope.loadingshow = false;
              $ionicLoading.hide();
              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Name should consist of alphabetical letters only</h6> ',
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
            $scope.loadingshow = false;
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
              title: '<h6 class="popups title">Whoops!</h6>',
              subTitle: '<br><h6 class="popups">Please do not leave any fields empty</h6> ',
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
          $scope.loadingshow = false;
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Please do not leave any fields empty</h6> ',
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

    function validateName(name) {
      return /^[a-zA-Z\s]+$/.test(name);
    }

    function validateContact(contact){
      if(contact.charAt(0) == "9" || contact.charAt(0) == "8" || contact.charAt(0) == "6")
      {
        //valid
        return true;
      }
      else
      {
        //not valid
        return false;
      }
    }

      $scope.back=function()
      {
        $ionicHistory.goBack();
      }
    });
