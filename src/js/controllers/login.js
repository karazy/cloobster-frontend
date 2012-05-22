'use strict';

/* Login controller */


Cloobster.Login = function($scope, facebookApi) {
	$scope.fbLogout = function () {
		facebookApi.logout();
	};

	$scope.fbLogin = function() {
		facebookApi.login().then(function() {

		});
	};
}
Cloobster.Login.$inject = ['$scope', 'facebookApi'];
