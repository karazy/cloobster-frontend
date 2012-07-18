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
Cloobster.Accounts = function($scope, $http, $routeParams, $location, loginService, CompanyAccount, Business, langService, $log, handleError) {
	/** Logged in account. */
	var account,
		defaultAdmin = {
			"role" : "businessadmin"
		};

	/** Switches between admin and cockpit user tab. Possible values are 'admin' and 'cockpit' */
	$scope.tab = "admin";

	$scope.accountsResource = null;

	$scope.businessResource = null;
	//list of all admin accounts assigned to the current company
	$scope.admins;
	/** Selected admin. Can be new or existing. */
	$scope.currentAdmin = null;

	$scope.adminBusinesses = null;

	$scope.allBusinesses = null;

	$scope.emailValid = false;

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

	$scope.loadAccount = function(adminItem) {
		$scope.currentAdmin = adminItem;
	}

	$scope.loadAllBusinesses = function() {
		$scope.businessResource = Business.buildResource(account.id);
		$scope.allBusinesses = $scope.businessResource.query();
	};

	//admin account tab end

	//cockpit account tab start

	$scope.showCockpitTab = function() {
		$scope.tab = "cockpit";
	};

	//cockpit account tab end


	$scope.$watch('loggedIn', function(newVal, oldVal) {

		if(newVal == true) {
			//load pots
			// $scope.loadSpots(businessId);	
			account = loginService.getAccount();
			$scope.loadAdminAccounts();
			$scope.loadAllBusinesses();
		}

	});	
}

Cloobster.Accounts.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'CompanyAccount', 'Business', 'lang', '$log', 'errorHandler'];