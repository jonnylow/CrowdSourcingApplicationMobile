angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.username = window.localStorage.getItem("loginUserName");
        $scope.email = window.localStorage.getItem("loginUserEmail");
        $scope.contactnumber= window.localStorage.getItem("loginUserContactNumber");
        $scope.dob = window.localStorage.getItem("loginUserDOB");
    });
