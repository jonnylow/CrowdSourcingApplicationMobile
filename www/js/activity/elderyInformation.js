angular.module('crowdsourcing')

    .controller('elderyInformationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading, apiUrl) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.backView = $ionicHistory.backView();
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }
    $http.get("http://changhuapeng.com/laravel/api/retrieveElderyInformation?transportId=" + $scope.transportId)
      .success(function (data) {
        var elderyInformation = data;
        if (elderyInformation != null) {
          if(elderyInformation != null)
          {
            if(elderyInformation.elderly.name != null && elderyInformation.elderly.next_of_kin_name != null
              && elderyInformation.elderly.next_of_kin_contact !=null )
            {
                $scope.name= elderyInformation.elderly.name;
                $scope.gender=elderyInformation.elderly.gender;
                $scope.medical=elderyInformation.elderly.medical_condition;
                if($scope.medical == "")
                {
                  $scope.medical = "No Medical Information";
                }
                $scope.languages=elderyInformation.elderly.languages;
                if($scope.languages == "")
                {
                  $scope.languages = "No Language Information";
                }
                $scope.kin=elderyInformation.elderly.next_of_kin_name;
                $scope.contact=elderyInformation.elderly.next_of_kin_contact;
              $scope.loadingshow = false;
              $ionicLoading.hide();
            }
          }
        }
      })

    $scope.back=function()
    {
      if($scope.backView != null)
      {
        $scope.backView.go();
      }
      else
      {
        $state.go('tab.home', {}, {reload: true});
      }
      //$ionicHistory.goBack();
    }

});
