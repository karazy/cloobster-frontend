'use strict';

/* Registration controller*/


Cloobster.Registration = function($scope, $resource, Account, facebookApi, $routeParams, loginService) {
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
		setFbUserData = function(user) {
			$scope.account.email = user.email;
			$scope.emailRepeat = user.email;
			$scope.account.login = user.username;
			$scope.account.name = user.name;
			$scope.account.facebookUID = user.id;
			$scope.fbConnected = true;
		};

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
Cloobster.Registration.$inject = ['$scope', '$resource', 'Account', 'facebookApi', '$routeParams', 'login'];
