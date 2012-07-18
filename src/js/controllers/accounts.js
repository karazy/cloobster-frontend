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
Cloobster.Accounts = function($scope, $http, $routeParams, $location, loginService, CompanyAccount, langService, $log, handleError) {
	/** Logged in account. */
	var account;

	/** Switches between admin and cockpit user tab. Possible values are 'admin' and 'cockpit' */
	$scope.tab = "admin";
	$scope.accountsResource;
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
		$scope.currentAdmin = {};
	}

	$scope.loadAdminAccounts = function() {
		$scope.accountsResource = CompanyAccount.buildResource(account.companyId);
		$scope.admins = $scope.accountsResource.query({"role" : "businessadmin"}, null, null, handleError);

	};

	$scope.checkAdminAccountEmail = function() {
		var retrievedAccount = $http.get("/b/accounts/?email="+$scope.currentAdmin.email).success(function(data, status){
			if(!data || !data.companyId) {
				$scope.emailValid = true;
			}
		});
	};

	$scope.saveAdminAccount = function() {

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
		}

	});	
}

Cloobster.Accounts.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'CompanyAccount', 'lang', '$log', 'errorHandler'];