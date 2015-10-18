'use strict';

(function() {
  var app = angular.module('app', [
    'ui.router'
  ])
    .constant('ENDPOINT_URI', 'dummy')
    .config(function ($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('');
  
      $stateProvider
        .state('index', {
          url:'',
          templateUrl: 'app/timesheets/timesheet.tmpl.html',
          controller: 'timesheetController',
          controllerAs: 'vm'
        })
      ;
    })
    .run(function ($rootScope, $state) {
      $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
        event.preventDefault();
      });
    })
  ;

})();