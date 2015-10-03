angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
    	$scope.transportName=[];
      	$scope.transportDateTimeStart=[];
    	if(window.localStorage.getItem("loginUserContactNumber") != null) {
        $scope.phone = window.localStorage.getItem("loginUserContactNumber");
        }
        else {
          $state.go('login', {}, {reload: true});
        }

       	var urlString = "http://localhost/AddUserAccount.php?phone="+$scope.phone;
        
       	$http.get(urlString)
      	.success(function (data) {
        var transportDetails = data;

        if (!transportDetails){
        	for(var i = 0; i<transportDetails.length; i++){
        		if(transportDetails[i].TransportID != null && transportDetails[i].ActivityName && transportDetails[i].DateTimeStart){
        			$scope.transportID.push(transportDetails[i].TransportID);
        			$scope.transportName.push(transportDetails[i].ActivityName);
              		$scope.transportDateTimeStart.push("Date/Time: " + $scope.temp[0] + " | " + $scope.temp[1]);
        		}
        	}
        }
  })
});
