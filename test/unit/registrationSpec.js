'use strict';
/* Jasmine unit testing registration controller. */

describe("Cloobster.Registration", function() {
	var ctrl,
		scope,
		account,
		dummyAccount = {
			'name' : 'Hans Dampf',
			'login' : 'hdampf',
			'email' : 'dampf@karazy.net',
			'password' : 'geheim!1',
			'phone' : '12345',
			'company' : {
				'name' : 'Karazy GmbH',
				'address' : 'Strasse',
				'city' : 'Eschborn',
				'country' : 'DE',
				'postcode' : '12345',
				'phone' : '12345'
			}
		},
		$httpBackend;

	//setup necessary functions and members
	beforeEach(function() { 		
		module('Cloobster.services');
		
        inject(function(_$httpBackend_, $rootScope, $controller) {
            scope = $rootScope.$new();
            
            $httpBackend = _$httpBackend_; 	   


            ctrl = $controller(Cloobster.Registration, {$scope: scope});
            
            scope.account = angular.copy(dummyAccount);

        });       
	});

	//test form reset
	it("should clear form on cancel call", function() {
		
		expect(scope.account.name).toEqual("Hans Dampf");
		expect(scope.account.login).toEqual("hdampf");
		expect(scope.account.password).toEqual("geheim!1");
		
		scope.cancel();

		expect(scope.account.name).toEqual("");
		expect(scope.account.login).toEqual("");
		expect(scope.account.password).toEqual("");
	});

	//test save
	it("save should set registered on success", function() {
		$httpBackend.expectPOST('/b/accounts').respond(dummyAccount);
		expect(scope.registered).toBe(false);		
		scope.save();
		//flush request queue
		$httpBackend.flush();
		expect(scope.registered).toBe(true);
	});


	it("save should set error on failure", function() {
		$httpBackend.expectPOST('/b/accounts').respond(500, "");
		expect(scope.error).toBe(false);
		scope.save();
		//flush request queue
		$httpBackend.flush();
		expect(scope.error).toBe(true);
		$httpBackend.verifyNoOutstandingExpectation();
	});

	//test getFieldInputClass
	it("getFieldInputClass should return error", function() {
		var result;
		
		result = scope.getFieldInputClass(true, true);

		expect(result).toEqual("error");
	});

	it("getFieldInputClass should return success", function() {
		var result;
		
		result = scope.getFieldInputClass(true, false);

		expect(result).toEqual("success");
	});

	it("getFieldInputClass should return empty string", function() {
		var result;
		
		result = scope.getFieldInputClass(false, false);

		expect(result).toEqual("");
	});


	
	
});