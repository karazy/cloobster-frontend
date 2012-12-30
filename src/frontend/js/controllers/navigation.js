/** @module Cloobster/Navigation */
'use strict';

/**
* 	@name Cloobster.Navigation 
*	@requires $location
*	@requires Clooobster.Services.login
*
* 	Profile controller 
* 	View and manage profiles.
* 	@constructor
*/
Cloobster.Navigation = function($scope, $location, loginService, Company,$routeParams,handleError,Business,$route,$log, $rootScope, Spot) {
	var businessResource = null;

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

	//if activeBusinessId changes reload welcome spot
	$scope.$watch('activeBusinessId', function(newValue, oldValue) {
		if(newValue) {
			$scope.loadWelcomeSpot();	
		} else {
			$scope.welcomeSpots = null;
		}	
	});

	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue === true) {
			$scope.company = Company.getActiveCompany();
			$scope.businesses = Business.getActiveBusinesses();			
		}
	});

	// var howtostep = $location.search('howto');
	if($routeParams['howto']) {
		$scope.howtoMode = true;
		$scope.howtoStep = $routeParams['howto'];
	}
};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login', 'Company','$routeParams','errorHandler','Business','$route','$log','$rootScope', 'Spot'];
