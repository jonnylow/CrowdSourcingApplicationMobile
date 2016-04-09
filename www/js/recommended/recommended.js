/**
 * This js script will handle all logic for recommended. Its corresponding html file is recommended.html.
 * The main purpose of this page is just to handle any logic for the content when displaying recommended information
 * */

 angular.module('crowdsourcing')

    .controller('recommendedController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams, $ionicLoading, apiUrl, $ionicHistory) {

     //Store the backview page in a storage to be use later on
    if ($ionicHistory.backView() != null) {
      $scope.backView = $ionicHistory.backView();
    }

     $scope.elderlyName = [];
      $scope.transportActivity = [];
      $scope.loadingshow = true;
      $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})

     //get max of 5 recommended activity and different url based on user login
    var url = "";
    if(window.localStorage.getItem("token") != null)
    {
      url = apiUrl+"retrieveRecommendedTransportActivity?limit=5&token="+window.localStorage.getItem("token");
    }
    else
    {
      url = apiUrl+"retrieveRecommendedTransportActivity?limit=5";
    }

     //get information from the web service and display the activity on the input fields of the web service
    $http.get(url,{timeout: 12000})
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.activities.length; i++)
          {
            if(transportDetails.activities[i].activity_id != null)
            {
              $http.get(apiUrl + "retrieveElderyInformation?transportId=" + transportDetails.activities[i].activity_id, {timeout: 12000})
                .success(function (data) {
                  if(data != null)
                  {
                    $scope.elderlyName.push(getInitials(data.elderly.name));
                  }
                });

              //format date/time
              var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
              var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

               //push to arrays to store all activities in array (also use for displaying)
              $scope.transportActivity.push({
                no: i + 1,
                id: transportDetails.activities[i].activity_id,
                from:transportDetails.activities[i].departure_centre.name,
                to:transportDetails.activities[i].arrival_centre.name,
                name: transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name,
                dateTime: dateTime
              });
            }
          }
        }
        $scope.loadingshow = false;
        $ionicLoading.hide();
      })
      .error(function (data) {
        $scope.loadingshow = false;
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: '<h6 class="popups title">Whoops!</h6>',
          subTitle: '<br><h6 class="popups">Something went wrong. Please try again.</h6> ',
          scope: $scope,
          buttons: [
            {
              text: 'OK',
              type: 'button button-stable',
              onTap: function (e) {
                if ($scope.backView != null) {
                  $scope.backView.go();
                }
                else {
                  $state.go('landingPage', {}, {reload: true});
                }
              }
            },
          ]
        });
      });

     //method for user to proceed to activity details page
      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

     function getInitials(string) {
       var names = string.split(' '),
         initials = names[0].substring(0, 1).toUpperCase();

       if (names.length > 1) {
         initials += "." + names[names.length - 1].substring(0, 1).toUpperCase();
       }
       return initials;
     }
    });
