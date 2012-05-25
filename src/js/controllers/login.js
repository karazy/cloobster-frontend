'use strict';

/* Login controller */


Cloobster.Login = function($scope, facebookApi, loginService) {
	$scope.loginData = {
		login : "",
		password : "",
		save : false
	}
	if($scope.loggedIn === true ) {
		$scope.account = loginService.getAccount();
	}
	else
		$scope.account = {};
	
	$scope.error = false;
	$scope.errorMessage = "";
	$scope.loginProgress = false;

	function handleLogin ( result) {
		$scope.loginProgress = false;
		$scope.account = result;
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

	$scope.logout = function() {
		loginService.logout();
	}

	if(loginService.existsSavedLogin() && ($scope.loggedIn === false)) {
		$scope.loginProgress = true;
		loginService.loginResume().then( handleLogin, handleError);
	}
		
}
Cloobster.Login.$inject = ['$scope', 'facebookApi', 'login'];
