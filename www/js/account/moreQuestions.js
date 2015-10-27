angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.tempName = window.localStorage.getItem("tempName");
      $scope.tempEmail = window.localStorage.getItem("tempEmail");
      $scope.tempPassword = window.localStorage.getItem("tempPassword");
      $scope.tempContactNumber = window.localStorage.getItem("tempContactnumber");
      $scope.tempDOB = window.localStorage.getItem("tempDOB");
    $scope.tempNRIC = window.localStorage.getItem("tempNRIC");
    $scope.tempGender = window.localStorage.getItem("tempGender");
    $scope.tempFrontIC = "frontIC";
    $scope.tempBackIC = "backIC";
    $scope.showFront = true;
    $scope.showBack = true;

      $scope.fields= {carChecked: false, occupation:""};

      $scope.verify = function(fields)
      {
        if(fields != null) {
          if (fields.occupation!= null && fields.occupation.trim() != "")
          {
            var image = document.getElementById('frontic');
            var image1 = document.getElementById('backic');
            if(image.src.indexOf("base64") != -1 && image1.src.indexOf("base64") != -1) {
              if (fields.carChecked == true) {
                $scope.tempCarChecked = 1;
              }
              else {
                $scope.tempCarChecked = 0;
              }

              window.localStorage.setItem("tempHaveCar", $scope.tempCarChecked);
              window.localStorage.setItem("tempOccupation", fields.occupation);
              window.localStorage.setItem("tempPreferences1", fields.preferences_1);
              window.localStorage.setItem("tempPreferences2", fields.preferences_2);

              $state.go('verify', {}, {reload: true});
            }
            else
            {
              alert("Please take front & back IC photos before proceeding.");
            }
          }
          else
          {
            alert("Please fill in all required fields.");
          }
        }
        else
        {
          alert("Please fill in all required fields.");
        }
      }

    $scope.getPhotoFront = function() {
      var image = document.getElementById('frontic');
      if(image.src.indexOf("base64") == -1) {
        if (navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 20,
            destinationType: Camera.DestinationType.DATA_URL
          });
          $scope.showFront = false;
        }
        else {
          alert("No Camera Detected");
        }
      }
      else
      {
        image.src = "";
        $scope.showFront = true;
      }

      function onSuccess(imageData) {
        var image = document.getElementById('frontic');
        image.style.dispay = 'block';
        image.src = "data:image/png;base64," + imageData;
      }

      function onFail(message) {
        alert('Failed because: ' + message);
        $scope.showFront = true;
      }
    }

    $scope.deletePhotoFront = function() {
        var image = document.getElementById('frontic');
        image.style.dispay = 'block';
        image.src = "";
        $scope.showFront = true;
    }

    $scope.getPhotoBack = function() {
      var image = document.getElementById('backic');
      if(image.src.indexOf("base64") == -1) {
        if (navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 20,
            destinationType: Camera.DestinationType.DATA_URL
          });
          $scope.showBack = false;
        }
        else {
          alert("No Camera Detected");
        }
      }
      else
      {
        image.src = "";
        $scope.showBack = true;
      }

      function onSuccess(imageData) {
        var image = document.getElementById('backic');
        image.style.dispay = 'block';
        image.src = "data:image/png;base64," + imageData;
      }

      function onFail(message) {
        alert('Failed because: ' + message);
      }
    }

    $scope.deletePhotoBack = function() {
      var image = document.getElementById('backic');
      image.style.dispay = 'block';
      image.src = "";
      $scope.showBack = true;
    }

  });
