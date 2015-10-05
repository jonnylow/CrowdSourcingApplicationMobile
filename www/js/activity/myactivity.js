angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
        $scope.transportID=[];
        $scope.transportName=[];
      	$scope.transportDateTimeStart=[];

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
        }
        else {
          $state.go('login', {}, {reload: true});
        }

       	var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=1";

       	$http.get(urlString)
      	.success(function (data) {
        var transportDetails = data;
        if (transportDetails != null){
        	for(var i = 0; i<transportDetails.length; i++){
        		if(transportDetails[i].activity_id != null && transportDetails[i].name && transportDetails[i].datetime_start){
              var temp =transportDetails[i].datetime_start.split(' ');
        			$scope.transportID.push(transportDetails[i].activity_id);
        			$scope.transportName.push(transportDetails[i].name);
              $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
        		}
        	}
        }
  })
});
