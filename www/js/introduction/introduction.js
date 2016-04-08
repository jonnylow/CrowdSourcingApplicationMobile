/**
 * This js script will handle all logic for getting started. Its corresponding html file is introduction.html.
 * The main purpose of this page is just to handle any logic for the content getting started.
 */

angular.module('crowdsourcing')

    .controller('introductionController', function ($scope, $ionicPopup, $state, $http, $jrCrop, $ionicHistory, $ionicLoading, $ionicHistory,apiUrl,$ionicSlideBoxDelegate) {
        $scope.$on('slideBox.slideHasChanged', function() {
            slider.slide(index);
      });
       $scope.$on('slideBox.nextSlide', function() {
        slider.next();
      });

      $scope.$on('slideBox.prevSlide', function() {
        slider.prev();
      });

      $scope.goHome = function()
      {
        window.localStorage.setItem("intro", "done");
        if (window.localStorage.getItem("token") == null ) {
          $state.go('landingPage');
        } else {
          $state.go('tab.home');
        }

      }

    });
