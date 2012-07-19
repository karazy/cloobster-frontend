/** @module Cloobster/Accounts */
'use strict';

/**
* 	@name Cloobster.Accounts
*	@requires loginService
*
* 	Account controller.
*	Manages accounts for a company.
* 	
* 	@constructor
*/
Cloobster.Accounts = function($scope, $http, $routeParams, $location, loginService, CompanyAccount, Business, langService, $log, handleError, Company) {
	/** Logged in account. */
	var account,
		defaultAdmin = {
			"role" : "businessadmin"
		},
		defaultUser = {
			"role" : "cockpituser",
			"name" : "Cockpit User",
			"login" : "user"
		},
		company;

	/** Switches between admin and cockpit user tab. Possible values are 'admin' and 'cockpit' */
	$scope.tab = "admin";

	$scope.accountsResource = null;

	$scope.businessResource = null;
	//list of all admin accounts assigned to the current company
	$scope.admins = [];

	//list of all cockpit user accounts assigned to the current company
	$scope.users = [];

	/** Selected admin. Can be new or existing. */
	$scope.currentAdmin = null;

	/** Selected user. Can be new or existing. */
	$scope.currentUser = null;

	$scope.adminBusinesses = null;

	$scope.allBusinesses = null;

	$scope.emailValid = false;

	$scope.company = {};

	//admin account tab start	
	$scope.showAdminTab = function() {
		$scope.tab = "admin";		
	};

	$scope.createAdminAccount = function() {
		$scope.currentAdmin = new $scope.accountsResource(defaultAdmin);
	}

	$scope.loadAdminAccounts = function() {
		$scope.accountsResource = CompanyAccount.buildResource(account.companyId);
		$scope.admins = $scope.accountsResource.query({"role" : "businessadmin"}, null, null, handleError);

	};

	$scope.checkAdminAccountEmail = function() {
		var retrievedAccount = $http.get("/b/accounts/?email="+$scope.currentAdmin.email).success(function(data, status){
			if(!data || data.length == 0) {
				$scope.emailValid = true;
			} else if(!data.companyId){
				//an account with this email already exist. but is not assigned to a company. admin role can be granted

			} else {
				//this account is already assigned to another business
			}
		});
	};

	$scope.saveAdminAccount = function() {
		if($scope.currentAdmin && $scope.currentAdmin.id) {
			$scope.currentAdmin.$update(null, null, handleError);	
		} else {
			$scope.currentAdmin.$save(success, handleError);	
		}

		function success(account) {
			$scope.admins.push(account);
		}
	};

	$scope.loadAdminAccount = function(adminItem) {
		$scope.currentAdmin = adminItem;
	}

	$scope.loadAllBusinesses = function() {
		$scope.businessResource = Business.buildResource(account.id);
		$scope.allBusinesses = $scope.businessResource.query(null, null, null, handleError);
	};

	//admin account tab end

	//cockpit account tab start

	$scope.showCockpitTab = function() {
		$scope.tab = "cockpit";
	};

	$scope.loadCockpitAccounts = function() {
		$scope.accountsResource = CompanyAccount.buildResource(account.companyId);
		$scope.users = $scope.accountsResource.query({"role" : "cockpituser"}, null, null, handleError);
	};

	$scope.loadCockpitAccount = function(account) {
		$scope.currentUser = account;
	}

	$scope.createCockpitAccount = function() {
		//create a default login from the company name and the length of the user
		// set default name in the form "Company Cockpit User"
		$scope.currentUser = new $scope.accountsResource(defaultUser);
		$scope.currentUser['login'] = company['name'].replace(/\s+/g, '-').toLowerCase() + "-" + $scope.users.length;
		$scope.currentUser['name'] = company['name'] + " " + defaultUser['name'];

	}

	$scope.saveCockpitAccount = function() {
		var account = $scope.currentUser;
		if(account && account.id) {
			account.$update(null, null, handleError);	
		} else {
			account.$save(success, handleError);	
		}

		function success(newAccount) {
			$scope.passwordRepeat = "";
			$scope.users.push(newAccount);
		}
	};

	//cockpit account tab end

	/*
	* Get css class for field highlighting.
	* @returns error if dirty && invalid
	*		  sucess if dirty && !invalid
	*         empty string otherwise
	*/
	$scope.getFieldInputClass = function(dirty, invalid) {
		if(dirty && invalid) {
			return "error";
		} else if (dirty && !invalid) {
			return "success";
		} else {
			return "";
		}
	};

	/**
	* Checks if in registration form controller password and password repeat field match.
	* If they don't match sets the password repeat field as invalid.
	*/
	$scope.matchPasswords = function() {
		if($scope.userForm.password.$viewValue !== $scope.userForm.passwordRepeat.$viewValue) {
			$scope.userForm.passwordRepeat.$setValidity("match", false);
		} else {
			$scope.userForm.passwordRepeat.$setValidity("match", true);
		}
	}

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		if(newVal == true) {
			account = loginService.getAccount();
			$scope.loadAdminAccounts();
			$scope.loadAllBusinesses();
			$scope.loadCockpitAccounts();
			// Load company data for account info
			company = Company.buildResource().get({id: account.companyId}, null, null, handleError);
	}});	
}

Cloobster.Accounts.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'CompanyAccount', 'Business', 'lang', '$log', 'errorHandler', 'Company'];