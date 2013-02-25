'use strict';

/* Cloobster namespace. Create if not exists.*/
var Cloobster = Cloobster || {};

// Declare app level module which depends on filters, and services
Cloobster.customermodule = angular.module('CloobsterHome', ['Cloobster.services', 'Cloobster.directives']).
  config(['$routeProvider','configProvider','$httpProvider', function($routeProvider,configProvider, $httpProvider) {
    // Here you set the service url that the Cloobster services use.
    //configProvider.setServiceUrl('https://eatsense-test.appspot.com');

    // Set API Version header
    $httpProvider.defaults.headers.common['cloobster-api'] = '2';

  	$routeProvider.when('/', {template: '...', controller: Cloobster.Redirect});
    $routeProvider.when('/confirm/:emailToken', {templateUrl: 'partials/confirmemail.html', controller: Cloobster.ConfirmAccount});
    $routeProvider.when('/confirm-email/:emailToken', {templateUrl: 'partials/confirmnewemail.html', controller: Cloobster.ConfirmEmail});
    $routeProvider.when('/reset-password/:emailToken', {templateUrl: 'partials/passwordreset.html', controller: Cloobster.PasswordReset});

    $routeProvider.otherwise({redirectTo: '/'});
 }]);


/**
* Redirect to the homepage after loading
* @constructor
**/
Cloobster.Redirect = function($scope, $window) {
    $window.location.href='../';
};
Cloobster.Redirect.$inject = ['$scope','$window'];

/**
* Activates an account by sending an email token to the server.
* Token is read from URL.
* @constructor
*/
Cloobster.ConfirmAccount = function($scope, $http, $routeParams, handleError, config) {
    // Send confirmation token to server via the login service.
    $http.put( config['serviceUrl'] + '/b/accounts/confirmation/' + $routeParams['emailToken'], null).success(function(result) {
        $scope.emailConfirmed = true;
    }).error(handleError);
}
Cloobster.ConfirmAccount.$inject = ['$scope', '$http', '$routeParams', 'errorHandler', 'config'];

/**
* Activates a new e-mail address by sending an email token to the server.
* Token is read from URL.
* @constructor
*/
Cloobster.ConfirmEmail = function($scope, $http, $routeParams, handleError, config) {
    // Send confirmation token to server via the login service.
    $http.put( config['serviceUrl'] + '/b/accounts/email-confirmation/' + $routeParams['emailToken'], null).success(function(result) {
        $scope.emailConfirmed = true;
    }).error(handleError);
}

Cloobster.ConfirmEmail.$inject = ['$scope', '$http', '$routeParams', 'errorHandler', 'config'];

/**
* Handles user password reset links send via e-mail.
* @constructor
*/
Cloobster.PasswordReset = function($scope, $http, $routeParams, handleError, $location, config) {

    $scope.passwordReset = function() {
        $scope.passwordResetProgress = true;
        $http.put( config['serviceUrl'] + '/accounts/password-reset/'+ $routeParams['emailToken'], { 'password' : $scope.newPassword}).success(function() {
            $scope.passwordResetComplete = true;
        }).error(function(data,status,config,headers) {
            $scope.passwordResetProgress = false;
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

Cloobster.PasswordReset.$inject = ['$scope', '$http', '$routeParams', 'errorHandler', '$location', 'config'];
