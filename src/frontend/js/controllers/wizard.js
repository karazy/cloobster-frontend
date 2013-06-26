/** @module Cloobster/Wizard */
'use strict';

/**
* 	@name Cloobster.Wizard 
*	@requires $location
*	@requires Clooobster.Services.login
*
* 	Profile controller 
* 	View and manage wizard.
* 	@constructor
*/
Cloobster.Wizard = function($scope, $location, loginService, Company, $routeParams, handleError, Business, $route, $log, $rootScope, Spot, $injector, InfoPage, Menu, Product) {
	var businessResource = null;

	/* Holds data of wizard. */
	$scope.wizard = {
		offers : [{}, {}, {}]
	};

	$scope.imageResource =	Business.buildImageResource();

	$scope.cond = function(expression, trueValue, falseValue) {
		return (expression ? trueValue : falseValue);
	};

	/**
	* Checks if given path is the active path.
	* @param path
	*	Path to check
	* @param suffix
	*	Check for appended suffix. If true tries to exactly match location and path.
	*   If a string than just looks if the suffix is contained in url.
	* @return
	*	true if path is active, false otherwise
	*/
	$scope.getActive = function(path, suffix) {
		return $scope.isActive(path, suffix) ? "active" : "";
	}

	$scope.isActive = function(path, suffix) {
		var location = $location.path(),
			active;
			
		//check if given path is part of real path
		active = $location.path().indexOf(path) === 0;

		if(suffix) {
			if(suffix === true) {
				active = (location == path);
			}
			else {
				active = active && location.indexOf(suffix, location.length - suffix.length) !== -1;	
			}
		}

		return active;
	};

	$scope.businesses = Business.getActiveBusinesses();
	$scope.company = Company.getActiveCompany();

	$scope.$on('update-businesses', function() {
		$scope.businesses = Business.getActiveBusinesses(true);
	});

	if(!$rootScope.activeBusinessId) {
		$rootScope.activeBusinessId = $scope.businesses.length > 0 ? $scope.businesses[0]['id'] : null;	
	}
	

	$scope.canSwitchBusiness = false;

	if($routeParams['businessId']) {
		$rootScope.activeBusinessId = parseInt($routeParams['businessId']);
		$scope.canSwitchBusiness = true;
	}

	$scope.switchBusiness = function() {
		var newPath = $location.path().replace(/^\/businesses\/\d+/, '/businesses/'+$scope.activeBusinessId);
		$rootScope.activeBusinessId = $scope.activeBusinessId;
		$location.path(newPath);
	};
	
	$scope.$watch('businesses.length', function (newValue, oldValue) {
		if(!$rootScope.activeBusinessId && (newValue > 0)) {
			$rootScope.activeBusinessId = $scope.businesses[0]['id'];
		} 
	});

	/**
	* Filter given business based on trash status.
	* @return
	*	true if not trashed
	*/
	$scope.filterTrashedBusiness = function(business) {
		return !business.trash;
	}

	/**
	* Adds a new business.
	* @param businessName
	*	Name for the new business
	*/
	$scope.addNewBusiness = function() {
		var account;

		if(!$scope.newBusiness.name) {
			return;
		}

		if(!$scope.businessResource) {
			account = loginService.getAccount();
			$scope.businessResource = Business.buildResource(account.id);	
		}

		

		$scope.newBusinessEntity = new $scope.businessResource($scope.newBusiness);

		$scope.newBusinessEntity.$save(function(response) {
			$scope.$broadcast('update-businesses');
			$location.url('/businesses/'+response.id+'?howto=1');
		}, handleError);
	};

	/**
	* Load welcome spot for active business.
	*/
	$scope.loadWelcomeSpot = function() {

		if(!$scope.spotResource) {
			$scope.spotResource = Spot.buildResource($rootScope.activeBusinessId);
		}

		$scope.welcomeSpots = $scope.spotResource.query({'bid' : $rootScope.activeBusinessId, 'welcome' : true});
	}

	if($location.url() == "/howto") {
		//if activeBusinessId changes reload welcome spot
		$scope.$watch('activeBusinessId', function(newValue, oldValue) {
			if(newValue) {
				$scope.loadWelcomeSpot();	
			} else {
				$scope.welcomeSpots = null;
			}	
		});
	}

	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue === true) {
			$scope.company = Company.getActiveCompany();
			$scope.businesses = Business.getActiveBusinesses(false, checkBusinessesCount);					
		}
	});

	/**
	* @private
	*	If no locations exist redirect to howto page.
	*/
	function checkBusinessesCount() {
		if($scope.businesses && $scope.businesses.length == 0) {
			$location.url("/howto");
		}
	}

	// var howtostep = $location.search('howto');
	if($routeParams['howto']) {
		$scope.howtoMode = true;
		$scope.howtoStep = $routeParams['howto'];
	}

	//wizard logic
	$scope.generateApp = function() {
		if(!$scope.wizard) {
			//no wizard data
			return;
		}

		$scope.wizardForm.$dirty = true;
		$scope.wizardForm.newLocationName.$dirty = true;
		$scope.wizardForm.infopageDescription.$dirty = true;
		$scope.wizardForm.offer1Title.$dirty = true;
		$scope.wizardForm.offer1Shortdesc.$dirty = true;
		$scope.wizardForm.offer1Price.$dirty = true;

		if($scope.wizardForm.$valid) {
			//fire initial creation event
			// $rootScope.$broadcast('wizard-create-app', $scope.wizard);
			addBusinessByWizard($scope.wizard, locationCreated);
		}

		function locationCreated(location) {
			addInfopageByWizard($scope.wizard, location);
			addProductsByWizard($scope.wizard, location);
		}
	}

	//create business
	function addBusinessByWizard(wizardData, callback) {
		var resource,
			entity;

		if(!wizardData && !wizardData.newLocationName) {
			console.error('Wizard: cannot save business without name');
			return;
		}

		console.log('Wizard: generate business: ' + wizardData.newLocationName);

		resource = Business.buildResource(loginService.getAccount().id);
		entity = new resource({
			"name": wizardData.newLocationName
		});

		entity.$save(function(response) {
			// wizardData.locationId = entity.id;
			// $rootScope.$broadcast('wizard-created-business', wizardData, entity.id);
			$scope.$broadcast('update-businesses');		
			$scope.createdBusiness = entity;
			callback(entity);
		}, handleError);
	}

	//create infopage
	function addInfopageByWizard(wizardData, location) {
		var infopage,
			resource;

		if(!wizardData && !wizardData.infopageDescription) {
			console.error('Wizard: cannot create infopage without data');
			return;
		}

		if(!location && !location.id) {
			console.error('Wizard: cannot create infopage without location id');
			return;
		}
		

		resource = InfoPage.buildResource(location.id);
		infopage = new resource({ 'translations' : {} });

		infopage.title = "Über uns";
		infopage.html = wizardData.infopageDescription;
		infopage.$save(function() {
			$rootScope.$broadcast('wizard-created-infopage');	
		}, handleError);
	}

	function addProductsByWizard(wizardData, location) {
		var mResource,
			pResource,
			menu,
			product;

		if(!wizardData) {
			console.error('Wizard: cannot create products without data');
			return;
		}

		if(!location && !location.id) {
			console.error('Wizard: cannot create products without location id');
			return;
		}

		mResource = Menu.buildResource(location.id);
		pResource = Product.buildResource(location.id);

		menu = new mResource({
			title: "Angebote",
			active: true
		});

		menu.$save(saveProducts, handleError);

		function saveProducts() {
			angular.forEach(wizardData.offers, function(offer, key) {

				if(offer.title && offer.shortDesc && offer.price) {
					product = new pResource({
						name: offer.title,
						shortDesc: offer.shortDesc,
						longDesc: offer.shortDesc,
						price: offer.price,
						menuId: menu.id,
						active: true
					});	

					product.choices = new Array();
					product.$save();
				}
		
			});
		}

		
		

	}

};
Cloobster.Wizard.$inject = ['$scope', '$location', 'login', 'Company', '$routeParams', 'errorHandler', 'Business', '$route', '$log', '$rootScope', 'Spot', '$injector', 'InfoPage', 'Menu', 'Product'];
