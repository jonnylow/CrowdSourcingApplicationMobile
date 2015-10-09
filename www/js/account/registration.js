angular.module('crowdsourcing')

    .controller('registrationController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
    var myPopup = $ionicPopup.show({
      title: 'Notice',
      subTitle: 'Registered volunteers are required to have a one-off orientation session with the Centre for Seniors (CFS). CFS will contact you after registration',
      scope: $scope,
      buttons: [
        {
          text: 'Cancel',
          onTap: function(e) {
            $state.go('login', {}, {reload: true});
          }},
        {
          text: '<b>Ok</b>',
          type: 'button-calm'

        },
      ]
    });

      $scope.register = function(fields)
      {
        if(fields != null) {
          if (fields.name!= null && fields.name.trim() != "" && fields.contactnumber != null && fields.contactnumber.trim() != ""
            && fields.email != null && fields.email.trim() != "" && fields.password != null && fields.password.trim() != ""
            && fields.confirmpassword!= null && fields.confirmpassword.trim() != "" && fields.dob!= null && fields.nric!= null
            && fields.nric.trim() != "" && fields.gender!= null && fields.gender.trim() != "") {
            var tempName = fields.name;
            var tempEmail = fields.email;
            var tempPassword = fields.password;
            var tempConfirmpassword = fields.confirmpassword;
            var tempContactnumber = fields.contactnumber;
            var tempDOB = fields.dob;
            var tempNRIC = fields.nric;
            var tempGender = fields.gender;

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
                if (tempPassword == tempConfirmpassword) {
                  if (tempContactnumber.length == 8 && !isNaN(tempContactnumber) && validateContact(tempContactnumber) == true) {
                    if (validateEmail(tempEmail) == true) {
                      var urlString = "http://www.changhuapeng.com/volunteer/php/CheckEmail.php?email="+tempEmail;

                      $http.get(urlString)
                        .success(function (data) {

                          var status = data;
                          if(status.status[0] != "exist")
                          {
                            if(validateNRIC(tempNRIC) == true)
                            {
                              var urlStringNRIC = "http://www.changhuapeng.com/volunteer/php/CheckNRIC.php?nric="+tempNRIC;

                              $http.get(urlStringNRIC)
                                .success(function (data) {

                                  var status = data;
                                  if(status.status[0] != "exist")
                                  {
                                    window.localStorage.setItem("tempName", tempName);
                                    window.localStorage.setItem("tempEmail", tempEmail);
                                    window.localStorage.setItem("tempPassword", tempPassword);
                                    window.localStorage.setItem("tempContactnumber", tempContactnumber);
                                    window.localStorage.setItem("tempDOB", tempDOB);
                                    window.localStorage.setItem("tempNRIC", tempNRIC);
                                    window.localStorage.setItem("tempGender", tempGender);

                                    $state.go('verify', {}, {reload: true});
                                  }
                                  else
                                  {
                                    alert("NRIC has already been registered. Please try again.");
                                  }
                                })
                            }
                            else
                            {
                              alert("Invalid NRIC. Please try again.");
                            }
                          }
                          else
                          {
                            alert("Email address has already been registered. Please try again.");
                          }
                        })
                    }
                    else {
                      alert("Invalid email address. Please try again.")
                    }
                  }
                  else {
                    alert("Please fill in a valid phone number. Please try again.")
                  }
                }
                else {
                  alert("Passwords does not match. Please try again.");
                }
              }
              else {
                alert("Name should consists of alphabetical letters only.");
              }
            }
            else {
              alert("Date of Birth cannot larger than current date.");
            }
          }
          else
          {
            alert("Please fill in all fields.");
          }
        }
        else
        {
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
      return /^[a-zA-Z]+$/.test(name);
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
  });
