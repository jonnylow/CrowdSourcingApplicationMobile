angular.module('crowdsourcing')

    .controller('searchController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover) {
      $scope.transportActivity = [];
      $scope.loadingshow = true;

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
              var datesTemp = $scope.temp[0].split('-');

              //push to arrays to store all activities in array (also use for displaying)
              $scope.transportActivity.push({no:i+1,id:transportDetails[i].activity_id, name:transportDetails[i].name, date:datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0], time:$scope.temp[1]});
            }
          }
        }
        $scope.loadingshow = false;
      })


      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }


      $ionicPopover.fromTemplateUrl('templates/search/filter_popout.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });


      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      //Cleanup the popover when we're done with it!
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
    });
