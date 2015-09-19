angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.nric = window.localStorage.getItem("userNRIC");
        $scope.firstname = window.localStorage.getItem("firstName");
        $scope.lastname= window.localStorage.getItem("lastName");
        $scope.contactnumber= window.localStorage.getItem("contactNo");
        $scope.address = window.localStorage.getItem("address");


    });
