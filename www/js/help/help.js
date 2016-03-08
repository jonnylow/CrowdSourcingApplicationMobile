angular.module('crowdsourcing')

    .controller('helpController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {

      $scope.groups = [];

      $scope.groups.push({name: "Do i have to stay for the whole duration?", answer: "Yes you have to. All transportation activities require volunteers to be with the senior all the way until they are safely brought back to the home and is accounted for."});
      $scope.groups.push({name: "How do I become a volunteer?", answer: "Sign up with CareGuide. If you are considered a potential candidate, a Volunteer coordinator will contact you for an interview. If you are selected as a potential candidate, the coordinator will schedule you to attend a volunteer orientation. Once successful, congratulations."});
      $scope.groups.push({name: "What are the types of volunteering activities available through NTUC Healthcare?", answer: "Currently we are in need of medical escorts. This activity requires a volunteer to escort our elderly residents for their medical appointment."});
      $scope.groups.push({name: "Why do volunteers need to go through volunteer orientation?", answer: "The volunteer orientation is a concise familiarization program designed to help you understand your contributions as a volunteer medical escort and the various areas that you can help out in.  Our program is specific to escort elderly residents to their medical appointments therefore, it is important to ensure volunteers are confident and able to handle elderly in a safe manner."});
      $scope.groups.push({name: "What is the criteria to be a volunteer?", answer: "Having the right motivation and purpose to volunteer. New volunteers are interviewed to ensure they are physically fit and of good character. "});
      


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
