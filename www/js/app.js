angular.module('crowdsourcing', ['ionic', 'jrCrop'])

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

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider


  // setup an abstract state for the tabs directive

  // tabs
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/commons/tabs.html'
      })

    .state('tab.home', {
      url: '/home',
      views: {
        'tab-home': {
          templateUrl: 'templates/home/homepage.html',
          controller: "homeController"
        }
      }
    })

    .state('tab.search', {
      url: '/search',
      views: {
        'tab-search': {
          templateUrl: 'templates/search/search.html'
        }
      }
    })

    .state('tab.activity', {
      url: '/myactivity',
      views: {
        'tab-activity': {
          templateUrl: 'templates/activity/myactivity.html'
        }
      }
    })

    .state('tab.me', {
      url: '/me',
      views: {
        'tab-me': {
          templateUrl: 'templates/me/me.html',
          controller: "viewAccountController"
        }
      }
    })


    .state('login', {
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
      url: '/scan',
      templateUrl: 'templates/home/scan.html'
    })



/*
    .state('viewAccount', {
      url: '/viewAccount',
      templateUrl: 'templates/account/view.html',
      controller: "viewAccountController"
    })
*/
    /*.state('home', {
      url: '/home',
      templateUrl: 'templates/home/homepage.html',
      controller: "homeController"
    })*/

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');

});
