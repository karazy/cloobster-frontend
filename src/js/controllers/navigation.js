/** @module Cloobster/Navigation */
'use strict';

/**
* 	@name Cloobster.Profile 
*	@requires facebookApi
*	@requires loginService
*
* 	Profile controller 
* 	View and manage profiles.
* 	@constructor
*/
Cloobster.Navigation = function($scope, $location, loginService) {
	var location;

	/**
	*
	*/
	$scope.getActive = function(path) {
		location = $location.path();		
		return (path == location) ? "active" : "";
	}

};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login'];
