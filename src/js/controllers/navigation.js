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
Cloobster.Navigation = function($scope, $location, loginService, Company,$routeParams,handleError,Business) {
	var businessResource = null;
	/**
	*
	*/
	$scope.getActive = function(path) {
		return ($location.path().indexOf(path) === 0) ? "active" : "";
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
Cloobster.Navigation.$inject = ['$scope', '$location', 'login', 'Company','$routeParams','errorHandler','Business'];
