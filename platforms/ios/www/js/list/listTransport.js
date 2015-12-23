angular.module('crowdsourcing')

    .controller('listTransportController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory) {
      $scope.transportActivity = [];
      $scope.loadingshow = true;
      $scope.transportIds = $stateParams.transportIds;
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
            if(transportDetails[i].activity_id != null && transportDetails[i].name && transportDetails[i].datetime_start)
            {
              if(ids.indexOf(transportDetails[i].activity_id) !== -1) {
                //format date/time
                $scope.temp = transportDetails[i].datetime_start.split(' ');
                var datesTemp = $scope.temp[0].split('-');

                //push to arrays to store all activities in array (also use for displaying)
                $scope.transportActivity.push({
                  no: ++number,
                  id: transportDetails[i].activity_id,
                  name: transportDetails[i].name,
                  date: datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0],
                  time: $scope.temp[1]
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
        var mm = $scope.searchText.getMonth() + 1;
        var yyyy = $scope.searchText.getFullYear();

        if (dd < 10) {
          dd = '0' + dd
        }
        if (mm < 10) {
          mm = '0' + mm
        }
        date = dd + '-' + mm + '-' + yyyy;
      }

        var re = new RegExp(date, 'i');
        return !date || re.test(obj.date);
    };

    $scope.goBack = function()
    {
      $ionicHistory.goBack();
    }
    });
