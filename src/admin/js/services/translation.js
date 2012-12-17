/** @module Cloobster/Translations */

/**
*	@name Cloobster.Translations
*	Module provides data used for translation.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
angular.module("CloobsterAdmin.translations", [], ["$provide", function($provide) {
	//holds all translations
	var map = {
		//general
		"common.warning.title" : {
			"DE" : "Achtung!",
			"EN" : "Warning!"
		},
		"common.hint.title" : {
			"DE" : "Hinweis!",
			"EN" : "Message!"
		},
		"common.ok" : {
			"DE" : "Ok",
			"EN" : "Ok"
		},
		"common.new" : {
			"DE" : "Neu",
			"EN" : "New"
		},
		"common.cancel" : {
			"DE" : "Abbrechen",
			"EN" : "Cancel"
		},
		"common.add" : {
			"DE" : "Hinzufügen",
			"EN" : "Add"
		},
		"common.delete" : {
			"DE" : "Löschen",
			"EN" : "Delete"
		},
		"common.save" : {
			"DE" : "Speichern",
			"EN" : "Save"
		},
		"common.search" : {
			"DE" : "Suchen",
			"EN" : "Search"
		},
		"common.password" : {
			"DE" : "Passwort",
			"EN" : "Password"
		},
		"common.remove" : {
			"DE" : "Entfernen",
			"EN" : "Remove"
		},
		"common.active" : {
			"DE" : "Aktiv",
			"EN" : "Active"
		},
		"common.inactive" : {
			"DE" : "Inaktiv",
			"EN" : "Inactive"
		},
		"common.copy" : {
			"DE" : "Kopie",
			"EN" : "Copy"
		},
		"common.help" : {
			"DE" : "Hilfe",
			"EN" : "Help"
		},
		"common.image.edit" : {
			"DE" :  "Bild anklicken um zu editieren",
			"EN" : "Click image to edit"
		},
		"common.all" : {
			"DE" :  "Alle",
			"EN" : "All"
		},
		"common.default.language" : {
			"DE" :  "- Standardsprache -",
			"EN" : "- default language -"
		},
		"common.action" : {
			"DE" :  "Aktion",
			"EN" : "Action"
		},
		"common.download" : {
			"DE" :  "Download",
			"EN" : ""
		},
		"general.sortable" : {
			"DE" : "Ziehen, um zu sortieren",
			"EN" : "Drag to sort"
		}
	}
	$provide.value("translation", map);
}]);