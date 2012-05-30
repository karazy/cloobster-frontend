'use strict';

/* Registration controller*/


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
		//URL to activate an account
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

	/*Check URL origin */
	if($location.url().match(registrationUrlHash) || $location.hash().match(registrationUrlHash)) {
		confirmEmail();
	}

	$scope.isLoggedInAndNotFbConnected = function() {
		return ( !$scope.fbConnected && $scope.fbLoggedIn );
	}

	$scope.save = function() {
		account = new Account($scope.account);
		account.$register(function (account) { 
			$scope.registered = true;
		}, function (result) { 
			$scope.error = true;
			$scope.errorValue = result.data;
		});
	};

	$scope.cancel = function() {
		$scope.account = angular.copy(emptyAccount);
		$scope.emailRepeat = emptyAccount.email;
		$scope.passwordRepeat = emptyAccount.password;
		$scope.fbConnected = false;
	};

	/*
	* Get css class for field highlighting
	*/
	$scope.getFieldInputClass = function(dirty, invalid) {
		if(dirty && invalid) {
			return "error";
		} else if (dirty && !invalid) {
			return "success";
		} else {
			return "";
		}
	}

	$scope.connectFb = function() {
		facebookApi.getUser().then( setFbUserData );
	};

	$scope.loginAndConnectFb = function() {
		facebookApi.login().then( facebookApi.getUser ).then( setFbUserData );
	};


	function confirmEmail() {
		loginService.confirmEmail($routeParams.emailToken).then(
			function(result) {
				$scope.emailConfirmed = result.emailConfirmed;
			},
			handleError);
	}

	function handleLogin ( result) {
		$scope.loginProgress = false;
		$scope.account = result;
		confirmEmail();
	}

	function handleError (errorData) {
		$scope.loginProgress = false;
		$scope.error = true;
		$scope.errorMessage = errorData.message;
	}

	function doFbLogin(uid, accessToken) {
		$scope.loginProgress = true;
		loginService.loginFb( { uid: uid, token: accessToken } )
			.then( handleLogin, handleError);
	}

	function setFbUserData(user) {
		$scope.account.email = user.email;
		$scope.emailRepeat = user.email;
		$scope.account.login = user.username;
		$scope.account.name = user.name;
		$scope.account.facebookUID = user.id;
		$scope.fbConnected = true;
	}

	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	/* Called to do a Facebook and Cloobster login. */
	$scope.fbLogin = function() {
		$scope.loginProgress = true;
		$scope.error = false;
		if(!$scope.fbLoggedIn) {

			facebookApi.login().then( function (response) {
				doFbLogin(response.authResponse.userID, response.authResponse.accessToken);
			});	
		}
		else {
			doFbLogin(facebookApi.getUid(), facebookApi.getAccessToken());
		}
		
	};

	/* Called to do a Cloobster login. */
	$scope.login = function() {
		$scope.loginProgress = true;
		$scope.error = false;
		loginService.login( $scope.loginData ).then( handleLogin, handleError);
	}

	if(loginService.existsSavedLogin() && ($scope.loggedIn === false)) {
		$scope.loginProgress = true;
		loginService.loginResume().then( handleLogin, handleError);
	}

	//set default values on load
	$scope.cancel();
}
Cloobster.Registration.$inject = ['$scope', '$resource', '$location', 'Account', 'facebookApi', '$routeParams', 'login'];
