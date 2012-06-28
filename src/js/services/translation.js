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
			"nav.menus" : "Menüs",
			"nav.about" : "Über",
			"nav.profile" : "Profil",
			"nav.registration" : "Registrieren",
			//businesses partial
			"businesses.title" : "Meine Restaurants",
			"businesses.add" : "Restaurant hinzufügen",
			"businesses.action.show" : "anzeigen/editieren",
			"businesses.action.menus" : "menüs",
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
			"business.dialog.delete.text" : "{{activeBusiness.name}} und alle assozierten Daten werden gelöscht.",
			//business detail partial
			"business.detail.logo.dialog.title" : "Logo",
			"business.detail.picture1.dialog.title" : "Profilbild 1",
			"business.detail.picture2.dialog.title" : "Profilbild 2",
			"business.detail.picture3.dialog.title" : "Profilbild 3",
			"business.detail.picture.edit" : "Bild anklicken zum editieren",
			//menus partial
			"menus.title" : "Menüs",
			"menus.list.new" : "Neues Menü...",
			"menus.menu.field.active" : " Aktiv: Menü dem Gast anzeigen",
			"menus.products.title" : "Produkte",
			"menus.products.list.new" : "Neues Produkt...",
			"menus.product.field.active" : " Aktiv: Produkt dem Gast anzeigen",
			"menus.choices.title" : "Auswahlmöglichkeiten",
			"menus.choices.list.new" : "Neue Auswahl...",
			"menus.options.title" : "Auswahlmöglichkeiten",
			"menus.options.list.new" : "Neue Option...",
			"menu.editor.title" : "Titel",
			"menu.editor.description" : "Beschreibung",
			"product.editor.name" : "Name",
			"product.editor.price" : "Preis",
			"product.editor.shortDesc" : "Kurz Beschreibung",
			"product.editor.longDesc" : "Lange Beschreibung",
			"menu.new.default.title" : "Mein Menü",
			"product.new.default.name" : "Mein Produkt",
			"choice.new.default.text" : "Meine Auswahlmöglichkeit",
			"option.new.default.name" : "Meine Option",
			//general
			"common.warning.title" : "Warnung!",
			"common.ok" : "Ok",
			"common.cancel" : "Abbrechen",
			"common.add" : "Hinzufügen",
			"common.delete" : "Löschen",
			"common.save" : "Speichern",
			//file upload
			"fileupload.button.add" : "Bild auswählen ...",
			"fileupload.image.label" : "Ausgewähltes Bild: ",
			"fileupload.button.submit.saving" : "Speichere ...",
			"fileupload.submit.error" : "Beim Hochladen ist ein Fehler aufgetreten."
		},
		"EN" : {
			"product.brand" : "Cloobster {{loggedIn}}",
			"business.dialog.delete.text" : "{{activeBusiness.name}} will be eradicated!!!"
		}
	}

	$provide.value("translation", map);
}]);
