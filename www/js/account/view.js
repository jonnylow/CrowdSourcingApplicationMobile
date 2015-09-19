angular.module('crowdsourcing')

    .controller('viewAccountController', function ($scope, $ionicPopup, $state, $http, $jrCrop) {
        $scope.nric = window.localStorage.getItem("userNRIC");
    });
