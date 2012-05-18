'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster =  {};

// Declare app level module which depends on filters, and services
angular.module('Cloobster', ['Cloobster.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/registration', {template: 'partials/registration_form.html', controller: Cloobster.Registration});
    // $routeProvider.when('/view2', {template: 'partials/partial2.html', controller: Cloobster.MyController2});
    $routeProvider.otherwise({redirectTo: '/registration'});
  }]);
