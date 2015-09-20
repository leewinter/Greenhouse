'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.dashboard',
  'myApp.settings',
  'myApp.camera'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/dashboard'
    });


  }])
  .controller('IndexCtrl', ['$scope', function($scope) {

  }]);
