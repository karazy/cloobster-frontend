/** @module Cloobster/Translations */

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
			//index
			"product.brand" : "Cloobster",
			"nav.logout" : "Logout",
			"nav.login": "Login",
			"nav.restaurants" : "Restaurants",
			"nav.about" : "Über",
			"nav.profile" : "Profil",
			"nav.registration" : "Registrieren",
			//businesses partial
			"businesses.title" : "Meine Restaurants",
			"businesses.add" : "Restaurant hinzufügen",
			"businesses.action.show" : "anzeigen/editieren",
			"businesses.action.delete" : "löschen",
			"businesses.form.name" : "Name*",
			"businesses.form.description" : "Beschreibung*",
			"businesses.form.address" : "Address*",
			"businesses.form.city" : "Stadt*",
			"businesses.form.postcode" : "Postleitzahl*",
			"businesses.form.phone" : "Telefon",
			"businesses.form.error.required" : "Bitte füllen Sie das Feld aus.",
			"businesses.form.mandatory" : "Felder markiert mit * sind pflicht.",
			"businesses.dialog.delete" : "Restaurant löschen",
			"business.dialog.delete.text" : "und alle assozierten Daten werden gelöscht.",
			//general
			"common.warning.title" : "Warnung!",
			"common.ok" : "Ok",
			"common.cancel" : "Abbrechen",
			"common.add" : "Hinzufügen",
			"common.delete" : "Löschen"
		},
		"EN" : {
			"product.brand" : "Cloobster {{loggedIn}}"
		}
	}

	$provide.value("translation", map);
}]);
