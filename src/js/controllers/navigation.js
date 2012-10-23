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
Cloobster.Navigation = function($scope, $location, loginService, Company,$routeParams,handleError,Business,$route,$log) {
	var businessResource = null;

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
		return active ? "active" : "";
	}

	$scope.activeBusinessId = null;
	$scope.canSwitchBusiness = false;

	if($routeParams['businessId']) {
		$scope.activeBusinessId = parseInt($routeParams['businessId']);
		$scope.canSwitchBusiness = true;
	}

	$scope.switchBusiness = function() {
		if($location.url().match(/^\/businesses\/.+\/menus.*/) ) {
			$location.path('/businesses/'+$scope.activeBusinessId+'/menus');
		}
		if($location.url().match(/^\/businesses\/.+\/spots.*/) ) {
			$location.path('/businesses/'+$scope.activeBusinessId+'/spots');
		}
		if($location.url().match(/^\/businesses\/\d+$/) ) {
			$location.path('/businesses/'+$scope.activeBusinessId);	
		}
	};
	

	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue === true) {
			$scope.company = Company.getActiveCompany();
			$scope.businesses = Business.getActiveBusinesses();
			if($scope.businesses.length > 0 && !$scope.activeBusinessId) {
				$scope.activeBusinessId = $scope.businesses[0].id;
			}
		}
	});
};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login', 'Company','$routeParams','errorHandler','Business','$route','$log'];
