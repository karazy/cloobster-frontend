'use strict';

/* Registration controller*/


Cloobster.Registration = function($scope, $resource, Account, facebookApi) {
	//my code gose here ^^

	$scope.registered = false;
	$scope.error = false;

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
			} 
		},
		account;

	$scope.save = function() {
		account = new Account($scope.account);
		account.$register(function (account) { 
			$scope.registered = true;
		}, function (obj) { 
			$scope.error = true;
			$scope.errorValue = obj;
		});
	}

	$scope.cancel = function() {
		$scope.account = angular.copy(emptyAccount);
		$scope.emailRepeat = emptyAccount.email;
		$scope.passwordRepeat = emptyAccount.password;
	}
	//set default values on load
	$scope.cancel();

	$scope.fbLoggedIn = facebookApi.getLoggedIn();
	$scope.fbLoggedIn.then( function (result) {
		if(result === true) {
			facebookApi.getUser().then( function ( user ) {
				$scope.account.email = user.email;
				$scope.account.name = user.name;
			});
		}
	});
}
Cloobster.Registration.$inject = ['$scope', '$resource', 'Account', 'facebookApi'];
