angular.module('crowdsourcing')

    .controller('scanController', function ($scope, $ionicPopup, $state, $http, $jrCrop, uiGmapGoogleMapApi, $ionicLoading,apiUrl, $ionicModal, $ionicHistory) {
        //use for conversion of dates
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        //user location, get from global var or have to reacquire if null
        $scope.myLocation = {lng : '', lat: ''};
        if(window.localStorage.getItem("userLat") != null && window.localStorage.getItem("userLong") != null)
        {
          $scope.myLocation.lng = window.localStorage.getItem("userLong");
          $scope.myLocation.lat = window.localStorage.getItem("userLat");
        }

        $scope.showTag = false;
        $scope.zoom = 11;
        $scope.center = {latitude: $scope.myLocation.lat,longitude: $scope.myLocation.lng};

        //store all activities data
        $scope.transportID=[];
        $scope.transportName=[];
        $scope.transportLocationFrom=[];
        $scope.transportLocationTo=[];
        $scope.transportDateTimeStart=[];

        //this array is use to track markers duplication. Is not in sync with the rest of the array above
        $scope.transportLocationFromLatLng=[];
        $scope.transportDistanceFromLatLng=[];
        $scope.transportTimeFromLatLng = [];

        //store all markers for transport activities
        $scope.markers = [];
        $scope.markersStatus = [];

        //for dynamic displaying
        $scope.transportActivity = [];

        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

        //variables for the sort nearby button
        var sorted = false;
        var current = 0;
        var tempArray = [];
        $scope.distanceDisplay = "Distance from Current Location: - ";
        $scope.timeDisplay = "Estimated Driving Distance: - ";

        var directionsService = new google.maps.DirectionsService();

        //plot map
        if($scope.transportID != null && $scope.transportName != null && $scope.transportDateTimeStart !=null) {
          uiGmapGoogleMapApi.then(function (maps) {

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

            //map configuration
            $scope.map = {
              zoom: 11,
              pan: 1,
              "options": {
                "zoomControl": false,
                "mapTypeControl": false,
                "streetViewControl": false,
                "draggable": true,
                "optimized": true,
                "scrollwheel": false
              }
            };

            //radius circle
            $scope.circles = [
              {
                id: 1,
                center: {
                  latitude: $scope.myLocation.lat,
                  longitude: $scope.myLocation.lng
                },
                radius: 1000,
                stroke: {
                  color: '#08B21F',
                  weight: 2,
                  opacity: 1
                },
                fill: {
                  color: '#08B21F',
                  opacity: 0.5
                }
              }
            ];

            $scope.showTag = true;

            //retrieve from DB
            var urlToRun = "";
            if(window.localStorage.getItem("token") != null)
            {
              urlToRun = "http://changhuapeng.com/laravel/api/retrieveTransportActivity?token="+window.localStorage.getItem("token");
            }
            else
            {
              urlToRun = "http://changhuapeng.com/laravel/api/retrieveTransportActivity";
            }

            $http.get(urlToRun)
              .success(function (data) {
                var transportDetails = data;

                if (transportDetails != null) {
                  for (var i = 0; i < transportDetails.activities.length; i++) {
                    if (transportDetails.activities[i].activity_id != null) {

                      //format date/time
                      var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                      var dateTime = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]);

                      var from = new google.maps.LatLng($scope.myLocation.lat, $scope.myLocation.lng);
                      var to = new google.maps.LatLng(parseFloat(transportDetails.activities[i].departure_centre.lat), parseFloat(transportDetails.activities[i].departure_centre.lng));

                      //push each activities into the main arrays that store all activities
                      $scope.transportID.push(transportDetails.activities[i].activity_id);
                      $scope.transportLocationFrom.push(transportDetails.activities[i].departure_centre.name);
                      $scope.transportLocationTo.push(transportDetails.activities[i].arrival_centre.name);
                      $scope.transportName.push(transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name);
                      $scope.transportDateTimeStart.push(dateTime);

                      //check if marker already exists (by checking with the markers array)
                      //if exists skip this marker, if it is a new position, add this new marker
                      if ($scope.markerExist([parseFloat(transportDetails.activities[i].departure_centre.lat), parseFloat(transportDetails.activities[i].departure_centre.lng)]) == false) {
                        $scope.transportLocationFromLatLng.push([parseFloat(transportDetails.activities[i].departure_centre.lat), parseFloat(transportDetails.activities[i].departure_centre.lng)])
                        getDistanceMarker(from, to);

                        var tempMarker = {
                          id: i + 1,
                          coords: {
                            latitude: parseFloat(transportDetails.activities[i].departure_centre.lat),
                            longitude: parseFloat(transportDetails.activities[i].departure_centre.lng)
                          },
                          "window": {
                            "title": transportDetails.activities[i].departure_centre.name
                          }
                        };
                        $scope.markers.push(tempMarker);
                        $scope.markersStatus.push(false);
                      }
                    }
                  }
                  $scope.loadingshow = false;
                  $ionicLoading.hide();
                }
              })
          });
        }

          //function to get driving distance and time from google map service (marker)
          function getDistanceMarker(from, to) {
            var request = {
              origin:from,
              destination:to,
              travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

            directionsService.route(request, function(response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                var distance = (response.routes[0].legs[0].distance.value / 1000).toFixed(2);
                var time = (response.routes[0].legs[0].duration.value / 60).toFixed(0);
                $scope.transportDistanceFromLatLng.push(distance);
                $scope.transportTimeFromLatLng.push(time);
              }
              else if (status === google.maps.DirectionsStatus.OVER_QUERY_LIMIT)
              {
                setTimeout(function() {
                  getDistanceMarker(from,to);
                }, 100);
              }
            });
          }


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
      $scope.displayItems = function(locationFrom, markerIndex)
      {
        $scope.toDisplayLocationFrom = locationFrom;
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

        //check for sort
        if(sorted ==false) {
          for (var i = 0; i < $scope.transportLocationFromLatLng.length; i++) {
            tempArray.push({
              distance: $scope.transportDistanceFromLatLng[i],
              time: $scope.transportTimeFromLatLng[i],
              location: $scope.transportLocationFromLatLng[i],
              marker: $scope.markers[i]
            });
          }

          tempArray.sort(function (a, b) {
            return ((a.distance < b.distance) ? -1 : ((a.distance == b.distance) ? 0 : 1));
          });
          sorted = true;
        }

        //update the markers
        if(tempArray.length!=0) {
          for (var g = 0; g < tempArray.length; g++) {
            if(tempArray[g].marker.window.title==locationFrom)
            {
              current = g;
              $scope.focusNearbyIncrease();
            }
          }
        }
        $scope.loadingshow = false;
        $ionicLoading.hide();
      }

      //proceed to activity details page
      $scope.proceed = function(id, name)
      {
        $scope.modal.hide();
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

      $scope.goList = function()
      {
        $scope.modal.searchText='';
        $scope.modal.show();
      }

      $scope.focusNearbyIncrease = function()
      {
        //does the sorting of distance
        if(sorted ==false) {
          for (var i = 0; i < $scope.transportLocationFromLatLng.length; i++) {
            tempArray.push({
              distance: $scope.transportDistanceFromLatLng[i],
              time: $scope.transportTimeFromLatLng[i],
              location: $scope.transportLocationFromLatLng[i],
              marker: $scope.markers[i]
            });
          }

          tempArray.sort(function (a, b) {
            return ((a.distance < b.distance) ? -1 : ((a.distance == b.distance) ? 0 : 1));
          });
          sorted = true;
        }

        //handle marker windows
        for(var j = 0; j<$scope.markersStatus.length; j++)
        {
          $scope.markersStatus[j] = false;
        }

        for(var a = 0; a<$scope.markers.length; a++)
        {
          if($scope.markers[a].id == tempArray[current].marker.id)
          {
            //marker windows display
            $scope.markersStatus[a] = true;
            $scope.toDisplayLocationFrom = tempArray[current].marker.window.title;

            //handle dynamic display
            if(tempArray[current].marker.window.title!= null)
            {
              $scope.showTag = false;

              //clear display list
              $scope.transportActivity = [];
              var number = 0;

              //loop through the transportLocationFrom (name of pickup), if it is the same, copy to the display list of arrays to show on list
              for(var i =0; i<$scope.transportLocationFrom.length; i++)
              {
                var tempLocFrom = $scope.transportLocationFrom[i];
                if(tempLocFrom == tempArray[current].marker.window.title)
                {
                  //format date to be use for searching
                  var dd = $scope.transportDateTimeStart[i].getDate();
                  var mm = $scope.transportDateTimeStart[i].getMonth();
                  var yyyy = $scope.transportDateTimeStart[i].getFullYear();
                  var date = dd + ' ' + monthNames[mm]+ ' ' + yyyy;

                  //push to arrays to store all activities in array (also use for displaying)
                  $scope.transportActivity.push({
                    no: ++number,
                    id: $scope.transportID[i],
                    from:$scope.transportLocationFrom[i],
                    to:$scope.transportLocationTo[i],
                    name: $scope.transportLocationFrom[i] + " - " + $scope.transportLocationTo[i],
                    date:date,
                    time:formatAMPM($scope.transportDateTimeStart[i]),
                    dateTime:$scope.transportDateTimeStart[i],
                    distance: tempArray[current].distance + "km away | Estimated driving time: " + tempArray[current].time + " mins"
                  });
                }
              }
            }
          }
        }

        //center marker
        $scope.center = {latitude: tempArray[current].location[0],longitude: tempArray[current].location[1]};
        $scope.distanceDisplay = "Distance from Current Location: " + tempArray[current].distance + " km ";
        $scope.timeDisplay = "Estimated Driving Distance: " + tempArray[current].time + " mins ";

        //increment current counter
        if(current != tempArray.length-1) {
          current++;
        }
        else
        {
          current = 0;
        }
      }

      $ionicModal.fromTemplateUrl('templates/scan/ListModal.html', function($ionicModal) {
        $scope.modal = $ionicModal;
      }, {
        // Use our scope for the scope of the modal to keep it simple
        scope: $scope,
        // The animation we want to use for the modal entrance
        animation: 'slide-in-up'
      });

      function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
    });
