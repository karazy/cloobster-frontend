'use strict';

/* jasmine specs for controllers go here */

describe('Cloobster.Login', function() {
    var ctrl,
        facebookApiMock,
        loginServiceMock,
        scope;

    beforeEach(function(){
        scope = {
            loggedIn: false
        };
        module('Cloobster.services');
        inject(function($injector) {
            loginServiceMock = $injector.get('login');
            facebookApiMock = $injector.get('facebookApi');
        });

        spyOn(loginServiceMock, 'getAccount');

        ctrl = new Cloobster.Login(scope, facebookApiMock, loginServiceMock);
    });


    it('should retrieve account if already logged in', function() {
        scope.loggedIn = true;
        ctrl = new Cloobster.Login(scope, facebookApiMock, loginServiceMock);

        expect(loginServiceMock.getAccount).toHaveBeenCalled();
    });
});
