/**
 * This js script will handle all logic for elderlyInformation. Its corresponding html file is elderlyInformation.html.
 * The main purpose of this page is just to handle any logic when displaying elderly information.
 */
angular.module('crowdsourcing')

    .controller('elderyInformationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

    //get activity id and name from the url
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.transportActivityDate = new Date($stateParams.transportActivityDate);
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }
    //call the web service to get details based on the id retrieve from the url parameters
    //after which display the information on the respective input fields in the html file
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $http.get(apiUrl + "retrieveElderyInformation?transportId=" + $scope.transportId, {timeout: 12000})
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
                //handle multiple languages
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

      //back function. To redirect user back to previous page, depending where the user came from, page retrieve as soon as this page is loaded
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
