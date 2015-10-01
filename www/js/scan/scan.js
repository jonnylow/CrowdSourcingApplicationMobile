angular.module('crowdsourcing')

    .controller('scanController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.myLocation = {lng : '', lat: ''};
        $scope.transportID=[];
        $scope.transportName=[];
        $scope.transportDateTimeStart=[];
        $scope.transportFromDistance=[];
        $scope.markers = [];

      //plot map
        if($scope.transportID != null && $scope.transportName != null && $scope.transportDateTimeStart !=null) {
          $scope.drawMap = function (position) {
            //$scope.$apply is needed to trigger the digest cycle when the geolocation arrives and to update all the watchers
            $scope.$apply(function () {
              $scope.myLocation.lng = position.coords.longitude;
              $scope.myLocation.lat = position.coords.latitude;

              $scope.map = {
                center: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                },
                zoom: 11,
                pan: 1
              };

              var currentLocationMarker = {
                id: 0,
                coords: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                }
              };

              $scope.markers.push(currentLocationMarker);
            });
          }

          //retrieve from DB
          $http.get("http://localhost/RetrieveTransportActivity.php")
            .success(function (data) {
              var transportDetails = data;

              if (transportDetails != null) {
                for(var i = 0; i<transportDetails.length; i++)
                {
                  if(transportDetails[i].TransportID != null && transportDetails[i].ActivityName && transportDetails[i].DateTimeStart
                    && transportDetails[i].LocationFromLat !=null && transportDetails[i].LocationFromLong != null)
                  {
                    //calculate distance & format date/time
                    $scope.temp =transportDetails[i].DateTimeStart.split(' ');
                    var from = new google.maps.LatLng($scope.myLocation.lat, $scope.myLocation.lng);
                    var to = new google.maps.LatLng(parseFloat(transportDetails[i].LocationFromLat), parseFloat(transportDetails[i].LocationFromLong));
                    var m = google.maps.geometry.spherical.computeDistanceBetween(from, to).toFixed(2);
                    var km = (m/1000).toFixed(2);

                    $scope.transportID.push(transportDetails[i].TransportID);
                    $scope.transportName.push(transportDetails[i].ActivityName);
                    $scope.transportDateTimeStart.push("Date/Time: " + $scope.temp[0] + " | " + $scope.temp[1]);
                    $scope.transportFromDistance.push(m + " m" + " OR "+ km);


                    var tempMarker = {
                      id: i+1,
                      coords: {
                        latitude: parseFloat(transportDetails[i].LocationFromLat),
                        longitude: parseFloat(transportDetails[i].LocationFromLong)
                      }
                    };
                    $scope.markers.push(tempMarker);
                  }
                }
              }
            })

          navigator.geolocation.getCurrentPosition($scope.drawMap);
        }
    });
