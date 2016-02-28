angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicPopover, $ionicHistory, $timeout, $ionicLoading, apiUrl) {
      if(window.localStorage.getItem("loginUserName") != null) {
        $scope.name = window.localStorage.getItem("loginUserName");
        $scope.id = window.localStorage.getItem("loginId");
        $scope.loadingshow = true;
        $ionicLoading.show({template: '<ion-spinner icon="spiral"/></ion-spinner><br>Loading...'})
      }
      else {
        $scope.loadingshow = true;
        var myPopup = $ionicPopup.show({
          title: '<h6 class="popups title">Who are you?</h6>',
          subTitle: '<br><h6 class="popups">Login to access this content</h6>',
          scope: $scope,
          buttons: [
            {
              text: '<b>Ok</b>',
              type: 'button button-stable',
              onTap: function(e) {
                $state.go('landingPage', {}, {reload: true});
              }
            },
          ]
        });
      }


    $http.get(apiUrl+"retrieveUserDetails?id="+$scope.id)
      .success(function (data) {
        var userDetails = data;
        if (userDetails != null && userDetails.length!=0 ) {
          $scope.username = userDetails.volunteer[0].name;
          $scope.nric=userDetails.volunteer[0].nric;
          $scope.email =userDetails.volunteer[0].email;
          $scope.gender=userDetails.volunteer[0].gender;
          $scope.dob=userDetails.volunteer[0].date_of_birth;
          $scope.contactnumber=userDetails.volunteer[0].contact_no;

          $scope.hoursCompletedTemp=userDetails.volunteerHours.split(",");

          //hours completed
          var hoursCompletedT=$scope.hoursCompletedTemp[0].trim().split(" ");
          $scope.hoursCompleted=hoursCompletedT[0].trim();

          //mins completed
          var minsCompletedT=$scope.hoursCompletedTemp[1].trim().split(" ");
          $scope.minsCompleted = minsCompletedT[0].trim();

          $scope.occuption=userDetails.volunteer[0].occupation;
          $scope.preference1=userDetails.volunteer[0].area_of_preference_1;
          $scope.preference2=userDetails.volunteer[0].area_of_preference_2;
          $scope.rank=userDetails.volunteer[0].rank.name;
          if(userDetails.nextRank != "") {
            $scope.nextRank = userDetails.nextRank.name;
            $scope.nextRankMin = userDetails.nextRank.min;
          }
          else
          {
            $scope.nextRank = "NA";
            $scope.nextRankMin = "NA";
          }
          $scope.nextPts = parseInt($scope.nextRankMin) - parseInt($scope.hoursCompleted);
          if($scope.nextRank == "NA" && $scope.nextRankMin == "NA")
          {
            $scope.toDisplayInformation = "Platinum is the highest rank available.";
          }
          else
          {
            $scope.toDisplayInformation = $scope.nextPts +" points to "+$scope.nextRank;
          }

          $http.get(apiUrl+"retrieveRankingDetails?id="+$scope.id)
            .success(function (data) {
              var userDetails = data;
              if (userDetails != null ) {
                $scope.completed = userDetails.completed;
                $scope.withdrawn = userDetails.withdrawn;
                $ionicLoading.hide();
                $scope.loadingshow = false;
              }
            })
        }
      })

      $scope.manageAccount = function()
      {
        $state.go('manageAccount', {id: $scope.id});
      }

      $scope.goRank = function()
      {
        $state.go('viewRanking', {id: $scope.id, currentRank:$scope.rank, hoursCompleted:$scope.hoursCompleted, minsCompleted:$scope.minsCompleted, nextRank:$scope.nextRank, nextRankMin:$scope.nextRankMin});
      }
    });
