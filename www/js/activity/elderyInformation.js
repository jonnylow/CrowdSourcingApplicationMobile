angular.module('crowdsourcing')

    .controller('elderyInformationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicLoading) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.id = window.localStorage.getItem("loginId");
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveElderyInformation.php?transportId=" + $scope.transportId)
      .success(function (data) {
        var elderyInformation = data;
        if (elderyInformation != null) {
          if(elderyInformation[0] != null)
          {
            if(elderyInformation[0].name != null && elderyInformation[0].next_of_kin_name != null
              && elderyInformation[0].next_of_kin_contact !=null )
            {
                $scope.name= elderyInformation[0].name;
                $scope.gender=elderyInformation[0].gender;
                $scope.medical=elderyInformation[0].medical_condition;
                if($scope.medical == "")
                {
                  $scope.medical = "No Medical Information";
                }
                $scope.languages=elderyInformation[0].languages;
                if($scope.languages == "")
                {
                  $scope.languages = "No Language Information";
                }
                $scope.kin=elderyInformation[0].next_of_kin_name;
                $scope.contact=elderyInformation[0].next_of_kin_contact;
              $scope.loadingshow = false;
              $ionicLoading.hide();
            }
          }
        }
      })

    $scope.back=function()
    {
      $ionicHistory.goBack();
    }

});
