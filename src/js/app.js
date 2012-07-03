'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster =  {};

// Declare app level module which depends on filters, and services
Cloobster.module = angular.module('Cloobster', ['Cloobster.services', 'Cloobster.directives']).
  config(['$routeProvider','configProvider', function($routeProvider,configProvider) {
    // Here you set the service url that the Cloobster services use.
    //configProvider.setServiceUrl('https://eatsense-test.appspot.com');

  	$routeProvider.when('/', {template: 'partials/home.html'});
    $routeProvider.when('/login', {template: 'partials/login.html', controller: Cloobster.Login});
  	$routeProvider.when('/about', {template: 'partials/impressum.html'});
  	$routeProvider.when('/registration', {template: 'partials/registration_form.html', controller: Cloobster.Registration});
    $routeProvider.when('/profile', {template: 'partials/profile.html', controller: Cloobster.Profile});
    $routeProvider.when('/account/confirm/:emailToken', {template: 'partials/confirmemail.html', controller: Cloobster.Registration});    
    $routeProvider.when('/businesses/:businessId/menus', {template: 'partials/management.html', controller: Cloobster.Management});
    $routeProvider.when('/menus/:menuId', {template: 'partials/management.html', controller: Cloobster.Management});
    $routeProvider.when('/menus/:menuId/products', {template: 'partials/management.html', controller: Cloobster.Management});
    $routeProvider.when('/menus/:menuId/products/:productId', {template: 'partials/management.html', controller: Cloobster.Management});
    $routeProvider.when('/businesses/:businessId/spots', {template: 'partials/spots.html', controller: Cloobster.Spot});
    $routeProvider.when('/businesses', {template: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/new', {template: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/:id', {template: 'partials/businessdetail.html', controller: Cloobster.Business});
    // $routeProvider.when('/', {template: 'partials/login.html', controller: Cloobster.Login});
    
    // $routeProvider.otherwise({redirectTo: '/'});
 }]);
