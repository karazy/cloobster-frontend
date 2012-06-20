/* @module Cloobster/Translations */

/**
*	@name Cloobster.Translations
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("Cloobster.translations", [], ["$provide", function($provide) {
	//holds all translations
	var map = {
		"DE" : {
			"nav.restaurants" : "Restaurants",
			"nav.about" : "Über",
			"nav.registration" : "Registrieren",
			"business.title" : "Meine Restaurants",
			"business.add" : "Restaurant hinzufügen"

		},
		"EN" : {

		}
	}

	$provide.value("translation", map);
}]);
