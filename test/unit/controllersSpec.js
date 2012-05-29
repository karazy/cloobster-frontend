'use strict';

/* jasmine specs for controllers go here */

describe('Cloobster.Login', function() {
    var ctrl,
        facebookApiMock,
        loginServiceMock,
        scope;

    beforeEach(function(){
        scope = {};
        loginServiceMock = jasmine.createSpyObject('login', ['existsSavedLogin']);
        ctrl = new Cloobster.Login(scope, facebookApiMock, loginServiceMock);
    });


    it('should ....', function() {
      //spec body
    });
});
