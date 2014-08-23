/** @module Cloobster/Registration */
'use strict';

/** 
*	@name Cloobster.Registration
* 	@constructor
* 	@requires $location
*	@requires $routeParams
*	@requires Account
*	@requires facebookApi
*	@requires loginService
*	
* 	Handles the registration process for business owners.
* 
* 	@author Frederik Reifschneider
* 	@author Nils Weiher
*/
Cloobster.Registration = function($scope, $location, Account, facebookApi, $routeParams, loginService, $log, $http, handleError, countrycodes) {
	var emptyAccount = {
			'name' : '',
			'login' : '',
			'email' : '',
			'password' : '',
			'phone' : '',
			'company' : {
				'name' : '',
				'address' : '',
				'city' : '',
				'country' : 'DE',
				'postcode' : '',
				'phone' : ''
			},
			'facebookUID' : null
		},
		account,
		registrationUrlHash = /\/?accounts\/confirm\/.*/,
		newEmailUrlHash = /\/?accounts\/confirm-email\/.*/,
		passwordRegex= /^(?=[!-~]{6,}$)(?=.*\\d)(?=.*[^A-Za-z0-9]).*$/;

	//indicates in a session if user already registered
	$scope.registered = false;
	//error flag
	$scope.error = false;
	//error message 
	$scope.errorMessage = "";
	//true when connected to facebook
	$scope.fbConnected = false;
	//true if email is confirmed
	$scope.emailConfirmed = false;	
	//provide countrycodes in scope
	$scope.countrycodes = countrycodes;

	/**
	* @inner
	* Checks facebook connection status.
	*
	* @return true if user is logged into facebook but not connected to application
	*/
	$scope.isLoggedInAndNotFbConnected = function() {
		return ( !$scope.fbConnected && $scope.fbLoggedIn );
	};

	/**
	* @inner
	* Saves the registration formular.
	*
	*/
	$scope.save = function() {
		account = new Account($scope.account);
		$scope.registrationForm.$dirty = true;

		//set required fields dirty
		$scope.registrationForm.fullname.$dirty = true;
		$scope.registrationForm.email.$dirty = true;
		$scope.registrationForm.emailRepeat.$dirty = true;
		$scope.registrationForm.login.$dirty = true;
		$scope.registrationForm.password.$dirty = true;
		$scope.registrationForm.passwordRepeat.$dirty = true;
		$scope.registrationForm.phone.$dirty = true;
		$scope.registrationForm.companyName.$dirty = true;
		$scope.registrationForm.companyPhone.$dirty = true;
		$scope.registrationForm.acceptTerms.$dirty = true;


		if($scope.registrationForm.$valid) {
				account.$register(function (account) { 
				$scope.registered = true;
			}, handleError);
		} else {
			$log.info("Can't submit form because it is not valid.");
		}
	};

	/**
	* @inner
	* Resets the registration formular.
	* 
	*/
	$scope.cancel = function() {
		$scope.account = angular.copy(emptyAccount);
		$scope.emailRepeat = emptyAccount.email;
		$scope.passwordRepeat = emptyAccount.password;
		$scope.fbConnected = false;
	};

	/*
	* Get css class for field highlighting.
	* @returns error if dirty && invalid
	*		  sucess if dirty && !invalid
	*         empty string otherwise
	*/
	$scope.getFieldInputClass = function(dirty, invalid) {
		if(dirty && invalid) {
			return "error";
		} else if (dirty && !invalid) {
			return "success";
		} else {
			return "";
		}
	};

	/**
	* Checks if in registration form controller email and email repeat field match.
	* If they don't match sets the email repeat field as invalid.
	*/
	$scope.matchMails = function() {
		if($scope.registrationForm.email.$viewValue !== $scope.registrationForm.emailRepeat.$viewValue) {
			$scope.registrationForm.emailRepeat.$setValidity("match", false);
		} else {
			$scope.registrationForm.emailRepeat.$setValidity("match", true);
		}
	};

	/**
	* Checks if in registration form controller password and password repeat field match.
	* If they don't match sets the password repeat field as invalid.
	*/
	$scope.matchPasswords = function() {
		if($scope.registrationForm.password.$viewValue !== $scope.registrationForm.passwordRepeat.$viewValue) {
			$scope.registrationForm.passwordRepeat.$setValidity("match", false);
		} else {
			$scope.registrationForm.passwordRepeat.$setValidity("match", true);
		}
	}

	/**
	* Connect a user to facebook.
	*/
	$scope.connectFb = function() {
		facebookApi.getUser().then( setFbUserData );
	};

	/**
	* Log into facebook and connect to application.
	*/
	$scope.loginAndConnectFb = function() {
		facebookApi.login().then( facebookApi.getUser ).then( setFbUserData );
	};

	/**
	*
	* Set retrieved facebook data into registration form.
	* @param user
	*		user data from facebook
	*/
	function setFbUserData(user) {
		$scope.registrationForm.fullname.$dirty = true;
		$scope.registrationForm.email.$dirty = true;
		$scope.registrationForm.emailRepeat.$dirty = true;
		$scope.registrationForm.login.$dirty = true;
		$scope.account.email = user.email;
		$scope.emailRepeat = user.email;
		$scope.account.name = user.name;
		$scope.account.login = user.username;
		$scope.account.facebookUID = user.id;
		$scope.fbConnected = true;
		//$scope.matchPasswords();
	}

	/**
	* Log out from facebook.
	*/
	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	//set default values on load
	$scope.cancel();
}
Cloobster.Registration.$inject = ['$scope', '$location', 'Account', 'facebookApi', '$routeParams', 'login', '$log', '$http', 'errorHandler','countrycodes'];

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
	*		  sucess if dirty && !invalid
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

