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

    var urlString = apiUrl+"retrieveUserDetails?id="+$scope.id;

    $http.get(urlString)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null) {
          $scope.fields.dob =new Date(userDetails.volunteer[0].date_of_birth);
          $scope.fields.gender = userDetails.volunteer[0].gender;
          $scope.fields.carChecked = userDetails.volunteer[0].has_car;
          $scope.fields.email =userDetails.volunteer[0].email;
          $scope.fields.name = userDetails.volunteer[0].name;
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
          if (fields.name!= null && fields.name.trim() != "" && fields.email != null && fields.email.trim() != ""
              && fields.dob != null) {
            var name = fields.name;
            var p1 = fields.preferences_1;
            var p2 = fields.preferences_2;
            var gender = fields.gender;
            var tempDOB = fields.dob;

              var dd = tempDOB.getDate();
              var mm = tempDOB.getMonth() + 1;
              var yyyy = tempDOB.getFullYear();
              if (dd < 10) {
                dd = '0' + dd
              }
              if (mm < 10) {
                mm = '0' + mm
              }
            var dob = yyyy + '-' + mm + '-' + dd;
            var occupation = fields.occupation;
            var hasCar = fields.carChecked;
            var email = fields.email;

            if(p1 == null)
            {
              p1 = '';
            }
            if(p2 == null)
            {
              p2 = '';
            }
            if(gender == null)
            {
              gender = '';
            }
            if(occupation == null)
            {
              occupation = '';
            }

            if (validateName(name) == true) {
              if(p1 != '' || p2 != '')
              {
                if (p1 != p2) {
                  urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

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
                                $state.go('me', {}, {reload: true});
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
                urlStringUpdate = apiUrl + "updateUserDetails?id=" + $scope.id + "&name=" + name + "&occupation=" + occupation + "&p1=" + p1 + "&p2=" + p2 + "&gender=" + gender + "&dob=" + dob + "&hasCar=" + hasCar + "&email=" + email;

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
                              $state.go('me', {}, {reload: true});
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
