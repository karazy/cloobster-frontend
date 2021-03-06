/** @module Cloobster/Login */
'use strict';

jQuery('.dropdown-menu').find('form').click(function (e) {
    e.stopPropagation();
});

/**
* 	@name Cloobster.Login 
*	@requires facebookApi
*	@requires loginService
*
* 	Login controller 
* 	Manages submitting of login data, retrieving facebook login data and resume of a saved login.
* 	@constructor
*/
Cloobster.Login = function($scope, facebookApi, loginService,globalHandleError,$routeParams,$location) {
	$scope.loginData = {
		login : "",
		password : "",
		save : false
	}
	// true if there is a login in progress, so that views can change accordingly.
	$scope.loginProgress = false;

	/**
	*	@name Cloobster.Login~handleLogin
	*	
	*	Callback used after a successfull login request.
	*	@param {Object} result - Contains the user account data.
	*/
	function handleLogin ( result) {
		$scope.loginProgress = false;
		globalHandleError.reset();
		$location.path('/businesses');
	}

	/**
	*	@name Cloobster.Login~handleError
	*	
	*	Callback used after a failed login request.
	*	@param {Object} errorData - Contains the response object send from the Cloobser service.
	*/
	function handleError (responseData) {
		$scope.loginProgress = false;
		globalHandleError(responseData);
	}

	/**
	*	@name Cloobster.Login~doFbLogin
	*	
	*	Shortcut method to execute a Cloobster login with facebook.
	*	@see Cloobster.services.login#loginFb
	*
	*	@param {string} uid - Id of the Facebook user object, used for authentication.
	*	@param {string} accessToken - Token issued by the Facebook api after login, used for authentication.
	*/
	function doCloobsterFbLogin(uid, accessToken) {
		$scope.loginProgress = true;
		loginService.loginFb( { uid: uid, token: accessToken } )
			.then( handleLogin, handleError);
	}

	/**
	*	Interface function, called to logout of Facebook.
	*	@see Cloobster.services.facebookApi#logout
	*/
	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	/**
	*	Interface function, called to do a Facebook and Cloobster login.
	* 	Calls {@link Cloobster.services.facebookApi#login} and then {@link Cloobster.services.login#loginFb}.
	*/
	$scope.fbLogin = function() {
		$scope.loginProgress = true;
		$scope.error = false;
		if(!$scope.fbLoggedIn) {
			facebookApi.login().then( function (response) {
				//Call helper method to do the Cloobster login
				doCloobsterFbLogin(response.authResponse.userID, response.authResponse.accessToken);
			});	
		}
		else {
			doCloobsterFbLogin(facebookApi.getUid(), facebookApi.getAccessToken());
		}
	};

	/** 
	*	Interface function, called to do a Cloobster login.
	*	Calls {@link Cloobster.services.login#logout}
	*/
	$scope.login = function() {
		$scope.loginProgress = true;
		$scope.error = false;
		loginService.login( $scope.loginData ).then( handleLogin, handleError);
	}

	/**
	*	Interface function, called to do a Cloobster logout.
	*	Calls {@link Cloobster.services.login#logout}
	*/
	$scope.logout = function() {
		loginService.logout();
	}

	/**
	*	Getter for currently logged in account.
	*	@returns {Object} - Account
	*/
	$scope.getAccount = function() {
		return loginService.getAccount();
	};

	$scope.getDisplayName = function() {
		return loginService.getAccount().login || loginService.getAccount().email;
	};

	$scope.requestReset = function() {
		$scope.resetRequestProgress = true;
		loginService.requestPasswordReset($scope.email).success(function() {
			$scope.resetRequestComplete = true;
		})
		.error(function(data,status,headers,config) {
			$scope.resetRequestProgress = false;
			globalHandleError(data,status,headers,config);
		});

	};

	// Check for saved login data.
	if(loginService.existsSavedLogin() && ($scope.loggedIn === false)) {
		// Set so that we can bind views and display e.g. a progress bar.
		$scope.loginProgress = true;
		// Authenticate the user with the saved data.
		loginService.loginResume().then( handleLogin, handleError);
	} else {
		if(loginService.getPresetLogin()) {
			//if a preset value was found, prefill login field
			$scope.loginData.login = loginService.getPresetLogin();
		}
	}
		
}
Cloobster.Login.$inject = ['$scope', 'facebookApi', 'login','errorHandler','$routeParams','$location'];
