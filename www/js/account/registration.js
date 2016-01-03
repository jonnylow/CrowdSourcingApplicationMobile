angular.module('crowdsourcing')

    .controller('registrationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicLoading, $ionicHistory) {
    var myPopup = $ionicPopup.show({
      title: '<b>Notice</b>',
      subTitle: 'Registered volunteers are required to have a one-off orientation session with the Centre for Seniors (CFS). CFS will contact you after registration',
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
          }},
        {
          text: '<b>Ok</b>',
          type: 'button button-energized'

        },
      ]
    });

    if(window.localStorage.getItem("tempName") != null && window.localStorage.getItem("tempEmail") != null &&
      window.localStorage.getItem("tempPassword")!= null && window.localStorage.getItem("tempContactnumber")!= null &&
      window.localStorage.getItem("tempDOB")!= null && window.localStorage.getItem("tempNRIC")!= null &&
      window.localStorage.getItem("tempGender")!= null && window.localStorage.getItem("tempHaveCar")!= null &&
      window.localStorage.getItem("tempOccupation")!= null)
    {
      if (window.localStorage.getItem("tempHaveCar") == 1) {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:null,nric:window.localStorage.getItem("tempNRIC"), gender:window.localStorage.getItem("tempGender"), occupation:window.localStorage.getItem("tempOccupation"), carChecked:true};
      }
      else {
        $scope.fields = {name:window.localStorage.getItem("tempName"), email:window.localStorage.getItem("tempEmail"), password:window.localStorage.getItem("tempPassword"), contactnumber:window.localStorage.getItem("tempContactnumber"), dob:null,nric:window.localStorage.getItem("tempNRIC"), gender:window.localStorage.getItem("tempGender"), occupation:window.localStorage.getItem("tempOccupation"), carChecked:false};
      }
    }

      $scope.register = function(fields)
      {
        if(fields != null) {
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
            && fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != ""
            &&  fields.dob!= null && fields.nric!= null
            && fields.nric.trim() != "" && fields.gender!= null && fields.gender.trim() != "" && fields.occupation!= null && fields.occupation.trim() != "") {
            var tempName = fields.name;
            var tempEmail = fields.email;
            var tempPassword = fields.password;
            //var tempConfirmpassword = fields.confirmpassword;
            var tempContactnumber = fields.contactnumber;
            var tempDOB = fields.dob;
            var tempNRIC = fields.nric;
            var tempGender = fields.gender;
            var occupation = fields.occupation;

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
                //if (tempPassword == tempConfirmpassword) {
                  if (tempContactnumber.length == 8 && !isNaN(tempContactnumber) && validateContact(tempContactnumber) == true) {
                    if (validateEmail(tempEmail) == true) {
                      var urlString = "http://www.changhuapeng.com/volunteer/php/CheckEmail.php?email="+tempEmail;

                      $http.get(urlString)
                        .success(function (data) {

                          var status = data;
                          if(status.status[0] != "exist")
                          {
                            //if(validateNRIC(tempNRIC) == true)
                            //{
                              var urlStringNRIC = "http://www.changhuapeng.com/volunteer/php/CheckNRIC.php?nric="+tempNRIC;

                              $http.get(urlStringNRIC)
                                .success(function (data) {

                                  var status = data;
                                  if(status.status[0] != "exist")
                                  {
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
                                    window.localStorage.setItem("tempNRIC", tempNRIC);
                                    window.localStorage.setItem("tempGender", tempGender);
                                    window.localStorage.setItem("tempOccupation", occupation);
                                    window.localStorage.setItem("tempHaveCar", $scope.tempCarChecked);

                                    $scope.loadingshow = false;
                                    $ionicLoading.hide();
                                    $state.go('moreQuestions', {}, {reload: true});
                                  }
                                  else
                                  {
                                    $scope.loadingshow = false;
                                    $ionicLoading.hide();
                                    alert("NRIC has already been registered. Please try again.");
                                  }
                                })
                            //}
                            //else
                            //{
                            //  alert("Invalid NRIC. Please try again.");
                            //}
                          }
                          else
                          {
                            $scope.loadingshow = false;
                            $ionicLoading.hide();
                            alert("Email address has already been registered. Please try again.");
                          }
                        })
                    }
                    else {
                      $scope.loadingshow = false;
                      $ionicLoading.hide();
                      alert("Invalid email address. Please try again.");
                    }
                  }
                  else {
                    $scope.loadingshow = false;
                    $ionicLoading.hide();
                    alert("Invalid phone number. Please try again.");
                  }
                /*}
                else {
                  $scope.loadingshow = false;
                 $ionicLoading.hide();
                  alert("Passwords do not match. Please try again.");
                }*/
              }
              else {
                $scope.loadingshow = false;
                $ionicLoading.hide();
                alert("Name should consists of alphabetical letters only.");
              }
            }
            else {
              $scope.loadingshow = false;
              $ionicLoading.hide();
              alert("Date of Birth cannot larger than current date.");
            }
          }
          else
          {
            $scope.loadingshow = false;
            $ionicLoading.hide();
            alert("Please fill in all fields.");
          }
        }
        else
        {
          $scope.loadingshow = false;
          $ionicLoading.hide();
          alert("Please fill in all fields.");
        }
      }

    function validateNRIC(nric) {
      if(nric.length == 9 && nric.charAt(0).toLowerCase() == "s" && /^[a-zA-Z]+$/.test(nric.charAt(8)) == true)
      {
        return true;
      }
      else
      {
        return false;
      }
    }

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }

    function validateName(name) {
      return /^[a-zA-Z\s]+$/.test(name);
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
      window.localStorage.removeItem("tempNRIC");
      window.localStorage.removeItem("tempGender");
      window.localStorage.removeItem("tempHaveCar");
      window.localStorage.removeItem("tempOccupation");
      window.localStorage.removeItem("tempPreferences1");
      window.localStorage.removeItem("tempPreferences2");
      window.localStorage.removeItem("front");
      window.localStorage.removeItem("back");

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
  });
