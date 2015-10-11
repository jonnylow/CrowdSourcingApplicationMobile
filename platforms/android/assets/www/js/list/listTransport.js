angular.module('crowdsourcing')

    .controller('listTransportController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
      $scope.myLocation = {lng : '', lat: ''};
      $scope.transportID=[];
      $scope.transportName=[];
      $scope.transportDateStart=[];
      $scope.transportTimeStart=[];
      $scope.transportFromDistance=[];

    $scope.getLocation= function (position) {
      $scope.$apply(function () {
        $scope.myLocation.lng = position.coords.longitude;
        $scope.myLocation.lat = position.coords.latitude;
      });
    }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveTransportActivity.php")
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.length; i++)
          {
            if(transportDetails[i].activity_id != null && transportDetails[i].name && transportDetails[i].datetime_start)
            {
              //calculate distance & format date/time
              $scope.temp =transportDetails[i].datetime_start.split(' ');
              var from = new google.maps.LatLng($scope.myLocation.lat, $scope.myLocation.lng);
              var to = new google.maps.LatLng(parseFloat(transportDetails[i].location_from_lat), parseFloat(transportDetails[i].location_from_long));
              var m = google.maps.geometry.spherical.computeDistanceBetween(from, to).toFixed(2);
              var km = (m/1000).toFixed(2);

              //push to arrays to store all activities in array (also use for displaying)
              $scope.transportID.push(transportDetails[i].activity_id);
              $scope.transportName.push(transportDetails[i].name);
              $scope.transportDateStart.push("Date: " + $scope.temp[0]);
              $scope.transportTimeStart.push("Time: " + $scope.temp[1]);
              $scope.transportFromDistance.push(m + " m" + " OR "+ km + " km");
            }
          }
        }
      })

      navigator.geolocation.getCurrentPosition($scope.getLocation);

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }
    });
