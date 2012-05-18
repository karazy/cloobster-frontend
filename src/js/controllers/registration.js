'use strict';

/* Registration */


Cloobster.Registration = function($scope, $resource, Account) {
	//my code gose here ^^

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
		account,
		accountResource = $resource('/b/');

	$scope.save = function() {
		account = new Account($scope.account);
		account.$register();
	}

	$scope.cancel = function() {
		$scope.account = angular.copy(emptyAccount);
		$scope.emailRepeat = emptyAccount.email;
		$scope.passwordRepeat = emptyAccount.password;
	}


	$scope.cancel();
}
Cloobster.Registration.$inject = ['$scope', '$resource', 'Account'];
