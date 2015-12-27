angular.module('crowdsourcing')

    .controller('listTransportController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
      $scope.transportActivity = [];
      $scope.loadingshow = true;
      $scope.transportIds = $stateParams.transportIds;
      var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      var ids = [];
      var number = 0;

      if($scope.transportIds != null)
      {
        ids = $scope.transportIds.split(',');
      }

    $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveTransportActivity.php")
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null) {
          for(var i = 0; i<transportDetails.length; i++)
          {
            if(transportDetails[i].activity_id != null && transportDetails[i].name!=null && transportDetails[i].datetime_start!=null)
            {
              if(ids.indexOf(transportDetails[i].activity_id) !== -1) {
                //format date/time
                var t = transportDetails[i].datetime_start.split(/[- :]/);
                var dateTime = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);

                //format date to be use for searching
                var dd = dateTime.getDate();
                var mm = dateTime.getMonth();
                var yyyy = dateTime.getFullYear();
                var date = dd + ' ' + monthNames[mm]+ ' ' + yyyy;

                //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: ++number,
                  id: transportDetails[i].activity_id,
                  name: transportDetails[i].name,
                  date: date,
                  dateTime:dateTime
                });
              }
            }
          }
        }
        $scope.loadingshow = false;
      })

      $scope.proceed = function(id, name)
      {
        $state.go('activityDetails', {transportId: id, transportActivityName: name});
      }

      //toggle search criteria
      $scope.show = true;
      var check = "0";
      $scope.toggleSearchOption = function()
      {
        if(check == "0"){
          $scope.show = false;
          check = "1";
          $scope.searchText = "";
        }
        else {
          $scope.show = true;
          check = "0";
          $scope.searchText = "";
        }
      }

    //custom filter
    $scope.searchFilter = function(obj) {
      var date;

      if($scope.searchText != null) {
        var dd = $scope.searchText.getDate();
        var mm = $scope.searchText.getMonth();
        var yyyy = $scope.searchText.getFullYear();

        date = dd + ' ' + monthNames[mm]+ ' ' + yyyy;
      }

      var re = new RegExp(date, 'i');
      return !date || re.test(obj.date);
    };

    $scope.goBack = function()
    {
      $ionicHistory.goBack();
    }
    });
