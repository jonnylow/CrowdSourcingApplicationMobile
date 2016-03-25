angular.module('crowdsourcing')

    .controller('elderyInformationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.transportActivityDate = new Date($stateParams.transportActivityDate);
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $http.get(apiUrl + "retrieveElderyInformation?transportId=" + $scope.transportId, {timeout: 6000})
        .success(function (data) {
          var elderyInformation = data;

          if (elderyInformation != null) {
            if (elderyInformation != null) {
              if (elderyInformation.elderly.name != null && elderyInformation.elderly.next_of_kin_name != null
                && elderyInformation.elderly.next_of_kin_contact != null) {
                $scope.name = elderyInformation.elderly.name;
                $scope.gender = elderyInformation.elderly.gender;
                $scope.medical = elderyInformation.elderly.medical_condition;
                $scope.age = new Date().getFullYear() - parseInt(elderyInformation.elderly.birth_year);

                if ($scope.medical == "") {
                  $scope.medical = "No Medical Information";
                }

                $scope.languages = elderyInformation.elderly.languages;
                var languages = "";
                if ($scope.languages == "") {
                  $scope.languages = "No Language Information";
                }
                else {
                  for (var w = 0; w < $scope.languages.length; w++) {
                    if (w == 0) {
                      languages = $scope.languages[w].language;
                    }
                    else {
                      languages += ", " + $scope.languages[w].language;
                    }
                  }
                  $scope.languages = languages;
                }

                $scope.kin = elderyInformation.elderly.next_of_kin_name;
                $scope.contact = elderyInformation.elderly.next_of_kin_contact;
                $scope.loadingshow = false;
                $ionicLoading.hide();
              }
            }
          }
        })
        .error(function (data) {
          $scope.loadingshow = false;
          $ionicLoading.hide();
          var alertPopup = $ionicPopup.alert({
            title: '<h6 class="popups title">Whoops!</h6>',
            subTitle: '<br><h6 class="popups">Error in connection. Please try again.</h6> ',
            scope: $scope,
            buttons: [
              {
                text: 'OK',
                type: 'button button-stable',

              },
            ]
          });
        });

      $scope.back = function () {
        if ($scope.backView != null) {
          $scope.backView.go();
        }
        else {
          $state.go('tab.home', {}, {reload: true});
        }
        //$ionicHistory.goBack();
      }
    }
});
