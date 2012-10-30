/** @module Cloobster/Translations */

/**
*	@name Cloobster.Translations
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("Cloobster.translations", [], ["$provide", function($provide) {
	/** @const holds all translated strings */
	var map = {
		"common.save" : {
			"DE" : "Speichern",
			"EN" : "Save"
		},
		"common.saving" : {
			"DE" : "Speichert ...",
			"EN" : "Saving ..."
		},
		"common.done" : {
			"DE" : "Fertig",
			"EN" : "Done"
		},
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
		},
		"passwordreset.title" : {
			"DE" : "Passwort Wiederherstellen",
			"EN" : "Password Reset"
		},
		"passwordreset.complete" : {
			"DE" : "Das neue Passwort wurde erfolgreich gespeichert.",
			"EN" : "The new password was saved successfully."
		},
		"passwordreset.description" : {
			"DE" : "Bitte ein neues Passwort für das Konto eingeben.",
			"EN" : "Please enter a new password for the account."
		},
		"passwordreset.newpassword" : {
			"DE" : "Neues Passwort",
			"EN" : "New Password"
		},
		"passwordreset.newpassword.placeholder" : {
			"DE" : "Passwort eingeben",
			"EN" : "enter a password"
		},
		"passwordreset.newpassword.error.required" : {
			"DE" : "Ein neues Passwort eingeben.",
			"EN" : "Enter a new password."
		},
		"passwordreset.newpassword.error.pattern" : {
			"DE" : "Min. sechs Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
			"EN" : "At least six characters. Must contain one letter and one number or special character."
		},
		"passwordreset.newpasswordrepeat" : {
			"DE" : "Neues Passwort wiederholen",
			"EN" : "Repeat new password"
		},
		"passwordreset.newpasswordrepeat.placeholder" : {
			"DE" : "Passwort hier wiederholen",
			"EN" : "repeat the new password"
		},
		"passwordreset.newpasswordrepeat.error.match" : {
			"DE" : "Passwörter stimmen nicht überein.",
			"EN" : "Passwords don't match."
		},
		"error.accesstoken.invalid" : {
			"DE" : "Der benutzte Link für diese Seite ist nicht mehr gültig.",
			"EN" : "The link that was used for accessing this page is no longer valid."
		}
	};

	$provide.value("translation", map);
}]);
