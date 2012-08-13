'use strict';

/**
*
* Tests account logic. E.g. password reset.
*/
describe('Cloobster.Profile', function() {
	var scope;
	
	//before
	beforeEach(function() {
		scope = {
            loggedIn: false
        };
		
//        module('Cloobster.Profile');
//
//        inject(function($injector) {
//            loginServiceMock = $injector.get('login');
//           // location = $injector;
//            facebookApiMock = $injector.get('facebookApi');
//        });

        //spyOn(loginServiceMock, 'getAccount');
        //Account Controller Dependencies
        //$scope, $http, $routeParams, $location, $filter, loginService, CompanyAccount, Business, langService, $log, handleError, Company
        this.profileCtrl = new Cloobster.Profile(scope);
	});

	it('should show changed login name', function() {
		//navigate to profile page
		browser().navigateTo('http://localhost:8888/frontend/#/profile');
		//activate edit mode
		this.profileCtrl.toggleEditMode('Account');
		
		expect(this.profileCtrl.editModeAccount).toBe(true);
		//click on login name
	});

});