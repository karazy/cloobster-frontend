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
	var location;

	/**
	*
	*/
	$scope.getActive = function(path) {
		location = $location.path();		
		//TODO matches benutzen um subpfade abzudecken
		return (path == location) ? "active" : "";
	}

};
Cloobster.Navigation.$inject = ['$scope', '$location', 'login'];