'use strict';

/* Registration */


Cloobster.Registration = function($scope, $resource, Account) {
	//my code gose here ^^

	$scope.registered = false;
	$scope.error = false;

	var emptyAccount = {
			'name' : 'Hans Dampf',
			'login' : 'hdampf',
			'email' : 'dampf@karazy.net',
			'password' : 'test',
			'phone' : '12345',
			'company' : {
				'name' : 'Karazy GmbH',
				'address' : 'Krautgärten 15',
				'city' : 'Eschborn',
				'country' : 'Germany',
				'postcode' : '123456',
				'phone' : '123456'
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
}
Cloobster.Registration.$inject = ['$scope', '$resource', 'Account'];
