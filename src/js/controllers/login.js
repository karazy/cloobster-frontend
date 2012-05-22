'use strict';

/* Login controller */


Cloobster.Login = function($scope, facebookApi) {
	$scope.fbLoggedIn = facebookApi.getLoggedIn();
	$scope.fbUser = {};
	$scope.fbLoggedIn.then( function (result) {
		if(result === true) {
			$scope.fbUser = facebookApi.getUser();	
		}
	});

	$scope.fbLogout = function () {
		facebookApi.logout();
		$scope.fbLoggedIn = false;
	}
}
Cloobster.Login.$inject = ['$scope', 'facebookApi'];
