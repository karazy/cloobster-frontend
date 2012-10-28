'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster =  {};

// Declare app level module which depends on filters, and services
Cloobster.module = angular.module('Cloobster', ['Cloobster.services', 'Cloobster.directives', 'Cloobster.filters']).
  config(['$routeProvider','configProvider', function($routeProvider,configProvider) {
    // Here you set the service url that the Cloobster services use.
    //configProvider.setServiceUrl('https://eatsense-test.appspot.com');

  	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: Cloobster.Login});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: Cloobster.Login});
    $routeProvider.when('/login/forgot', {templateUrl: 'partials/passwordforgot.html', controller: Cloobster.Login});
  	$routeProvider.when('/about', {templateUrl: 'partials/about.html'});
  	$routeProvider.when('/registration', {templateUrl: 'partials/registration_form.html', controller: Cloobster.Registration});
    $routeProvider.when('/profile', {templateUrl: 'partials/profile.html', controller: Cloobster.Profile});
    $routeProvider.when('/accounts/customer/confirm/:emailToken', {templateUrl: 'partials/confirmemail.html', controller: Cloobster.ConfirmAccount, customer: true});
    $routeProvider.when('/accounts/customer/confirm-email/:emailToken', {templateUrl: 'partials/confirmnewemail.html', controller: Cloobster.ConfirmEmail, customer: true});
    $routeProvider.when('/accounts/confirm/:emailToken', {templateUrl: 'partials/confirmemail.html', controller: Cloobster.ConfirmAccount});
    $routeProvider.when('/accounts/confirm-email/:emailToken', {templateUrl: 'partials/confirmnewemail.html', controller: Cloobster.ConfirmEmail});
    $routeProvider.when('/accounts/reset-password/:emailToken', {templateUrl: 'partials/passwordreset.html', controller: Cloobster.PasswordReset});
    $routeProvider.when('/businesses/:businessId/menus', {templateUrl: 'partials/menus.html', controller: Cloobster.Menu});
    $routeProvider.when('/businesses/:businessId/spots', {templateUrl: 'partials/spots.html', controller: Cloobster.Spot});
    $routeProvider.when('/businesses/:businessId/category_assignment', {templateUrl: 'partials/category_assignment.html', controller: Cloobster.Spot});
    $routeProvider.when('/businesses', {templateUrl: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/new', {templateUrl: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/:businessId', {templateUrl: 'partials/businessdetail.html', controller: Cloobster.Business});
    $routeProvider.when('/accounts', {templateUrl: 'partials/accounts.html', controller: Cloobster.Accounts});
    $routeProvider.when('/accounts/setup/:token', {templateUrl: 'partials/activate_account.html', controller: Cloobster.Accounts});    
    // $routeProvider.when('/', {templateUrl: 'partials/login.html', controller: Cloobster.Login});
    
    $routeProvider.otherwise({redirectTo: '/home'});
 }]);
