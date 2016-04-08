/**
 * This js script will handle all logic for showing user's activity. Its corresponding html file is myhistory.html.
 * The main purpose of this page is just to handle any logic when displaying activities information for a user.
 */

angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {
    //Store the backview page in a storage to be use later on
        if ($ionicHistory.backView() != null) {
          $scope.backView = $ionicHistory.backView();
        }

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
          $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
        }
        else {
          $state.go('landingPage', {}, {reload: true});
        }

    if(window.localStorage.getItem("loginUserName") != null) {
      //put whole codes into method, so that 'Refresh' function could call this function
      $scope.toLoad = function()
      {
        $scope.groups = [];
        //create the different array for the different grouping base on the status
        $scope.groups.push({name: "Completed", items: []});
        $scope.groups.push({name: "Pending", items: []});
        $scope.groups.push({name: "Rejected/Withdrawn", items: []});

        //call web service to get activity from the user base on current or past dates.
        var urlString = apiUrl+"retrieveTransportByUser?id=" +$scope.id+"&type=2";

        $http.get(urlString,{timeout: 12000})
          .success(function (data) {
            var transportDetails = data;

            //web service will return all activity details in an array, and information will be placed in the respective array to be displayed at the input fields of the html
            if (transportDetails != null){
              //loop each activity
              for(var i = 0; i<transportDetails.activities.length; i++){

                if(transportDetails.activities[i].activity_id != null){
                  var t = transportDetails.activities[i].datetime_start.split(/[- :]/);
                  var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                  //based on the different status, push different activity to the array
                  if(transportDetails.task[i].approval == "approved" && transportDetails.task[i].status== "completed")
                  {
                    $scope.groups[0].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Completed"});
                  }
                  else
                  {
                    var currentDateTime = new Date();
                    if(dateTime < currentDateTime)
                    {
                      if(transportDetails.task[i].approval == "withdrawn") {
                        $scope.groups[2].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
                      }
                      else if(transportDetails.task[i].approval == "rejected")
                      {
                        $scope.groups[2].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
                      }
                      else if(transportDetails.task[i].approval == "pending")
                      {
                        $scope.groups[1].items.push({elderlyIntials:getInitials(transportDetails.activities[i].elderly.name), id:transportDetails.activities[i].activity_id, from:transportDetails.activities[i].departure_centre.name, to:transportDetails.activities[i].arrival_centre.name, name:transportDetails.activities[i].departure_centre.name + " - " + transportDetails.activities[i].arrival_centre.name, dateTime:dateTime, statusDisplay:"Not Applicable"});
                      }
                    }
                  }
                }
              }
            }
            //sort all the activity in the groups base on dates
            $scope.groups[0].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
            $scope.groups[1].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
            $scope.groups[2].items.sort(function (a, b) {
              return ((a.dateTime < b.dateTime) ? -1 : ((a.dateTime == b.dateTime) ? 0 : 1));
            });
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
          })
          .finally(function() {
            // Stop the ion-refresher from spinning
            $scope.$broadcast('scroll.refreshComplete');
          });
      }

      //this method will be run at the first load
      $scope.toLoad();

      //this method is to handle the toggling of the groups
      $scope.toggleGroup = function(group) {
        if ($scope.isGroupShown(group)) {
          $scope.shownGroup = null;
        } else {
          $scope.shownGroup = group;
        }
      };
      $scope.isGroupShown = function(group) {
        return $scope.shownGroup === group;
      };

      //this function will direct the user to the activity details of the particular activity
      $scope.proceed = function(id, name)
      {
        $state.go('myPastActivityDetails', {transportId: id, transportActivityName: name});
      }

      //this function will direct user to the current tab
      $scope.goCurrent = function()
      {
        $ionicHistory.nextViewOptions({
          disableAnimate: true
        });
        $state.go('tab.activity');
      }

      //function to get initials of a string
      function getInitials(string) {
        var names = string.split(' '),
          initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
          initials += "." + names[names.length - 1].substring(0, 1).toUpperCase();
        }
        return initials;
      }
    }
});
