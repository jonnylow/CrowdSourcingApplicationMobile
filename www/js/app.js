angular.module('crowdsourcing', ['ionic', 'ionic.ion.autoListDivider', 'uiGmapgoogle-maps', 'jrCrop'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbjSHUY2EgODcwXrHZsuYJ228CxICux3E',
      v: '3.17',
      libraries: 'weather,geometry,visualization'
    });
  })

  .config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.style('standard'); // other values: striped
    $ionicConfigProvider.tabs.position('bottom'); // other values: top
  }])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  // setup an abstract state for the tabs directive

  // tabs
    .state('tab', {
      cache: false,
      url: '/tab',
      abstract: true,
      templateUrl: 'templates/commons/tabs.html',
      controller: "tabsController"
    })

    .state('tab.home', {
      cache: false,
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/homepage.html',
          controller: "homeController"
        }
      }
    })

    .state('search', {
      cache: false,
      url: '/search',
      templateUrl: 'templates/search/search.html'
    })

    .state('tab.me', {
      cache: false,
      url: '/me',
      views: {
        'tab-me': {
          templateUrl: 'templates/me/me.html',
          controller: "viewAccountController"
        }
      }
    })

    .state('tab.activity', {
      cache: false,
      url: '/myactivity',
      views: {
        'tab-activity': {
          templateUrl: 'templates/activity/myactivity.html',
          controller: "myactivityController"
        }
      }
    })

    .state('tab.myhistory', {
      cache: false,
      url: '/myhistory',
      views: {
        'tab-activity': {
          templateUrl: 'templates/activity/myhistory.html',
          controller: "myhistoryController"
        }
      }
    })

/*
    .state('myhistory', {
      cache: false,
      url: '/myhistory',
      templateUrl: 'templates/activity/myhistory.html',
      controller: "myhistoryController"
    })*/

  .state('landingPage', {
      cache: false,
      url: '/landingPage',
      templateUrl: 'templates/account/landingPage.html'
  })

    .state('login', {
      cache: false,
      url: '/login',
      templateUrl: 'templates/account/login.html',
      controller: "loginController"
  })

    .state('registration', {
      url: '/register',
      templateUrl: 'templates/account/registration.html',
      controller: "registrationController"
    })

    .state('verify', {
      url: '/verify',
      templateUrl: 'templates/account/verify.html',
      controller: "verifyController"
    })

    .state('moreQuestions', {
      url: '/moreQuestions',
      templateUrl: 'templates/account/moreQuestions.html',
      controller: "moreQuestionsController"
    })

    .state('updateAccount', {
      url: '/updateAccount',
      templateUrl: 'templates/account/update.html',
      controller: "updateAccountController"
    })

    .state('scan', {
      cache: false,
      url: '/scan',
      templateUrl: 'templates/scan/scan.html',
      controller: "scanController"
    })

    .state('listTransport', {
      cache: false,
      url: '/listTransport',
      templateUrl: 'templates/list/listTransport.html',
      controller: "listTransportController"
    })

    .state('activityDetails', {
      cache: false,
      url: '/activityDetails/:transportId/:transportActivityName',
      templateUrl: 'templates/activity/activityDetails.html',
      controller: "activityDetailsController"
    })

    .state('activityConfirmation', {
      cache: false,
      url: '/activityConfirmation/:transportId/:transportActivityName',
      templateUrl: 'templates/activity/activityConfirmation.html',
      controller: "activityConfirmationController"
    })

    .state('myactivityDetails', {
      cache: false,
      url: '/myactivityDetails/:transportId/:transportActivityName',
      templateUrl: 'templates/activity/myactivityDetails.html',
      controller: "myactivityDetailsController"
    })

    .state('myPastActivityDetails', {
      cache: false,
      url: '/myPastActivityDetails/:transportId/:transportActivityName',
      templateUrl: 'templates/activity/myPastActivityDetails.html',
      controller: "myPastActivityDetailsController"
    })

    .state('elderyInformation', {
      cache: false,
      url: '/elderyInformation/:transportId/:transportActivityName',
      templateUrl: 'templates/activity/elderyInformation.html',
      controller: "elderyInformationController"
    })

    .state('myactivityStatus', {
      cache: false,
      url: '/myactivityStatus/:transportId/:transportActivityName/:status',
      templateUrl: 'templates/activity/myactivityStatus.html',
      controller: "myactivityStatusController"
    })

    .state('manageAccount', {
      url: '/manageAccount/:id',
      templateUrl: 'templates/account/manageAccount.html',
      controller: "manageAccountController"
    })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/landingPage');

});
