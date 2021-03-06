/** @module CloobsterAdmin */
'use strict';

CloobsterAdmin.Package = function($scope, $http, $log, Subscription, Company, CompanyConfiguration, Location, LocationSubscription, $routeParams, WhitelabelConfiguration, errorHandler) {

	//available template subscriptions
	$scope.packages = null;
	//active subscription
	$scope.currentPackage = null;
	//ui flag, toggling a view of a table showing all templates or single template view
	$scope.showAllPackages = false;	
	//subscriptions with status pending
	$scope.pendingSubscriptions = null;
	//map of locations grouped by subscription id
	$scope.locationsPendingMap = null;
	//all companies
	$scope.companies = null;
	//map of locations grouped by company id
	$scope.locationsMap = null;
	//Resource to interact with configurations
	$scope.companyConfigResource = null;

	// $scope.whitelabels = 
	// 	[{
	// 				key: 'net.karazy.cloobster',
	// 				name: 'Cloobster (default)'
	// 			},
	// 			{
	// 				key: 'net.karazy.cloobster.frizz',
	// 				name: 'FRIZZ'
	// 			},
	// 			{
	// 				key: 'net.karazy.cloobster.darmstadt',
	// 				name: 'Darmstadt'
	// 	}];

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
	$scope.showCompanies = function() {
		$scope.activeTab = 'locations';
		$scope.loadCompanies();
	}

	/**
	* Set given company active 
	* and load locations and whitelabel config.
	*/
	$scope.loadCompany = function(company) {
		$scope.currentCompany = company;

		//load correnspaonding locations and whitelabel config
		$scope.loadLocationsForCompany(company);				
		$scope.loadWhitelabelConfig(company);
	}

	

	/**
	* Load all avail companies.
	*/
	$scope.loadCompanies = function() {
		$scope.companies = Company.query(angular.noop, errorHandler);
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
			loadWelcomeSpot(location);
		}		
		//load welcome Spot
	}

	$scope.loadSubscriptionsForLocation = function(location) {
		location.subscriptions = LocationSubscription.query({'bid' : location.id});
	}

	function loadWelcomeSpot (location) {
		
		if(!location) {
			$log.log('Wizard: cannot load welcome spot without location');
			return;
		}

		$http.get('/admin/m/locations/' + location.id + '/welcomespot').success(function(response) {
			location.welcomeSpot = response;
		});
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
		$scope.pendingSubscriptions = Subscription.query(
			{'status' : 'PENDING'},
			success);

		function success() {
			angular.forEach($scope.pendingSubscriptions, function(subscription) {
				$scope.loadLocationForPendingSubscriptions(subscription);
			})
		}
	}

	$scope.loadLocationForPendingSubscriptions = function(subscription) {

		if(!subscription) {
			$log.log('loadLocationForPendingSubscriptions: no subscription given');
			return;
		}

		if(!subscription.businessId) {
			$log.log('loadLocationForPendingSubscriptions: subscription has no businessId');
			return;	
		}

		$scope.locationsPendingMap = $scope.locationsPendingMap || {};

		$scope.locationsPendingMap[subscription.businessId] = Location.get(
			{ 'id' : subscription.businessId },

			function(response) {
				if(response.activeSubscriptionId) {
					//if an active subscription exist load it
					$scope.locationsPendingMap[subscription.businessId].activeSubscription = LocationSubscription.get({'id' : response.activeSubscriptionId, 'bid' : subscription.businessId});
				}
			}

		);

	}

	$scope.approvePendingSubscription = function(subscription, location) {
		var updatedSubscription;

		if(!subscription) {
			$log.log('approvePendingSubscription: no subscription given');
			return;
		}

		if(subscription.status != "PENDING") {
			$log.log('approvePendingSubscription: status not pending');
			return;
		}

		if(subscription.template || !subscription.templateId) {
			$log.log('approvePendingSubscription: subscription is a template');
			return;
		}


		updatedSubscription = {
			id: subscription.id,
			name: subscription.name,
			fee: subscription.fee,
			maxSpotCount: subscription.maxSpotCount,
			basic: subscription.basic,
			templateId: subscription.templateId,
			businessId: subscription.businessId,
			status: 'APPROVED'
		}

		updatedSubscription = new LocationSubscription(updatedSubscription);

		updatedSubscription.$update(function() {			
			if(location) {
				$scope.loadSubscriptionsForLocation(location);
			} else {
				//set status of original subscription to change state in ui
				subscription.status = 'APPROVED';
			}
		});
	}

	$scope.cancelPendingSubscription = function(subscription, location) {
		var updatedSubscription;

		if(!subscription) {
			$log.log('approvePendingSubscription: no subscription given');
			return;
		}

		if(subscription.status != "PENDING") {
			$log.log('approvePendingSubscription: status not pending');
			return;
		}

		if(subscription.template || !subscription.templateId) {
			$log.log('approvePendingSubscription: subscription is a template');
			return;
		}

		updatedSubscription = {
			id: subscription.id,
			name: subscription.name,
			fee: subscription.fee,
			maxSpotCount: subscription.maxSpotCount,
			basic: subscription.basic,
			templateId: subscription.templateId,
			businessId: subscription.businessId,
			status: 'CANCELED'
		}

		updatedSubscription = new LocationSubscription(updatedSubscription);

		updatedSubscription.$update(function() {
			if(location) {
				$scope.loadSubscriptionsForLocation(location);
			} else {
				//set status of original subscription to change state in ui
				subscription.status = 'CANCELED';
			}			
		});
	}

	$scope.setLocationToCopy = function(locationToCopy) {
		if(!locationToCopy) {
			return;
		}
		$scope.targetAccount = null;
		$scope.locationToCopy = locationToCopy;		
		$scope.startCopyLocation.disabled = false;
	};

	$scope.setTargetAccount = function(account) {
		$scope.targetAccount = account;
	};

	$scope.startCopyLocation = function() {
		if(!$scope.locationToCopy || !$scope.targetAccount)
			return;
		$scope.startCopyLocation.disabled = true;

		$http.post('/admin/m/locations',{'copyId': $scope.locationToCopy.id, 'ownerAccountId': $scope.targetAccount.id})
			.success(function() {	
				$scope.startCopyLocation.disabled = false;
				$('#copyLocationModal').modal('hide');
			});

	};

	//Configuration Handling

	$scope.loadWhitelabels = function() {
		$scope.whitelabels = $scope.whitelabelResource.query();
	}

	$scope.loadWhitelabelConfig = function(company) {
		if(!company) {
			$log.log('CloobsterAdmin.Package.loadConfiguration: no company given');
			return;
		}

		if(!company.configuration) {
			company.configuration = {};
		}

		if(!company.whitelabel) {
			company.whitelabel = {};
		}

		company.configuration.whitelabel = $scope.companyConfigResource.get({id: company.id, name: 'whitelabel'}, onSuccess, onError);

		function onSuccess(response) {
			company.configuration.whitelabel = response;
			company.whitelabel.key = response.key;
		}

		function onError(_response, _status, _headers, _config) {
			if(_response.status == 404) {
				//create new configuration
				company.configuration.whitelabel = new $scope.companyConfigResource();

				company.configuration.whitelabel.$update({id: company.id, name: 'whitelabel'}, angular.noop, errorHandler);

			} else {
				errorHandler(_response, _status, _headers, _config);
			}
		}
	}

	$scope.saveConfiguration = function(company) {
		if(!company.configuration) {
			$log.log('CloobsterAdmin.Package.saveConfiguration: no company.configuration exists');
			return;
		}

		company.configuration.whitelabel.key = company.whitelabel.key;

		company.configuration.whitelabel.$update({id: company.id, name: 'whitelabel'} , angular.noop, errorHandler);
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

	$scope.companyConfigResource = CompanyConfiguration.buildResource();
	$scope.whitelabelResource = WhitelabelConfiguration.buildResource();

	$scope.activeTab = 'locations';
	$scope.loadPackages();
	$scope.loadWhitelabels();
	$scope.loadCompanies();	

}

CloobsterAdmin.Package.$inject = ['$scope', '$http', '$log', 'Subscription', 'Company', 'CompanyConfiguration', 'Location', 'LocationSubscription','$routeParams', 'WhitelabelConfiguration', 'errorHandler'];
