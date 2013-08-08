/** @module Cloobster/InfoPage */
'use strict';


/**
* 	@name Cloobster.Externals
*
* 	Controller for external Data ProvidersInfopage controller 
* 	@constructor
*/

Cloobster.Externals = function($scope, lang) {

	var baseFolder = 'partials/externals/';
	/**
	* List of all external providers.
	*/
	$scope.externals = [
		{
			name: lang.translate('externals.de.ztix.name'),
			template: baseFolder + 'de_ztix_config.html',
			configuration: 'de.ztix'
		}
	]

}

Cloobster.Externals.$inject = ['$scope', 'lang'];