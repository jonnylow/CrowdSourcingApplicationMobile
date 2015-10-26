angular.module('crowdsourcing')

    .controller('elderyInformationController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    if ($stateParams.transportId != null && $stateParams.transportActivityName != null) {
      $scope.transportId= $stateParams.transportId;
      $scope.transportActivityName = $stateParams.transportActivityName;
      $scope.loadingshow = true;
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveElderyInformation.php?transportId=" + $scope.transportId)
      .success(function (data) {
        var elderyInformation = data;

        if (elderyInformation != null) {
          if(elderyInformation[0] != null)
          {
            if(elderyInformation[0].elderly_name != null && elderyInformation[0].senior_centre_name != null && elderyInformation[0].next_of_kin_name != null
              && elderyInformation[0].next_of_kin_contact !=null )
            {
                $scope.name= elderyInformation[0].elderly_name;
                $scope.branchName=elderyInformation[0].senior_centre_name;
                $scope.kin=elderyInformation[0].next_of_kin_name;
                $scope.contact=elderyInformation[0].next_of_kin_contact;
              $scope.loadingshow = false;
            }
          }
        }
      })

    $scope.back=function()
    {
      $ionicHistory.goBack();
    }

});
