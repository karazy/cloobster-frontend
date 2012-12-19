/** @module CloobsterAdmin */
'use strict';

CloobsterAdmin.Package = function($scope, $http, $log, Subscription, Company, Location, LocationSubscription) {

	//available template subscriptions
	$scope.packages = null;
	//active subscription
	$scope.currentPackage = null;
	//ui flag, toggling a view of a table showing all templates or single template view
	$scope.showAllPackages = false;	
	//subscriptions with status pending
	$scope.pendingSubscriptions = null;
	//all companies
	$scope.companies = null;
	//map of locations grouped by company id
	$scope.locationsMap = null;

	//Manage subscription template functions start
	$scope.loadPackages = function() {
		$scope.packages = Subscription.query({ 'template' : true});
	}

	$scope.showPackage = function(p) {
		$scope.showAllPackages = false;
		$scope.currentPackage = p;
	}

	$scope.showPackages = function() {
		$scope.currentPackage = null;
		$scope.showAllPackages = true;
	}

	$scope.newPackage = function() {
		$scope.showAllPackages = false;
		$scope.currentPackage = new Subscription();
	}

	$scope.savePackage = function(reload) {
		if(!$scope.currentPackage) {
			return;
		}

		if(!$scope.currentPackage.id) {
			$scope.currentPackage.$save(
			function(response) {
						
				if(reload || $scope.currentPackage.basic) {
					$scope.loadPackages();
				} else {
					$scope.packages.push(response);
				}

				$scope.currentPackage = null;		
			});
		} else {
			$scope.currentPackage.$update(
			function(response) {
				if(reload) {
					$scope.loadPackages();
				}
			});
		}

	}

	$scope.deletePackage = function() {
		if(!$scope.currentPackage) {
			return;
		}

		$scope.currentPackage.$delete(
			success,
			function() {alert('handle error')}
		);

		function success() {
			
			angular.forEach($scope.packages, function(p, index) {
				if(p.id == $scope.currentPackage.id) {
					$scope.packages.splice(index, 1);
					$scope.currentPackage = null;
					//exit loop
					return false;
				}
			});
		}
	}

	$scope.setCurrentPackageAsBasic = function() {
		if(!$scope.currentPackage) {
			return;
		}

		$scope.currentPackage.basic = true;		
		$scope.savePackage(true);
	}

	$scope.setBasicPackage = function(packageToSet) {
		if(!packageToSet) {
			return;
		}

		packageToSet.basic = true;

		packageToSet.$update(
			function(response) {
				$scope.loadPackages();
			});
	}


	//Manage subscription template functions start

	$scope.loadCompanies = function() {
		$scope.companies = Company.query(success);

		function success(response) {
			angular.forEach(response, function(company) {
				$scope.loadLocationsForCompany(company);
			});
		}
	}


	$scope.loadLocationsForCompany = function(company) {
		if(!company) {
			$log.log('loadLocationsForCompany: no company provided')
			return;
		}

		$scope.locationsMap = $scope.locationsMap || {};

		$scope.locationsMap[company.id] = Location.query({'companyId' : company.id});
	}

	$scope.showLocationDetail = function(location) {
		jQuery('#details_'+location.id).toggle();
		jQuery('#toggle_open_'+location.id).toggle();
		jQuery('#toggle_close_'+location.id).toggle();
		//load subscriptions
		if(jQuery('#details_'+location.id).is(":visible")) {
			$scope.loadSubscriptionsForLocation(location);	
		}
	}

	$scope.loadSubscriptionsForLocation = function(location) {
		location.subscriptions = LocationSubscription.query({'bid' : location.id});
	}

	$scope.setActivePackageForLocation = function(location) {
		var newSubscription;

		if(!location) {
			$log.log('setActivePackageForLocation: no location provided');
			return;
		}

		if(!location.tempSubscription) {
			$log.log('setActivePackageForLocation: no tempSubscription set');
			return;
		}

		// if(!$scope.packages) {
		// 	$log.log('setActivePackageForLocation: no packages available');
		// }

		// angular.forEach($scope.packages, function(p) {
		// 	if(p.id == )
		// })
		
		newSubscription = {
			name: location.tempSubscription.name,
			fee: location.tempSubscription.fee,
			maxSpotCount: location.tempSubscription.maxSpotCount,
			basic: location.tempSubscription.basic,
			templateId: location.tempSubscription.id,
			status: 'APPROVED'
		}

		newSubscription = new LocationSubscription(newSubscription);

		// delete newSubscription.id;
		newSubscription.$save({'bid' : location.id},
			function() {
				$scope.loadSubscriptionsForLocation(location);
			});

		delete location.tempSubscription;
	

	}

	//pending subscription tab functions

	$scope.loadPendingSubscriptions = function() {
		$scope.activeTab = 'pending';
		$scope.pendingSubscriptions = Subscription.query({'status' : 'PENDING'});
	}


	//General Functions

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
	}

	/** Initialization. */

	$scope.activeTab = 'locations';
	$scope.loadPackages();
	$scope.loadCompanies();

}

CloobsterAdmin.Package.$inject = ['$scope', '$http', '$log', 'Subscription', 'Company', 'Location', 'LocationSubscription'];
