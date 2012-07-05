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
Cloobster.Navigation = function($scope, $location, loginService) {
	/**
	*
	*/
	$scope.getActive = function(path) {
		return ($location.path().indexOf(path) === 0) ? "active" : "";
	}

};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login'];
