'use strict';

/* Registration controller*/


Cloobster.Registration = function($scope, $resource, Account, facebookApi) {
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
			'facebookUid' : null
		},
		account,
		setFbUserData = function(user) {
			$scope.account.email = user.email;
			$scope.emailRepeat = user.email;
			$scope.account.name = user.name;
			$scope.account.facebookUid = user.id;
			$scope.fbConnected = true;
		};

	$scope.registered = false;
	$scope.error = false;
	$scope.fbConnected = false;

	$scope.isLoggedInAndNotFbConnected = function() {
		return ( !$scope.fbConnected && $scope.fbLoggedIn );
	}

	$scope.save = function() {
		account = new Account($scope.account);
		account.$register(function (account) { 
			$scope.registered = true;
		}, function (obj) { 
			$scope.error = true;
			$scope.errorValue = obj;
		});
	};

	$scope.cancel = function() {
		$scope.account = angular.copy(emptyAccount);
		$scope.emailRepeat = emptyAccount.email;
		$scope.passwordRepeat = emptyAccount.password;
	};

	$scope.connectFb = function() {
		facebookApi.getUser().then( setFbUserData );
	};

	$scope.loginAndConnectFb = function() {
		facebookApi.login().then( facebookApi.getUser ).then( setFbUserData );
	};

	//set default values on load
	$scope.cancel();
}
Cloobster.Registration.$inject = ['$scope', '$resource', 'Account', 'facebookApi'];
