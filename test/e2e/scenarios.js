'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('../../frontend/index.html');
  });


  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/home");
  });


  describe('login', function() {

    beforeEach(function() {
      browser().navigateTo('#/login');
    });


    it('should render login when user navigates to /login', function() {
      expect(element('[ng-view] h1:first').text()).
        toMatch(/Login/);
    });
    
    it('should do a login and logout', function() {
    	input('loginData.login').enter('cloobster');
    	input('loginData.password').enter('test!1');
    	// Submit login form.
    	element(':submit').click();
    	expect(binding('getDisplayName()')).toBe('cloobster');
    	//expect(element('[ng-controller="Cloobster.Login"] a.dropdown-toggle').text()).toMatch(/cloobster/);
    	// Click logout
    	element('a[l="nav.logout"]').click();
    	expect(element('div[ng-show="loggedIn"]').css('display')).toBe('none');
    	expect(browser().location().url()).toBe("/home");
    });

  });
  
  describe('profile', function() {
	  beforeEach(function() {
	      browser().navigateTo('#/login');
	      input('loginData.login').enter('cloobster');
	      input('loginData.password').enter('test!1');
	      // Submit login form.
	      element(':submit').click();
	      browser().navigateTo('#/profile');
	  });
	  
	  it('should show change password dialog', function() {
		  expect(element('div#changePasswordModal').css('display')).toBe('none');
		  element('button[l="profile.account.action.changepassword"]').click();
		  expect(element('div#changePasswordModal').css('display')).not().toBe('none');
	  });
	  
	  it('should activate edit mode', function() {
		  expect(element('span[l="profile.account.action.edit.disable.hint"]').css('display')).toBe('none');
		  element('div.account-profile-wrapper button.btn-primary').click();
		  expect(element('span[l="profile.account.action.edit.disable.hint"]').css('display')).not().toBe('none');
	  });
	  
	  it('should edit account name', function() {
		  element('div.account-profile-wrapper button.btn-primary').click();
		  element('div[editor-property="account.name"]').click();
		  using('div[editor-property="account.name"]').input('editorValue').enter('New Name');
		  element('div[editor-property="account.name"] :submit').click();
		  expect(binding('account.name')).toBe('New Name');
	  });
  });

  describe('home', function() {

    beforeEach(function() {
      browser().navigateTo('#/home');
    });


    it('should render view2 when user navigates to /view2', function() {
    	
    });

  });
});
