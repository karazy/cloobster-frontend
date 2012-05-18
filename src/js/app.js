'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster =  {};

// Declare app level module which depends on filters, and services
angular.module('cloobster', []).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {template: 'partials/partial1.html', controller: Cloobster.MyController1});
    $routeProvider.when('/view2', {template: 'partials/partial2.html', controller: Cloobster.MyController2});
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);
