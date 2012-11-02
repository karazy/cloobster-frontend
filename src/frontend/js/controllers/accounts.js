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
Cloobster.Accounts = function($scope, $http, $routeParams, $location, $filter, loginService, CompanyAccount, Business, langService, $log, handleError, Company) {
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
		company,
		adminActivationUrlHash = /\/?accounts\/setup\/.*/,
		//temp token used for admin account activation
		adminActivationToken = null;

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

	$scope.adminInvalid = null;

	$scope.adminExists = null;

	$scope.adminAssigned = null;

	$scope.company = {};

	/** Password set during admin activation. */
	$scope.adminActivationPassword = null;

	//Drag&Drop for admin business assignment
	jQuery( "#assignedBusinessesList, #allBusinessesList" ).sortable({
		connectWith: ".organizable-list",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "sortable-placeholder",
		receive: function(event, ui) { 
			$scope.moveBusiness(event, ui);
		}
	}).disableSelection();

	//Drag&Drop for cockpit business assignment
	jQuery( "#assignedCockpitBusinessesList, #allCockpitBusinessesList" ).sortable({
		connectWith: ".organizable-list",
		dropOnEmpty: true,
		forcePlaceholderSize: true,
		placeholder: "sortable-placeholder",
		receive: function(event, ui) { 
			$scope.moveCockpitBusiness(event, ui);
		}
	}).disableSelection();



	//admin account tab start	
	$scope.showAdminTab = function() {
		$scope.tab = "admin";		
	};

	$scope.createAdminAccount = function() {
		$scope.currentAdmin = new $scope.accountsResource(defaultAdmin);
		$scope.emailValid = false;
	}

	$scope.loadAdminAccounts = function() {
		$scope.accountsResource = CompanyAccount.buildResource(account.companyId);
		$scope.admins = $scope.accountsResource.query({"role" : "businessadmin"}, null, null, handleError);

	};

	$scope.checkAdminAccountEmail = function() {
		var retrievedAccount = $http.get("/b/accounts/?email="+$scope.currentAdmin.email).success(function(data, status){
			if(!data || data.length == 0) {
				$scope.emailValid = true;
				$scope.adminInvalid = null;
				$scope.adminExsistsMessage = null;
				$scope.adminAssigned = null;
				$scope.adminExists = null;
				$scope.currentAdmin.name = null;
			} else if(!data[0].companyId){
				//an account with this email already exist. but is not assigned to a company. admin role can be granted
				$scope.adminInvalid = null;
				$scope.adminAssigned = null;
				$scope.adminExists = true;
				$scope.emailValid = true;
				$scope.currentAdmin.name = data[0].name;
			} else if(data[0].companyId == account.companyId){
				//this account is already assigned to this company				
				$scope.adminExists = null;
				$scope.adminAssigned = true;
				$scope.adminInvalid = null;				
			} else {
				//this account is already assigned to another business
				$scope.adminExists = null;
				$scope.adminAssigned = null;
				$scope.adminInvalid = true;
				$scope.currentAdmin.name = null;								
			}
		}).error(handleError);
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
		if(!$scope.currentAdmin.businessIds) {
			$scope.currentAdmin.businessIds = new Array();
		}
	}

	$scope.loadAllBusinesses = function() {
		$scope.businessResource = Business.buildResource(account.id);
		$scope.allBusinesses = $scope.businessResource.query(null, null, null, handleError);
	};

	$scope.filterAssignedBusinesses = function(businessToFilter) {
		var result = true;

		if(!$scope.currentAdmin) {
			return true;
		};

		angular.forEach($scope.currentAdmin.businessIds, function(element, key) {
			if(element == businessToFilter.id) {
				result = false;
				return false;
			}
		});
		return result;
	}

	$scope.filterNotAssignedBusinesses = function(businessToFilter) {
		var result = false;

		if(!$scope.currentAdmin) {
			return true;
		};

		angular.forEach($scope.currentAdmin.businessIds, function(element, key) {
			if(element == businessToFilter.id) {
				result = true;
				return false;
			}
		});
		return result;
	}


	$scope.moveBusiness = function(event, ui) {
		$log.log("moveProduct");
		var business = angular.element(ui.item).scope().business,
			destinationList = ui.sender.attr("id") == "assignedBusinessesList" ? $scope.allBusinesses : $scope.adminBusinesses;

		//remove business from user
		if(ui.sender.attr("id") == "assignedBusinessesList") {
			angular.forEach($scope.currentAdmin.businessIds, function(element, index) {
				if(element == business.id) {
					$scope.currentAdmin.businessIds.splice(index, 1);
					$scope.saveAdminAccount();
					return false;
				};
			});
		} else {
			//add business to list
			$scope.currentAdmin.businessIds.push(business.id);
			$scope.saveAdminAccount();
		}
	};

	$scope.deleteAdminAccount = function(adminUserToDelete) {
		adminUserToDelete.$delete(angular.noop, handleError);

		angular.forEach($scope.admins, function(admin, index) {
			if(admin.id == adminUserToDelete.id) {
				$scope.admins.splice(index, 1);
				return false;
			}
		});

		$scope.currentAdmin = null;

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
		$scope.passwordRepeat = "";
		if(!$scope.currentUser.businessIds) {
			$scope.currentUser.businessIds = new Array();
		}
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
			account.$update(updateSuccess, handleError);
		} else {
			account.$save(createSuccess, handleError);
		}

		function updateSuccess(newAccount) {
			$scope.passwordRepeat = "";
		}

		function createSuccess(newAccount) {
			$scope.passwordRepeat = "";
			$scope.users.push(newAccount);
			$scope.currentUser = null;
		}
	};

	$scope.filterAssignedCockpitBusinesses = function(businessToFilter) {
		var result = true;

		if(!$scope.currentUser) {
			return true;
		};

		angular.forEach($scope.currentUser.businessIds, function(element, key) {
			if(element == businessToFilter.id) {
				result = false;
				return false;
			}
		});
		return result;
	}

	$scope.filterNotAssignedCockpitBusinesses = function(businessToFilter) {
		var result = false;

		if(!$scope.currentUser) {
			return true;
		};

		angular.forEach($scope.currentUser.businessIds, function(element, key) {
			if(element == businessToFilter.id) {
				result = true;
				return false;
			}
		});
		return result;
	}

	$scope.moveCockpitBusiness = function(event, ui) {
		var business = angular.element(ui.item).scope().business;

		//remove business from user
		if(ui.sender.attr("id") == "assignedCockpitBusinessesList") {
			angular.forEach($scope.currentUser.businessIds, function(element, index) {
				if(element == business.id) {
					$scope.currentUser.businessIds.splice(index, 1);
					$scope.saveCockpitAccount();
					return false;
				};
			});
		} else {
			//add business to list
			$scope.currentUser.businessIds.push(business.id);
			$scope.saveCockpitAccount();
		}
	};

	$scope.deleteCockpitAccount = function(cockpitUserToDelete) {
		cockpitUserToDelete.$delete(angular.noop, handleError);

		angular.forEach($scope.users, function(user, index) {
			if(user.id == cockpitUserToDelete.id) {
				$scope.users.splice(index, 1);
				return false;
			}
		});

		$scope.currentUser = null;

	};

	//cockpit account tab end

	//admin account activation start

	$scope.completeAdminActivation = function() {

		if(!adminActivationToken) {
			$log.warn("No admin activation token!");
			return;
		};

		if(!$scope.adminActivationPassword) {
			$log.warn("No password set.");
			return;
		}

		if($scope.accountActivationForm.$invalid) {
			$log.warn("Activation form is invalid.");
			return;
		}

		$http.put("/b/accounts/setup/" + adminActivationToken, {
			"password" : $scope.adminActivationPassword
		}).success(function(data, status) {
			$scope.adminActivationPassword = null;
			adminActivationToken = null;
			
			//set login name and show login form
			loginService.setPresetLogin(data.email);
			$location.url("/login");
		}).error(function(data,status,config,headers) {
			handleError(data,status,config,headers);
			
			if(status == 404) {
				// acccess token no longer exists
				$location.path('/');
			}
		});
	};

	//admin account activation end

	//utility methods start

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
	$scope.matchPasswords = function(form) {
		if(form.password.$viewValue !== form.passwordRepeat.$viewValue) {
			form.passwordRepeat.$setValidity("match", false);
		} else {
			form.passwordRepeat.$setValidity("match", true);
		}
	}

	//utility methods end

	$scope.$watch('loggedIn', function(newVal, oldVal) {
		if(newVal == true) {
			account = loginService.getAccount();
			if(account['role'] == "businessadmin") {
				$scope.tab = 'cockpit';
			}
			$scope.loadAdminAccounts();
			$scope.loadAllBusinesses();
			$scope.loadCockpitAccounts();
			// Load company data for account info
			company = Company.buildResource().get({id: account.companyId}, null, null, handleError);
	}});

	//Check if URL is an account activation
	if($location.url().match(adminActivationUrlHash) || $location.hash().match(adminActivationUrlHash)) {
		adminActivationToken = $routeParams.token;
		if(adminActivationToken) {
			$log.log("extract activation token " + adminActivationToken);
		} else {
			$location.url("/home");
		}
	}
}

Cloobster.Accounts.$inject = ['$scope', '$http', '$routeParams', '$location', '$filter', 'login', 'CompanyAccount', 'Business', 'lang', '$log', 'errorHandler', 'Company'];