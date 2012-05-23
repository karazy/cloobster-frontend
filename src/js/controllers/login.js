'use strict';

/* Login controller */


Cloobster.Login = function($scope, facebookApi, loginService) {
	$scope.loginData = {
		login : "",
		password : ""
	}
	$scope.account = {};
	$scope.loginError = "";

	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	$scope.fbLogin = function() {
		facebookApi.login()
		.then( function (response) {
			loginService.loginFb( { uid: response.authResponse.userID, token: response.authResponse.accessToken } )
			.then( function( result ) { // resolved
				$scope.account = result;
			}, function(reason) { // rejected
				$scope.loginError = reason;
			});;
		});
	};

	$scope.login = function() {
		loginService.login( $scope.loginData ).then( function( result ) {
			$scope.account = result;
		}, function(reason) {
			$scope.loginError = reason;
		});
	}

	$scope.cloobsterFbLogin = function() {
		loginService.loginFb( { uid: facebookApi.getUid(), token: facebookApi.getAccessToken() } )
			.then( function( result ) { // resolved
				$scope.account = result;
			}, function(reason) { // rejected
				$scope.loginError = reason;
			});
	}
}
Cloobster.Login.$inject = ['$scope', 'facebookApi', 'login'];
