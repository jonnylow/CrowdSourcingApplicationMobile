angular.module('crowdsourcing')

    .controller('registrationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicLoading, $ionicHistory, apiUrl) {
    if(window.localStorage.getItem("tempName") != null && window.localStorage.getItem("tempEmail") != null &&
      window.localStorage.getItem("tempPassword")!= null && window.localStorage.getItem("tempContactnumber")!= null &&
      window.localStorage.getItem("tempDOB")!= null && window.localStorage.getItem("tempHaveCar")!= null)
    {
      if (window.localStorage.getItem("tempHaveCar") == 1) {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:new Date(window.localStorage.getItem("tempDOB")), gender:window.localStorage.getItem("tempGender"), carChecked:true};
      }
      else {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:new Date(window.localStorage.getItem("tempDOB")), gender:window.localStorage.getItem("tempGender"), carChecked:false};
      }
    }
    else
    {
      var myPopup = $ionicPopup.show({
        title: '<h6 class="popups title">Notice</h6>',
        subTitle: ' <br><h6 class="popups registration">Approved volunteers will have an orientation session with the Centre for Seniors (CFS). CFS will contact you shortly after registration</h6>',
        scope: $scope,
        buttons: [
          {
            text: 'Cancel',
            onTap: function(e) {
              $ionicHistory.nextViewOptions({
                disableAnimate: true
              });
              $state.go('landingPage', {}, {reload: true});
              if (window.plugins != null) {
                window.plugins.nativepagetransitions.slide(
                  {"direction": "down"}
                );
              }
            },
            type: 'button button-stable registration'
          },
          {
            text: '<b>Ok</b>',
            type: 'button button-stable'

          },
        ]
      });
    }

      $scope.register = function(fields)
      {
        if(fields != null) {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
            && fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != ""
            &&  fields.dob!= null) {
            var tempName = fields.name;
            var tempEmail = fields.email;
            var tempPassword = fields.password;
            var tempContactnumber = fields.contactnumber;
            var tempDOB = fields.dob;

            if (validateDOB(tempDOB) == true) {
              var dd = tempDOB.getDate();
              var mm = tempDOB.getMonth() + 1;
              var yyyy = tempDOB.getFullYear();
              if (dd < 10) {
                dd = '0' + dd
              }
              if (mm < 10) {
                mm = '0' + mm
              }
              tempDOB = yyyy + '-' + mm + '-' + dd;
                if (validateName(tempName) == true) {
                  if (tempContactnumber.length == 8 && !isNaN(tempContactnumber) && validateContact(tempContactnumber) == true) {
                    if (validateEmail(tempEmail) == true) {
                      $http.get(apiUrl+"checkEmail?email=" + tempEmail)
                      .success(function (data) {

                          var status = data;
                          if (status.status[0] != "exist") {
                            if (fields.carChecked == true) {
                              $scope.tempCarChecked = 1;
                            }
                            else {
                              $scope.tempCarChecked = 0;
                            }

                            window.localStorage.setItem("tempName", tempName);
                            window.localStorage.setItem("tempEmail", tempEmail);
                            window.localStorage.setItem("tempPassword", tempPassword);
                            window.localStorage.setItem("tempContactnumber", tempContactnumber);
                            window.localStorage.setItem("tempDOB", tempDOB);
                            window.localStorage.setItem("tempHaveCar", $scope.tempCarChecked);

                            $scope.loadingshow = false;
                            $ionicLoading.hide();
                            $state.go('moreQuestions', {}, {reload: true});
                          }
                          else {
                            $scope.loadingshow = false;
                            $ionicLoading.hide();

                            var alertPopup = $ionicPopup.alert({
                              title: '<h6 class="popups title">Whoops!</h6>',
                              subTitle: '<br><h6 class="popups">Email address has been registered</h6> ',
                              scope: $scope,
                              buttons: [
                                {
                                  text: '<b>Ok</b>',
                                  type: 'button button-stable',

                                },
                              ]
                            });
                          }
                      })
                    }
                    else {
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
                  else {
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
                else {
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
            else {
              $scope.loadingshow = false;
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Date of Birth cannot be larger than the current date.</h6> ',
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
              subTitle: '<br><h6 class="popups">Please fill in all fields</h6> ',
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
            subTitle: '<br><h6 class="popups">Please fill in all fields</h6> ',
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

    function validateOccupation(occupation) {
      return /^[a-zA-Z\s]+$/.test(occupation);
    }

    function validateNRIC(nric) {
      if(nric.length == 9 && nric.charAt(0).toLowerCase() == "s" && /^[a-zA-Z]+$/.test(nric.charAt(8)) == true)
      {
        var tempS = nric.substring(1, 7);
        if (tempS.match(/^[0-9]+$/) != null)
        {
          return true;
        }
      }
      else if(nric.length == 9 && nric.charAt(0).toLowerCase() == "g" && /^[a-zA-Z]+$/.test(nric.charAt(8)) == true)
      {
        var tempS = nric.substring(1, 7);
        if (tempS.match(/^[0-9]+$/) != null)
        {
          return true;
        }
      }
      else if(nric.length == 9 && nric.charAt(0).toLowerCase() == "t" && /^[a-zA-Z]+$/.test(nric.charAt(8)) == true)
      {
        var tempS = nric.substring(1, 7);
        if (tempS.match(/^[0-9]+$/) != null)
        {
          return true;
        }
      }
      else if(nric.length == 9 && nric.charAt(0).toLowerCase() == "f" && /^[a-zA-Z]+$/.test(nric.charAt(8)) == true)
      {
        var tempS = nric.substring(1, 7);
        if (tempS.match(/^[0-9]+$/) != null)
        {
          return true;
        }
      }
      return false;
    }

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    function validateName(name) {
      return /^[a-zA-Z\s\,\-\/]+$/.test(name);
    }

    function validateDOB(tempDOB){
      if(tempDOB > new Date())
      {
        //larger
        return false;
      }
      else
      {
        //ok
        return true;
      }
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
    $scope.goLogin = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.login');
    }
  });
