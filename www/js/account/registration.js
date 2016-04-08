/**
 * This js script will handle all logic for the registration. Its corresponding html file is registration.html.
 * The main purpose of this page is just to handle input checks for the first page of registration
 */

angular.module('crowdsourcing')

    .controller('registrationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicLoading, $ionicHistory, apiUrl, $ionicModal) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    $scope.orientation= [{}];

    if(window.localStorage.getItem("tempName") != null && window.localStorage.getItem("tempEmail") != null &&
      window.localStorage.getItem("tempPassword")!= null && window.localStorage.getItem("tempContactnumber")!= null &&
      window.localStorage.getItem("tempDOB")!= null && window.localStorage.getItem("tempHaveCar")!= null)
    {
      //display information depending if the storage has the information, if have, meaning user click back on the second page of registration.
      if (window.localStorage.getItem("tempHaveCar") == 1) {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:new Date(window.localStorage.getItem("tempDOB")), gender:window.localStorage.getItem("tempGender"), carChecked:"1"};
      }
      else {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:new Date(window.localStorage.getItem("tempDOB")), gender:window.localStorage.getItem("tempGender"), carChecked:"0"};
      }
    }
    else
    {
      //to show orientation modal before dislaying the page
      //$scope.modal.show();
      $ionicModal.fromTemplateUrl('templates/account/OrientationModal.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        focusFirstInput: true
      }).then(function(modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });
    }

      //register method will be called when user click on the register button
      $scope.register = function(fields)
      {
        if(fields != null) {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
            && fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != ""
            &&  fields.dob!= null && fields.gender != null && fields.gender.trim() != "" && fields.carChecked != null && fields.carChecked != "") {
            var tempName = fields.name;
            var tempEmail = fields.email.toLowerCase();
            var tempPassword = fields.password;
            var tempContactnumber = fields.contactnumber;
            var tempDOB = fields.dob;
            var tempGender = fields.gender;

            //validate the dob
            if (validateDOB(tempDOB) == true) {
              if(validateDOBAge(fields.dob.getFullYear()) == true)
              {
                //convert date to format such that it can be displayed
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
                //validate name
                if (validateName(tempName) == true) {
                  //validate contact details
                  if (tempContactnumber.length == 8 && !isNaN(tempContactnumber) && validateContact(tempContactnumber) == true) {
                    //validate email
                    if (validateEmail(tempEmail) == true) {
                      //validate password
                      if (validatePassword(tempPassword) == true) {
                        $http.get(apiUrl + "checkEmail?email=" + tempEmail,{timeout: 12000})
                          .success(function (data) {

                            var status = data;
                            if (status.status[0] != "exist") {
                              if (fields.carChecked == "1") {
                                $scope.tempCarChecked = 1;
                              }
                              else {
                                $scope.tempCarChecked = 0;
                              }

                              //put details in storage if all information is ok and navigate to the second pae of registration
                              window.localStorage.setItem("tempName", tempName);
                              window.localStorage.setItem("tempEmail", tempEmail);
                              window.localStorage.setItem("tempPassword", tempPassword);
                              window.localStorage.setItem("tempContactnumber", tempContactnumber);
                              window.localStorage.setItem("tempDOB", tempDOB);
                              window.localStorage.setItem("tempHaveCar", $scope.tempCarChecked);
                              window.localStorage.setItem("tempGender", fields.gender);

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
                                    text: 'OK',
                                    type: 'button button-stable',

                                  },
                                ]
                              });
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
                      else {
                        $scope.loadingshow = false;
                        $ionicLoading.hide();

                        var alertPopup = $ionicPopup.alert({
                          title: '<h6 class="popups title">Whoops!</h6>',
                          subTitle: '<br><h6 class="popups">Password should consist of at least 6 characters with numbers and alphabets</h6> ',
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
                    else {
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
                  else {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();

                    var alertPopup = $ionicPopup.alert({
                      title: '<h6 class="popups title">Whoops!</h6>',
                      subTitle: '<br><h6 class="popups">Contact number should start with 8/9 and contains 8 numbers</h6> ',
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
                else {
                  $scope.loadingshow = false;
                  $ionicLoading.hide();

                  var alertPopup = $ionicPopup.alert({
                    title: '<h6 class="popups title">Whoops!</h6>',
                    subTitle: '<br><h6 class="popups">Name should consist of alphabetical letters only</h6> ',
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
              else {
                $scope.loadingshow = false;
                $ionicLoading.hide();

                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Volunteers of CareGuide are required to be between 16 to 70 years old</h6> ',
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
            else {
              $scope.loadingshow = false;
              $ionicLoading.hide();

              var alertPopup = $ionicPopup.alert({
                title: '<h6 class="popups title">Whoops!</h6>',
                subTitle: '<br><h6 class="popups">Date of Birth cannot be larger than the current date.</h6> ',
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
            $scope.loadingshow = false;
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
                text: 'OK',
                type: 'button button-stable',

              },
            ]
          });
        }
      }

    //method to validate orientation during
    function validateOccupation(occupation) {
      return /^[a-zA-Z\s]+$/.test(occupation);
    }

    //method to validate NRIC if needed in future
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

    //method to validate eamil
    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    //method to validate password
    function validatePassword(password){
      var re = /(?=.*\d)(?=.*[A-z]).{6,20}/;
      return re.test(password);
    }

    //method to validate name
    function validateName(name) {
      return /^[a-zA-Z\s\,\-\/]+$/.test(name);
    }

    //method to validate dob
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

    //method to censure volunteer to be of a certain age
    function validateDOBAge(year){
      var currentDate = new Date();
      if(currentDate.getFullYear() - year >= 16 && currentDate.getFullYear() - year <= 70)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    //method to validate contact details
    function validateContact(contact){
      if(contact.charAt(0) == "9" || contact.charAt(0) == "8")
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

    //method to go back to landing page if clicke on the 'x/
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

    $scope.hideModal = function()
    {
      $scope.modal.hide();
      $state.go('login', {}, {reload: true});
    }

    //method that will be called when use click on the tab
    $scope.proceedRegistration = function()
    {
      if($scope.orientation.checkBox != true)
      {
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">Please read and check the box before proceeding</h6> ',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button button-stable',

            },
          ]
        });
      }
      else
      {
        $scope.modal.hide();
      }
    }
  });
