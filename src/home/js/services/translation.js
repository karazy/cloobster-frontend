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
		"confirmemail.title" : {
			"DE" : "E-Mail Bestätigung",
			"EN" : "E-Mail Confirmation"
		},
		"confirmemail.success" : {
			"DE" : "Vielen Dank für die Bestätigung Ihrer E-Mailaddresse.<br>Wichtige Informationen zur Nutzung Ihres cloobster-Kontos werden an diese Addresse geschickt.",
			"EN" : "Thank you for confirming your e-mail address.<br>Important information concerning the usage of your cloobster account will be send to this address."
		},
		"confirmnewemail.title" : {
			"DE" : "E-Mail Änderung bestätigen",
			"EN" : "E-Mail change confirmation"
		},
		"confirmnewemail.success" : {
			"DE" : "Vielen Dank für die Bestätigung der Änderung Ihrer E-Mailaddresse.<br>Wichtige Informationen zur Nutzung Ihres cloobster-Kontos werden von jetzt ab an diese Addresse geschickt.",
			"EN" : "Thank you for confirming your e-mail address change.<br>Important information concerning the usage of your cloobster account will from now on be send to this address."
		}
	};

	$provide.value("translation", map);
}]);
