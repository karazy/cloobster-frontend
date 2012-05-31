'use strict';
/** Unit testing registration controller. */

describe("Cloobster.Registration", function {
	var ctrl,
		scope,
		account;

	//setup necessary functions and members
	beforeEach(function(){ 
		scope = {
			account: {
				name : 'Hans Dampf'
			}
		};
		module('Cloobster.services');
        inject(function($injector) {
            loginServiceMock = $injector.get('login');
            facebookApiMock = $injector.get('facebookApi');
            accountMock = $injector.get('Account');
        });

		//$scope, $resource, $location, Account, facebookApi, $routeParams, loginService
		ctrl = new Cloobster.Registration(scope, $resource, $location, accountMock, facebookApiMock, $routeParams, loginServiceMock);
	});

	//test form reset
	it("should clear form on cancel call", function() {

		scope.cancel();

		expect(scope.account.name).toEqual("");

	});



});