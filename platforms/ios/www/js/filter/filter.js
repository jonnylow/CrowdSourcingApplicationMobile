angular.module('crowdsourcing')

    .controller('filterController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $stateParams) {
      if ($stateParams.filter != null) {
        $scope.id = window.localStorage.getItem("loginId");
        $scope.filter = $stateParams.filter;
        $scope.loadingshow = true;
      }

      if($scope.filter != null)
      {
        $scope.filterListDisplay = [];

        if($scope.filter == 'Start Location')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=start")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].location_from != null) {
                      var locationFrom = results[i].location_from;

                      $scope.filterListDisplay.push({textShown:locationFrom, checked:false});
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
        else if($scope.filter == 'End Location')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=end")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].location_to != null) {
                      var locationTo = results[i].location_to;

                      $scope.filterListDisplay.push({textShown:locationTo, checked:false});
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
        else if($scope.filter == 'Time')
        {
          $http.get("http://www.changhuapeng.com/volunteer/php/RetrieveFilter.php?filter=time")
            .success(function (data) {
              var results = data;

              if (results != null) {
                for (var i = 0; i < results.length; i++){

                  if (results[i] != null) {
                    if (results[i].time != null) {
                      var timeStart = results[i].time;

                      $scope.filterListDisplay.push({textShown:timeStart, checked:false});
                    }
                  }
                }
              }
              $scope.loadingshow = false;
            })
        }
      }
    });
