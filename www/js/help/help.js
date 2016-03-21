angular.module('crowdsourcing')

    .controller('helpController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover, $ionicLoading, apiUrl) {

      $scope.groups = [];

      $scope.groups.push({name: 'Do i have to stay for the whole duration?', answer: 'Yes you have to. All transportation activities require volunteers to be with the senior all the way until they are safely brought back to the home and is accounted for.'});
      $scope.groups.push({name: 'How do I become a volunteer?', answer: 'Sign up with CareGuide and your particulars will be sent to Centre For Seniors. If you are considered as a potential candidate, a volunteer coordinator will schedule you to attend a volunteer orientation. Once successful, congratulations.'});
      $scope.groups.push({name: 'What are the volunteers responsibilities for the activities?', answer: 'The volunteers are medical escorts who will accompany elderly residents to and from their medical appointments. They will be responsible to: a. Escort elderly residents to and from their medical appointments <br>b. Should be physically fit to wheel the elderly,c. Interact with the elderly,d. Wait for the elderly during the medical appointments.'});
      $scope.groups.push({name: 'Why do volunteers need to go through volunteer orientation?', answer: 'The volunteer orientation is a concise familiarization program designed to help you understand your contributions as a volunteer medical escort and the various areas that you can help out in.  Our program is specific to escort elderly residents to their medical appointments therefore, it is important to ensure volunteers are confident and able to handle elderly in a safe manner.'});
      $scope.groups.push({name: 'What is the criteria to be a volunteer?', answer: 'Having the right motivation and purpose to volunteer. New volunteers are interviewed to ensure they are physically fit and of good character. '});
      $scope.groups.push({name: 'How are the points calculated?', answer: 'Each point corresponds to an hour volunteered using CareGuide.  eg: 3 hours = 3 points, 2.5hours = 2 points.'});
      $scope.groups.push({name: 'What is the purpose for updating the activities’ transport statuses throughout the medical appointment?', answer: 'Medical escorts will be required to update transport activity status on CareGuide. In this way, the staff at the Home will be able to keep track of your current transport status so that they will know the current location of the elderly.'});
      $scope.groups.push({name: 'What are the different activities’ transport statuses that volunteers are required to update and when do they have to update?', answer: 'There are 4 activities’ transport statuses on CareGuide:Picked Up - Update this status after the volunteer pick up the elderly from the home.At Check Up - Update this status after the volunteer arrive at the medical appointment location. Check Up Completed - Update this status after the elderly has completed all medical checks.Completed - Update this status after the volunteer has accompanied the elderly back to the home.'});
      $scope.groups.push({name: 'What are the types of volunteering activities available through NTUC Healthcare?', answer: 'Currently we are in need of medical escorts. These voluntary activities require volunteers to accompany our elderly residents to and from their medical appointments.'});
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
