angular.module('crowdsourcing')

    .controller('homeController', function ($scope, $ionicPopup, $state, $http, $ionicPopover, $ionicHistory, $timeout) {
      if(typeof cordova != 'undefined'){
        cordova.plugins.diagnostic.isLocationEnabled(function(enabled){
          if(!enabled)
          {
            $state.go('login', {}, {reload: true});
            var myPopup = $ionicPopup.show({
              title: '<b>Notice</b>',
              subTitle: 'No location services detected. Please enable before using iCare.',
              scope: $scope,
              buttons: [
                {
                  text: 'Proceed to Location Services',
                  type: 'button-calm',
                  onTap: function(e) {
                    cordova.plugins.diagnostic.switchToLocationSettings();
                  }
                },
              ]
            });
          }
        }, function(error){
          alert("The following error occurred: "+error);
        });
      }

      $scope.transportActivity = [];
      $scope.loadingshow = true;
      var getLocation = false;

      //NOTE BACKEND DEVELOPERS: remove latlng global vars from other logout function when stable
    if(window.localStorage.getItem("userLat") == null) {
      navigator.geolocation.getCurrentPosition(function (pos) {
        window.localStorage.setItem("userLat", pos.coords.latitude);
        window.localStorage.setItem("userLong", pos.coords.longitude);
        getLocation = true;
      });
    }
    else {
      getLocation = true;
    }

      $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveRecommendedTransportActivity.php?limit=2")
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null) {
            for(var i = 0; i<transportDetails.length; i++)
            {
              if(transportDetails[i].activity_id != null && transportDetails[i].name && transportDetails[i].datetime_start)
              {
                //calculate distance & format date/time
                var t = transportDetails[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                var name = transportDetails[i].name.split('-');

                 //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: i + 1,
                  id: transportDetails[i].activity_id,
                  start:name[0].trim(),
                  end:name[1].trim(),
                  dateTime: dateTime,
                  name: transportDetails[i].name
                });
              }
            }
          }

          //to check that application also got user location
          if(getLocation == true) {
            $scope.loadingshow = false;
          }
        })

      $scope.scan = function () {
        $state.go('scan', {}, {reload: true});
      }

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

    });
