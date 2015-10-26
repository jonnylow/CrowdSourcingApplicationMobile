angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicHistory, $ionicPopover) {
        $scope.transportID=[];
        $scope.transportName=[];
      	$scope.transportDateTimeStart=[];
        $scope.transportStatus=[];

        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
        }
        else {
          $state.go('login', {}, {reload: true});
        }

       	var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=2";

    $http.get(urlString)
      .success(function (data) {
        var transportDetails = data;

        if (transportDetails != null){
          for(var i = 0; i<transportDetails.length; i++){

            if(transportDetails[i].activity_id != null && transportDetails[i].name != null && transportDetails[i].datetime_start !=null){
              var temp =transportDetails[i].datetime_start.split(' ');

              if(transportDetails[i].approval == "withdrawn") {
                $scope.transportStatus.push("Withdraw");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
              else if(transportDetails[i].approval == "rejected")
              {
                $scope.transportStatus.push("Rejected");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
              else if(transportDetails[i].approval == "approved" && transportDetails[i].status== "completed")
              {
                $scope.transportStatus.push("Completed");
                $scope.transportID.push(transportDetails[i].activity_id);
                $scope.transportName.push(transportDetails[i].name);
                $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);
              }
            }
          }
        }
        $scope.loadingshow = false;
      })

    // .fromTemplateUrl() method
    if (window.localStorage.getItem("loginUserName") == null) {
      $ionicPopover.fromTemplateUrl('templates/home/menu_popout_guest.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
    }
    else {
      $ionicPopover.fromTemplateUrl('templates/home/menu_popout.html', {
        scope: $scope
      }).then(function (popover) {
        $scope.popover = popover;
      });
    }

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

    $scope.logout = function () {
      window.localStorage.removeItem("loginUserName");
      window.localStorage.removeItem("loginId");
      window.localStorage.clear();
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      $ionicHistory.nextViewOptions({disableBack: true, historyRoot: true});
      $scope.closePopover();
      //window.location.reload(true);
      $state.go('login', {}, {reload: true});
      //$state.transitionTo('loginHome', null, {'reload':true});
    }

    $scope.proceed = function(id, name)
    {
      $state.go('myPastActivityDetails', {transportId: id, transportActivityName: name});
    }
});
