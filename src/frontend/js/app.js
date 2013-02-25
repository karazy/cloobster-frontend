'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster = Cloobster || {};

Cloobster.services = angular.module('Cloobster.services', ['ngResource', "Cloobster.translations", "Cloobster.languages"]);

// Declare app level module which depends on filters, and services
Cloobster.module = angular.module('Cloobster', ['Cloobster.services', 'Cloobster.directives', 'Cloobster.filters', 'ngSanitize']).
  config(['$routeProvider','configProvider', '$httpProvider', function($routeProvider,configProvider, $httpProvider) {
    // Here you set the service url that the Cloobster services use.
    //configProvider.setServiceUrl('https://eatsense-test.appspot.com');
    
    $httpProvider.defaults.headers.common['cloobster-api'] = '2';

  	$routeProvider.when('/home', {templateUrl: 'partials/home.html', controller: Cloobster.Login});
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: Cloobster.Login});
    $routeProvider.when('/login/forgot', {templateUrl: 'partials/passwordforgot.html', controller: Cloobster.Login});
  	$routeProvider.when('/about', {templateUrl: 'partials/about.html'});
    $routeProvider.when('/support', {templateUrl: 'partials/support.html'});
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
    $routeProvider.when('/businesses/:businessId/infopages', {templateUrl: 'partials/infopages.html', controller: Cloobster.InfoPage});
    $routeProvider.when('/businesses/:businessId/documents', {templateUrl: 'partials/documents.html', controller: Cloobster.Documents});
    $routeProvider.when('/businesses', {templateUrl: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/new', {templateUrl: 'partials/businesses.html', controller: Cloobster.Business});
    $routeProvider.when('/businesses/:businessId', {templateUrl: 'partials/businessdetail.html', controller: Cloobster.Business});
    $routeProvider.when('/accounts', {templateUrl: 'partials/accounts.html', controller: Cloobster.Accounts});
    $routeProvider.when('/accounts/setup/:token', {templateUrl: 'partials/activate_account.html', controller: Cloobster.Accounts});    
    $routeProvider.when('/howto', {templateUrl: 'partials/howto.html', controller: Cloobster.Navigation});
    // $routeProvider.when('/', {templateUrl: 'partials/login.html', controller: Cloobster.Login});
    
    $routeProvider.otherwise({redirectTo: '/home'});
 }]);


/**
* Activates an account by sending an email token to the server.
* Token is read from URL.
* 
*/
Cloobster.ConfirmAccount = function($scope, loginService, $routeParams, handleError) {
    // Send confirmation token to server via the login service.
    loginService.confirmEmail($routeParams['emailToken']).success(function(result) {
        $scope.emailConfirmed = true;
        loginService.setPresetLogin(result['login']);
    }).error(handleError);

}
Cloobster.ConfirmAccount.$inject = ['$scope', 'login', '$routeParams', 'errorHandler'];

/**
* Activates a new e-mail address by sending an email token to the server.
* Token is read from URL.
* 
*/
Cloobster.ConfirmEmail = function($scope, loginService, $routeParams, handleError) {
    // Send confirmation token to server via the login service.
    loginService.confirmEmailUpdate($routeParams['emailToken']).success(function(result) {
        $scope.emailConfirmed = true;
    }).error(handleError);
}

Cloobster.ConfirmEmail.$inject = ['$scope', 'login', '$routeParams', 'errorHandler'];

/**
* Handles user password reset links send via e-mail.
* 
*/
Cloobster.PasswordReset = function($scope, loginService, $routeParams, handleError, $location) {

    $scope.passwordReset = function() {
        $scope.passwordResetProgress = true;
        loginService.passwordReset($routeParams['emailToken'],$scope.newPassword).success(function() {
            $scope.passwordResetComplete = true;
        }).error(function(data,status,config,headers) {
            $scope.passwordResetProgress = false;
            if(status == 404) {
                $location.path('/');
            }
            handleError(data,status,config,headers);
        });
    };

    $scope.matchPasswords = function(form) {
        if(form.newPassword.$viewValue !== form.newPasswordRepeat.$viewValue) {
            form.newPasswordRepeat.$setValidity("match", false);
        } else {
            form.newPasswordRepeat.$setValidity("match", true);
        }
    };

    /*
    * Get css class for field highlighting.
    * @param {NgModelController} input ng-model controller for the input to check.
    * @returns error if dirty && invalid
    *         sucess if dirty && !invalid
    *         empty string otherwise
    */
    $scope.getFieldInputClass = function(input) {
        if(input.$dirty && input.$invalid) {
            return "error";
        } else if (input.$dirty && !input.$invalid) {
            return "success";
        } else {
            return "";
        }
    };
}

Cloobster.PasswordReset.$inject = ['$scope', 'login', '$routeParams', 'errorHandler', '$location'];
