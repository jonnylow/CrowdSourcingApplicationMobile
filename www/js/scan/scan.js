angular.module('crowdsourcing')

    .controller('scanController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.myLocation = {lng : '', lat: ''};

        //store all activities data
        $scope.transportID=[];
        $scope.transportName=[];
        $scope.transportLocationFrom=[];
        $scope.transportDateTimeStart=[];
        $scope.transportFromDistance=[];

        //this array is use to track markers duplication. Is not in sync with the rest of the array above
        $scope.transportLocationFromLatLng=[];

        //store all markers for transport activities
        $scope.markers = [];

        //for dynamic displaying
        $scope.transportIDDisplay=[];
        $scope.transportNameDisplay=[];
        $scope.transportDateTimeStartDisplay=[];
        $scope.transportFromDistanceDisplay=[];

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

              //plot marker for 'mylocation'
              $scope.currentLocationMarker = {
                id: 0,
                coords: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                },
                "window": {
                  "title": "Current Location"
                }
              };
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
                    && transportDetails[i].LocationFromLat !=null && transportDetails[i].LocationFromLong != null) {

                    //calculate distance in M and KM to 2dp & format date/time
                    $scope.temp = transportDetails[i].DateTimeStart.split(' ');
                    var from = new google.maps.LatLng($scope.myLocation.lat, $scope.myLocation.lng);
                    var to = new google.maps.LatLng(parseFloat(transportDetails[i].LocationFromLat), parseFloat(transportDetails[i].LocationFromLong));
                    var m = google.maps.geometry.spherical.computeDistanceBetween(from, to).toFixed(2);
                    var km = (m / 1000).toFixed(2);

                    //push each activities into the main arrays that store all activities
                    $scope.transportID.push(transportDetails[i].TransportID);
                    $scope.transportName.push(transportDetails[i].ActivityName);
                    $scope.transportLocationFrom.push(transportDetails[i].LocationFrom);
                    $scope.transportDateTimeStart.push("Date/Time: " + $scope.temp[0] + " | " + $scope.temp[1]);
                    $scope.transportFromDistance.push(m + " m" + " OR "+ km + " km");

                    //check if marker already exists (by checking with the markers array)
                    //if exists skip this marker, if it is a new position, add this new marker
                    if ($scope.markerExist([parseFloat(transportDetails[i].LocationFromLat), parseFloat(transportDetails[i].LocationFromLong)]) == false) {
                      $scope.transportLocationFromLatLng.push([parseFloat(transportDetails[i].LocationFromLat), parseFloat(transportDetails[i].LocationFromLong)])

                      var tempMarker = {
                        id: i + 1,
                        coords: {
                          latitude: parseFloat(transportDetails[i].LocationFromLat),
                          longitude: parseFloat(transportDetails[i].LocationFromLong)
                        },
                        "window": {
                          "title": transportDetails[i].LocationFrom
                        }
                      };
                      $scope.markers.push(tempMarker);
                    }
                  }
                }
              }
            })

          navigator.geolocation.getCurrentPosition($scope.drawMap);

          //check if marker already exist in the marker array
          $scope.markerExist = function(search)
          {
              for (var i = 0; i<$scope.transportLocationFromLatLng.length; i++) {
                if ($scope.transportLocationFromLatLng[i][0] === search[0] && $scope.transportLocationFromLatLng[i][1] === search[1]) {
                  return true;
                }
              }
              return false;
          }

          //refresh list of activities each time marker is click
          $scope.displayItems = function(locationFrom)
          {
            if(locationFrom != null)
            {
              //clear display list
              $scope.transportIDDisplay=[];
              $scope.transportNameDisplay=[];
              $scope.transportDateTimeStartDisplay=[];
              $scope.transportFromDistanceDisplay=[];

              //loop through the transportLocationFrom (name of pickup), if it is the same, copy to the display list of arrays to show on list
              for(var i =0; i<$scope.transportLocationFrom.length; i++)
              {
                var tempLocFrom = $scope.transportLocationFrom[i];
                if(tempLocFrom == locationFrom)
                {
                  $scope.transportIDDisplay.push($scope.transportIDDisplay[i]);
                  $scope.transportNameDisplay.push($scope.transportName[i]);
                  $scope.transportDateTimeStartDisplay.push($scope.transportDateTimeStart[i]);
                  $scope.transportFromDistanceDisplay.push($scope.transportFromDistance[i]);
                }
              }
            }
          }
        }
    });
