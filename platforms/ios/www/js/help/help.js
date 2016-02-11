angular.module('crowdsourcing')

    .controller('helpController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {

      $scope.groups = [];

      $scope.groups.push({name: "Do i have to stay for the whole duration?", answer: "Yes you have to. All transportation activities require volunteers to be with the senior all the way until they are safely brought back to the home and is accounted for."});
      $scope.groups.push({name: "How do i withdraw from an activity?", answer: "Coming Soon ..."});
      $scope.groups.push({name: "Why is this just for Henderson Home?", answer: "Coming Soon ..."});
      $scope.groups.push({name: "Who do i contact in case of any emergency?", answer: "Coming Soon ..."});


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


});
