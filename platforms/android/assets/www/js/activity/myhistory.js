angular.module('crowdsourcing')

    .controller('myhistoryController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $stateParams, $ionicHistory, $ionicHistory, $ionicPopover) {
        if(window.localStorage.getItem("loginUserName") != null) {
          $scope.name = window.localStorage.getItem("loginUserName");
          $scope.id = window.localStorage.getItem("loginId");
          $scope.loadingshow = true;
        }
        else {
          $state.go('login', {}, {reload: true});
        }

    $scope.toLoad = function()
    {
      $scope.groups = [];

      $scope.groups.push({name: "Completed", items: []});
      $scope.groups.push({name: "Pending", items: []});
      $scope.groups.push({name: "Rejected/Withdrawn", items: []});

      var urlString = "http://www.changhuapeng.com/volunteer/php/RetrieveTransportByUser.php?id="+$scope.id+"&type=2";

      $http.get(urlString)
        .success(function (data) {
          var transportDetails = data;

          if (transportDetails != null){
            for(var i = 0; i<transportDetails.length; i++){

              if(transportDetails[i].activity_id != null && transportDetails[i].name != null && transportDetails[i].datetime_start !=null){
                var temp =transportDetails[i].datetime_start.split(' ');
                var datesTemp = temp[0].split('-');

                if(transportDetails[i].approval == "approved" && transportDetails[i].status== "completed")
                {
                  $scope.groups[0].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], statusDisplay:"Completed"});
                }
                else
                {
                  var date_temp = temp[0] + " " + temp[1];
                  var transportDateTime = new Date(date_temp.replace(/-/g,"/"));
                  var currentDateTime = new Date();
                  if(transportDateTime < currentDateTime)
                  {
                    if(transportDetails[i].approval == "withdrawn") {
                      $scope.groups[2].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails[i].approval == "rejected")
                    {
                      $scope.groups[2].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], statusDisplay:"Not Applicable"});
                    }
                    else if(transportDetails[i].approval == "pending")
                    {
                      $scope.groups[1].items.push({id:transportDetails[i].activity_id, name:transportDetails[i].name, dateTime:"Date/Time: " + datesTemp[2] + "-" + datesTemp[1] + "-" + datesTemp[0] + " | " + temp[1], statusDisplay:"Not Applicable"});
                    }
                  }
                }
              }
            }
          }
          $scope.loadingshow = false;
        })
        .finally(function() {
          // Stop the ion-refresher from spinning
          $scope.$broadcast('scroll.refreshComplete');
        });
    }

    $scope.toLoad();

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

    $scope.goCurrent = function()
    {
      $ionicHistory.nextViewOptions({
        disableAnimate: true
      });
      $state.go('tab.activity');
    }
});
