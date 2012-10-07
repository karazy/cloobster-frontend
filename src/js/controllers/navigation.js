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
	*	Check for appended suffix.
	* @return
	*	true if path is active, false otherwise
	*/
	$scope.getActive = function(path, suffix) {
		var location = $location.path(),
			active;
		$log.info('Cloobster.Navigation.getActive');
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
	if($routeParams['businessId']) {
		$scope.activeBusinessId = parseInt($routeParams['businessId']);
	}

	$scope.switchBusiness = function() {
		if($location.url().match(/^\/businesses\/.+\/menus.*/) ) {
			$location.path('/businesses/'+$scope.activeBusinessId+'/menus');
		}
		if($location.url().match(/^\/businesses\/.+\/spots.*/) ) {
			$location.path('/businesses/'+$scope.activeBusinessId+'/spots');
		}
	};
	

	$scope.$watch('loggedIn', function(newValue, oldValue) {
		if(newValue === true) {
			var account = loginService.getAccount();

			$scope.company = Company.getActiveCompany();	

			businessResource = Business.buildResource(account.id);
			$scope.businesses = businessResource.query(null, null, function() {
				if(!$scope.activeBusinessId) {
					$scope.activeBusinessId = $scope.businesses[0].id;	
				}
			}, handleError);

		}
	});

};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login', 'Company','$routeParams','errorHandler','Business','$route','$log'];
