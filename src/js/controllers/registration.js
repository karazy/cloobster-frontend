/** @module Cloobster/Registration */
'use strict';

/** 
* @constructor
* Handles the registration process for business owners.
* 
* @author Frederik Reifschneider
* @author Nils Weiher
*/
Cloobster.Registration = function($scope, $resource, $location, Account, facebookApi, $routeParams, loginService) {
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
				'country' : '',
				'postcode' : '',
				'phone' : ''
			},
			'facebookUID' : null
		},
		account,
		registrationUrlHash = /\/?account\/confirm\/.*/,
		passwordRegex= /^(?=[!-~]{6,}$)(?=.*\\d)(?=.*[^A-Za-z0-9]).*$/;

	$scope.registered = false;
	$scope.error = false;
	$scope.fbConnected = false;
	$scope.emailConfirmed = false;
	$scope.errorMessage = "";
	$scope.loginProgress = false;
	$scope.loginData = {
		login : "",
		password : "",
		save : false
	}

	/**
	* @inner
	* Checks facebook connection status.
	*
	* @return true if user is logged into facebook but not connected to application
	*/
	$scope.isLoggedInAndNotFbConnected = function() {
		return ( !$scope.fbConnected && $scope.fbLoggedIn );
	}

	/**
	* @inner
	* Saves the registration formular.
	*
	*/
	$scope.save = function() {
		account = new Account($scope.account);
		account.$register(function (account) { 
			$scope.registered = true;
		}, function (result) { 
			$scope.error = true;
			$scope.errorValue = result.data;
		});
	};

	/**
	* 
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
	* Activates and account by sending an email token to the server.
	* Token is read from URL.
	* @private
	*/
	function confirmEmail() {
		loginService.confirmEmail($routeParams.emailToken).then(
			function(result) {
				$scope.emailConfirmed = result.emailConfirmed;
			},
			handleError);
	}

	/**
	* @private
	* 
	*/
	function handleError (errorData) {
		$scope.error = true;
		$scope.errorMessage = errorData.message;
	}

	/**
	*
	* Set retrieved facebook data into registration form.
	* @param user
	*		user data from facebook
	*/
	function setFbUserData(user) {
		$scope.account.email = user.email;
		$scope.emailRepeat = user.email;
		$scope.account.login = user.username;
		$scope.account.name = user.name;
		$scope.account.facebookUID = user.id;
		$scope.fbConnected = true;
		$scope.matchPasswords();
	}

	/**
	* Log out from facebook.
	*/
	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	//Check if URL is an account activation
	if($location.url().match(registrationUrlHash) || $location.hash().match(registrationUrlHash)) {
		confirmEmail();
	}

	//set default values on load
	$scope.cancel();
}
Cloobster.Registration.$inject = ['$scope', '$resource', '$location', 'Account', 'facebookApi', '$routeParams', 'login'];
