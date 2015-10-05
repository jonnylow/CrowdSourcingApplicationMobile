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
            && fields.nric.trim() != "" && fields.gender!= null && fields.gender.trim() != "")
          {
            var tempName = fields.name;
            var tempEmail = fields.email;
            var tempPassword = fields.password;
            var tempConfirmpassword = fields.confirmpassword;
            var tempContactnumber = fields.contactnumber;
            var tempDOB = fields.dob;
            var tempNRIC = fields.nric;
            var tempGender = fields.gender;

            var dd = tempDOB.getDate();
            var mm = tempDOB.getMonth()+1;
            var yyyy = tempDOB.getFullYear();
            if(dd<10){
              dd='0'+dd
            }
            if(mm<10){
              mm='0'+mm
            }
            tempDOB = yyyy+'-'+mm+'-'+dd;

            if(tempPassword == tempConfirmpassword) {
              if (tempContactnumber.length == 8 && !isNaN(tempContactnumber)) {
                if(validateEmail(tempEmail) == true)
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
                  alert("Invalid email address. Please try again.")
                }
              }
              else {
                alert("Invalid contact number. Please try again.")
              }
            }
            else
            {
              alert("Passwords does not match. Please try again.");
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

    function validateEmail(email) {
      var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      return re.test(email);
    }
    });
