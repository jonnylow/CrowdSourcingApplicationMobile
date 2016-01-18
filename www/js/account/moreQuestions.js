angular.module('crowdsourcing')

    .controller('moreQuestionsController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicHistory) {
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

      if(window.localStorage.getItem("tempPreferences1") != null)
      {
        $scope.fields = {preferences_1:window.localStorage.getItem("tempPreferences1"), preferences_2:window.localStorage.getItem("tempPreferences2")};
        var image = document.getElementById('frontic');
        var image1 = document.getElementById('backic');
        image.src = window.localStorage.getItem("front");
        image1.src = window.localStorage.getItem("back");
      }

      $scope.verify = function(fields)
      {
        if(fields != null && fields.preferences_1 != null && fields.preferences_2 != null) {
            if(fields.preferences_1 != fields.preferences_2) {
              var image = document.getElementById('frontic');
              var image1 = document.getElementById('backic');
              
              

              if (image.src.indexOf("base64") != -1 && image1.src.indexOf("base64") != -1) {

                window.localStorage.setItem("tempPreferences1", fields.preferences_1);
                window.localStorage.setItem("tempPreferences2", fields.preferences_2);

                //to store send image to verify.js
                //window.localStorage.setItem("front", image.src);
                //window.localStorage.setItem("back", image1.src);

                $state.go('verify', {}, {reload: true});
              }
              else {
                var alertPopup = $ionicPopup.alert({
                  title: '<h6 class="popups title">Whoops!</h6>',
                  subTitle: '<br><h6 class="popups">Please take front & back IC photos before proceeding.</h6> ',
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
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Please fill in all required fields.</h6> ',
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

    $scope.getPhotoFront = function() {
      var image = document.getElementById('frontic');
      if(image.src.indexOf("base64") == -1) {
        if (navigator.camera) {
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 20,
            destinationType: Camera.DestinationType.DATA_URL
          });
        }
        else {
          image.src = "base64";
          alert("No Camera Detected, hardcoded front ic.");
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
        $scope.showFront = false;
        $scope.$apply();
      }

      function onFail(message) {
        //alert('Failed because: ' + message);
        $scope.showFront = true;
        $scope.$apply();
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
        }
        else {
          image.src = "base64";
          alert("No Camera Detected, hardcoded backic");
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
        $scope.showBack = false;
        $scope.$apply();
      }

      function onFail(message) {
        //alert('Failed because: ' + message);
        $scope.showBack = true;
        $scope.$apply();
      }
    }

    $scope.deletePhotoBack = function() {
      var image = document.getElementById('backic');
      image.style.dispay = 'block';
      image.src = "";
      $scope.showBack = true;
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
