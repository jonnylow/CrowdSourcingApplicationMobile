angular.module('crowdsourcing')

    .controller('myactivityController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicPopover) {

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
            var myPopup = $ionicPopup.show({
              title: 'Notice',
              subTitle: 'You must login first',
              scope: $scope,
              buttons: [
                {
                  text: '<b>Ok</b>',
                  type: 'button-calm',
                  onTap: function(e) {
                    $state.go('login', {}, {reload: true});
                  }
                },
              ]
            });
        }

       	var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=1";

       	$http.get(urlString)
      	.success(function (data) {
        var transportDetails = data;

        if (transportDetails != null){
        	for(var i = 0; i<transportDetails.length; i++){

        		if(transportDetails[i].activity_id != null && transportDetails[i].name != null && transportDetails[i].datetime_start !=null){
              var temp =transportDetails[i].datetime_start.split(' ');
        			$scope.transportID.push(transportDetails[i].activity_id);
        			$scope.transportName.push(transportDetails[i].name);
              $scope.transportDateTimeStart.push("Date/Time: " + temp[0] + " | " + temp[1]);

              if(transportDetails[i].approval == "pending" && transportDetails[i].status == "new task") {
                $scope.transportStatus.push("Pending");
              }
              else if(transportDetails[i].approval == "approved" && transportDetails[i].status == "new task")
              {
                $scope.transportStatus.push("Approved");
              }
              else
              {
                $scope.transportStatus.push("In-Progress");
              }
        		}
        	}
          $scope.shiftArrays();
        }
            $scope.loadingshow = false;
  })

    $scope.shiftArrays = function()
    {
      for(var i = 0; i<$scope.transportStatus.length; i++){
        if($scope.transportStatus[i] == "In-Progress"){
          //store in temp var
          var tempStatus = $scope.transportStatus[i];
          var tempID = $scope.transportID[i];
          var tempName = $scope.transportName[i];
          var dateTime = $scope.transportDateTimeStart[i];

          //remove element in arrays
          $scope.transportStatus.splice(i,1);
          $scope.transportID.splice(i,1);
          $scope.transportName.splice(i,1);
          $scope.transportDateTimeStart.splice(i,1);

          //put var as the top element
          $scope.transportStatus.unshift(tempStatus);
          $scope.transportID.unshift(tempID);
          $scope.transportName.unshift(tempName);
          $scope.transportDateTimeStart.unshift(dateTime);
        }
      }
    }

    $scope.proceed = function(id, name)
    {
      $state.go('myactivityDetails', {transportId: id, transportActivityName: name});
    }

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
});
