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
			//registration partial
			"registration.title" : "Cloobster Registration",
			"registration.form.fullname" : "Name*",
			"registration.form.fullname.error.required" : "Teile uns deinen Namen mit",
			"registration.form.fullname.error.minlength" : "Der Name muss min. aus 3 Zeichen bestehen",
			"registration.form.login" : "Benutzername*",
			"registration.form.login.error.required" : "Such dir einen Benutzernamen aus",
			"registration.form.login.error.pattern" : 'Dein Benutzername muss zwischen 4-30 Zeichen lang sein. Es sind nur Kleinbuchstanen und "_" "-" "." erlaubt.',
			"registration.form.email" : "E-Mail*",
			"registration.form.email.error.required" : "Bitte gib deine E-Mail ein",
			"registration.form.email.error.email" : "Keine gültige E-Mail",
			"registration.form.emailrepeat" : "E-Mail wiederholen*",
			"registration.form.emailrepeat.error.match" : "Die beiden E-Mails stimmen nicht überein",
			"registration.form.password" : "Passwort*",
			"registration.form.password.error.required" : "Bitte gib ein Passwort ein.",
			"registration.form.password.error.pattern" : "Min. 6 Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
			"registration.form.passwordrepeat" : "Passwort wiederholen*",
			"registration.form.passwordrepeat.error.match" : "Passwörter stimmen nicht überein.",
			"registration.form.phone" : "Telefon",
			"registration.form.company" : "Firmenname*",
			"registration.form.company.error.required" : "Bitte gib deine Firma an.",
			"registration.form.address" : "Adresse*",
			"registration.form.address.error.required" : "Bitte gib deine Adresse an.",
			"registration.form.city" : "Stadt*",
			"registration.form.city.error.required" : "Bitte gib deine Stadt an.",
			"registration.form.postcode" : "Postleitzahl*",
			"registration.form.postcode.error.required" : "Bitte gib deine Postleitzahl an.",
			"registration.form.businessphone" : "Telefon geschäftlich",
			"registration.form.country" : "Land*",
			"registration.form.country.error.required" : "Bitte gib dein Land an an.",
			"registration.form.fullname.placeholder" : "Mein Name",
			"registration.form.login.placeholder" : "Mein Benutzername",
			"registration.form.email.placeholder" : "Meine E-Mail",
			"registration.form.emailrepeat.placeholder" : "E-Mail wiederholen",
			"registration.form.password.placeholder" : "Mein Passwort",
			"registration.form.passwordrepeat.placeholder" : "Passwort wiederholen",
			"registration.form.phone.placeholder" : "(optional) Meine Telefonnummer",
			"registration.form.company.placeholder" : "Meine Firma",
			"registration.form.address.placeholder" : "Meine Adresse",
			"registration.form.city.placeholder" : "Mein Firmensitz",
			"registration.form.postcode.placeholder" : "Meine Postleitzahl",
			"registration.form.businessphone.placeholder" : "(optional) Meine Firmen Telefonnummer",
			"registration.action.fblogin" : "Mit Facebook einloggen und Cloobster verknüpfen.",
			"registration.form.account.label" : "Meine Benutzerkontodaten",
			"registration.form.action.reset" : "Zurücksetzen",
			"registration.form.action.register" : "Registrieren",
			"registration.form.company.label" : "Meine Firmendaten",
			"registration.form.submit.message" : "Vielen dank für die Registrierung {{account.name}},<br/>"+
					"eine E-mail mit Bestätigungslink wurde an {{account.email}} gesendet.",
			//businesses partial
			"businesses.title" : "Meine Restaurants",
			"businesses.add" : "Restaurant hinzufügen",
			"businesses.action.show" : "anzeigen/editieren",
			"businesses.action.spots" : "tische",
			"businesses.action.menus" : "menüs",
			"businesses.action.delete" : "löschen",
			"businesses.form.name" : "Name*",
			"businesses.form.description" : "Beschreibung*",
			"businesses.form.address" : "Addresse*",
			"businesses.form.city" : "Stadt*",
			"businesses.form.postcode" : "Postleitzahl*",
			"businesses.form.phone" : "Telefon",
			"businesses.form.currency" : "Währung",
			"businesses.form.error.required" : "Bitte füllen Sie das Feld aus.",
			"businesses.form.mandatory" : "Felder markiert mit * sind pflicht.",
			"businesses.dialog.delete" : "Restaurant löschen",
			"business.dialog.delete.text" : "{{activeBusiness.name}} und alle assozierten Daten werden gelöscht.",
			//business detail partial
			"business.action.edit.enable" : "Editiermodus aktivieren",
			"business.action.edit.disabled" : "Editiermodus beenden",
			"business.action.edit.disable.hint" : "Profileigenschaft anklicken um zu editieren.",
			"business.detail.logo.editor.title" : "Logo",
			"business.detail.picture1.editor.title" : "Profilbild 1",
			"business.detail.picture2.editor.title" : "Profilbild 2",
			"business.detail.picture3.editor.title" : "Profilbild 3",
			"business.detail.logo.button" : "Logo hinzufügen",
			"business.detail.picture1.button" : "Profilbild 1 hinzufügen",
			"business.detail.picture2.button" : "Profilbild 2 hinzufügen",
			"business.detail.picture3.button" : "Profilbild 3 hinzufügen",
			"business.detail.picture.edit" : "Bild anklicken zum editieren",
			"business.detail.description" : "Beschreibung",
			"business.detail.slogan" : "Slogan",
			"business.detail.address" : "Adresse",
			"business.detail.city" : "Stadt",
			"business.detail.postcode" : "Postleitzahl",
			"business.detail.phone" : "Telefon",
			"business.detail.currency" : "Währung",
			"business.detail.paymentmethods" : "Bezahlarten",
			"business.detail.paymentmethods.list.new" : "Neue Bezahlart",
			//profile partial
			"profile.title" : "Profil",
			"profile.account.name" : "Name",
			"profile.account.email" : "E-Mail",
			"profile.company.action.edit.enable" : "Editiermodus aktivieren",
			"profile.company.action.edit.disable" : "Editiermodus beenden",
			"profile.company.action.edit.disable.hint" : "Profileigenschaft anklicken um zu editieren.",
			"profile.company.address" : "Adresse",
			"profile.company.city" : "Stadt",
			"profile.company.postcode" : "Postleitzahl",
			"profile.company.phone" : "Telefon",
			"profile.company.url" : "Homepage",
			"profile.company.country" : "Land",
			"profile.company.address.editor.title" : "Adresse",
			"profile.company.city.editor.title" : "Stadt",
			"profile.company.postcode.editor.title" : "Postleitzahl",
			"profile.company.phone.editor.title" : "Telefon",
			"profile.company.url.editor.title" : "Homepage",
			//menus partial
			"menus.title" : "Menüs",
			"menus.list.new" : "Neues Menü...",
			"menus.list.orphaned" : "Verwaiste Produkte",
			"menus.list.orphaned.tooltip" : "Nicht zugewiesene Produkte anzeigen",
			"menus.menu.field.active" : "Menü dem Gast anzeigen",
			"menus.menu.delete" : "Menü löschen",
			"menus.menu.dialog.delete.title" : "Menü {{currentMenu.title}} löschen",
			"menus.menu.dialog.delete.text" : "<strong>{{currentMenu.title}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!<br/>Produkte werden nicht gelöscht.",
			"menus.products.title" : "Produkte",
			"menus.products.list.new" : "Neues Produkt...",
			"menus.products.list.existing" : "Bestehendes Produkt...",
			"menus.products.link.title" : "Alle Produkte",
			"menus.products.link.action.copy" : "Kopieren",
			"menus.products.link.action.copylink" : "Kopieren und Auswahlmöglichkeiten verknüpfen",
			"menus.products.link.action.deepcopy" : "Kopieren inklusive Auswahlmöglichkeiten",
			"menus.product.copy.name" : "-Kopie",
			"menus.products.link.description" : "Klicke auf eine bestehendes Produkt, um dieses zu kopieren und dem aktuellen Menü hinzuzufügen. Wahlweise können zusätzlich <strong>Auswahlmöglichkeiten verknüpft</strong> oder <strong>kopiert werden</strong>.",
			"menus.products.orphaned.title" : "Verwaiste Produkte",
			"menus.products.orphaned.description" : "Liste aller Produkte die keinem Menü zugeordnet sind.",
			"menus.editor.title.tooltip" : "Titel editieren",
			"menus.editor.description.tooltip" : "Beschreibung editieren",
			"product.editor.name.tooltip" : "Name editieren",
			"product.editor.shortDesc.tooltip" : "Kurzbeschreibung editieren",
			"product.editor.longDesc.tooltip" : "Beschreibung editieren",
			"product.editor.price.tooltip" : "Preis editieren",
			"menus.product.field.active" : "Produkt dem Gast anzeigen",
			"menus.product.delete" : "Produkt löschen",
			"menus.product.action.move" : "Verschieben nach ...",
			"menus.product.action.move.tooltip" : "Verschiebt das aktuelle Produkt<br/>in ausgewähltes Menü.",
			"menus.product.dialog.delete.title" : "Produkt {{currentProduct.name}} löschen",
			"menus.product.dialog.delete.text" : "<strong>{{currentProduct.name}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!",
			"menus.choices.title" : "Auswahlmöglichkeiten",
			"menus.choices.list.new" : "Neue Auswahl...",
			"menus.choices.list.existing" : "Bestehende Auswahl...",
			"menus.choices.list.linked" : "Abhängige Auswahl",
			"menus.choices.list.remove.tooltip" : "Auswahl von diesem Produkt entfernen.", 
			"menus.choices.link.description" : "Klicke auf eine bestehende Auswahlmöglichkeit, um diese mit dem aktuellen Produkt zu <strong>verknüpfen</strong> oder zu <strong>kopieren</strong>.<br/>Es werden keine abhängigen Auswahlen angezeigt.",
			"menus.choices.link.title" : "Alle Auswahlmöglichkeiten",
			"menus.choices.link.search" : "Suchen: ",
			"menus.choices.link.action.copy" : "Kopieren",
			"menus.choices.link.action.link" : "Verknüpfen",
			"menus.options.title" : "Optionen",
			"menus.options.list.new" : "Neue Option...",
			"menu.editor.title" : "Titel",
			"menu.editor.description" : "Beschreibung",
			"product.editor.name" : "Name",
			"product.editor.price" : "Preis",
			"product.editor.price.validation" : "Muss ein gültiger Preis sein (z.B. 9.95, oder 5).",
			"product.editor.shortDesc" : "Kurz Beschreibung",
			"product.editor.longDesc" : "Lange Beschreibung",
			"choice.editor.text" : "Auswahltext",
			"choice.editor.maxOccurence" : "Maximale Auswahl von Optionen",
			"choice.editor.minOccurence" : "Minimale Auswahl von Optionen",
			"choice.editor.included" : "Anzahl von Inklusivoptionen",
			"menus.choices.field.maxOccurence" : "Max. Auswahl: {{currentChoice.maxOccurence}} ",
			"menus.choices.field.minOccurence" : "Min. Auswahl: {{currentChoice.minOccurence}} ",
			"menus.choices.field.included" : "Optionen Inklusive: {{currentChoice.included}} ",
			"menus.choices.field.price" : "Preis: {{currentChoice.price | kcurrency:activeBusiness.currency}}",
			"menus.choices.field.linkedchoices" : "Untergeordnete Auswahlen",
			"menus.choices.field.linkedproducts" : "Wird verwendet in ...",
			"menus.choices.field.linkedproducts.help" : "Listet alle Produkte auf<br/> die diese Auswahlmöglichkeit verwenden.",
			"menus.choices.action.remove" : "Auswahl von Produkt entfernen",
			"choice.editor.text.tooltip" : "Auswahltext editieren",
			"choice.editor.price.tooltip" : "Preis editieren",
			"choice.editor.maxOccurence.tooltip" : "Maximale Optionsauswahl editieren",
			"choice.editor.minOccurence.tooltip" : "Minimale Optionsauswahl editieren",
			"choice.editor.included.tooltip" : "Anzahl inklusiv<br/>Optionen editieren",
			"option.editor.name.tooltip" : "Name für Option editieren",
			"option.editor.price.tooltip" : "Preis für Option editieren",
			"menu.new.default.title" : "Mein Menü",
			"product.new.default.name" : "Mein Produkt",
			"choice.new.default.text" : "Meine Auswahlmöglichkeit",
			"option.new.default.name" : "Meine Option",
			"menus.choices.field.overridePrice.label" : "Preisberechnung:",
			"menus.choices.field.overridePrice.none" : "nichts",
			"menus.choices.field.overridePrice.overridesingleprice" : "Einheitspreis pro Produkt",
			"menus.choices.field.overridePrice.overridefixedsum" : "Gesamtsumme (z. B. Menü)",
			"menus.choices.field.parentselect.label" : "Übergeordnete Auswahl:",
			"menus.choices.field.parentselect.nullparent" : "--- auswählen ---",
			"menus.choices.parentselect.tooltip" : "Ein hier ausgewähltes Element führt dazu, dass diese Auswahlmöglichkeit nur aktiv wird, "+
				"wenn der Kunde im übergeordneten Element eine Auswahl trifft.",
			"menus.choices.linkedchoices.tooltip" : "Auflistung aller Auswahlmöglichkeiten die von dieser abhängen.",
			//spots partial
			"spots.title" : "Tische",
			"spots.list.new" : "Neuer Tisch...",
			"spots.editor.name" : "Name",
			"spots.editor.barcode" : "Barcode",
			"spots.editor.name.tooltip" : "Name editieren",
			"spots.editor.barcode.tooltip" : "Barcode editieren",
			//general
			"common.warning.title" : "Warnung!",
			"common.ok" : "Ok",
			"common.cancel" : "Abbrechen",
			"common.add" : "Hinzufügen",
			"common.delete" : "Löschen",
			"common.save" : "Speichern",
			"common.search" : "Suchen",
			"general.sortable" : "Ziehen um zu sortieren",
			//breadcrumb
			"breadcrumb.home" : "Home",
			"breadcrumb.businesses" : "Restaurants",
			"breadcrumb.menus" : "Menüs",
			"breadcrumb.tables" : "Tische",
			//file upload
			"fileupload.button.add" : "Bild auswählen ...",
			"fileupload.image.label" : "Ausgewähltes Bild: ",
			"fileupload.button.submit.saving" : "Speichere ...",
			"fileupload.submit.error" : "Beim Hochladen ist ein Fehler aufgetreten.",
			"propertyeditor.error.required" : "Bitte einen Text eingeben.",
			"propertyeditor.error.number" : "Bitte eine Zahl eingeben.",
			"propertyeditor.error.email" : "Bitte eine gültige E-Mail-Adresse eingeben.",
			//common error messages
			"common.error.404" : "Eine Ressource konnte nicht geladen werden.",
			"common.error" : "Es gibt ein Problem mit der Verbindung zum Service."
		},
		"EN" : {
		//index
			"product.brand" : "Cloobster",
			"nav.logout" : "Logout",
			"nav.login": "Login",
			"nav.restaurants" : "Restaurants",
			"nav.menus" : "Menus",
			"nav.about" : "About",
			"nav.profile" : "Profile",
			"nav.registration" : "Register",
			//businesses partial
			"businesses.title" : "My Restaurants",
			"businesses.add" : "Add restaurant",
			"businesses.action.show" : "show/edit",
			"businesses.action.menus" : "menus",
			"businesses.action.delete" : "delete",
			"businesses.form.name" : "Name*",
			"businesses.form.description" : "Description*",
			"businesses.form.address" : "Address*",
			"businesses.form.city" : "City*",
			"businesses.form.postcode" : "Postcode*",
			"businesses.form.phone" : "Phone",
			"businesses.form.error.required" : "Please fill out the field.",
			"businesses.form.mandatory" : "Fields marked with * are required.",
			"businesses.dialog.delete" : "Delete Restaurant",
			"business.dialog.delete.text" : "{{activeBusiness.name}} and all data will be deleted!",
			//business detail partial
			"business.detail.logo.editor.title" : "Logo",
			"business.detail.picture1.editor.title" : "Profile picture 1",
			"business.detail.picture2.editor.title" : "Profile picture 2",
			"business.detail.picture3.editor.title" : "Profile picture 3",
			"business.detail.picture.edit" : "Click the picture to edit.",
			//menus partial
			"menus.title" : "Menus",
			"menus.list.new" : "New Menu ...",
			"menus.menu.field.active" : " Active: Show menu to guests.",
			"menus.products.title" : "Products",
			"menus.products.list.new" : "New Product...",
			"menus.editor.title.tooltip" : "edit title",
			"menus.editor.description.tooltip" : "edit description",
			"product.editor.name.tooltip" : "edit name",
			"product.editor.shortDesc.tooltip" : "edit short description",
			"product.editor.longDesc.tooltip" : "edit description",
			"product.editor.price.tooltip" : "edit price",
			"product.editor.price.validation" : "Must be a valid price (e.g. 5.95 or 10).",
			"menus.product.field.active" : " Active: Show product to guests.",
			"menus.choices.title" : "Choices",
			"menus.choices.list.new" : "New choice ...",
			"menus.choices.list.existing" : "Add existing choice ...",
			"menus.choices.link.description" : "Click on an existing choice, to add to the product as a <strong>link</strong>(changes to the choice will be reflected in all linked products) or create a <strong>copy</strong> with independent data.",
			"menus.choices.link.title" : "All Choices",
			"menus.choices.link.search" : "Search: ",
			"menus.choices.link.action.copy" : "Copy",
			"menus.choices.link.action.link" : "Link",
			"menus.options.title" : "Options",
			"menus.options.list.new" : "New option...",
			"menu.editor.title" : "Title",
			"menu.editor.description" : "Description",
			"product.editor.name" : "Name",
			"product.editor.price" : "Price",
			"product.editor.shortDesc" : "Short description",
			"product.editor.longDesc" : "Long description",
			"menu.new.default.title" : "My menu",
			"product.new.default.name" : "My product",
			"choice.new.default.text" : "My choice",
			"option.new.default.name" : "My option",
			"menus.choices.field.overridePrice.label" : "Price calculation:",
			"menus.choices.field.overridePrice.none" : "none",
			"menus.choices.field.overridePrice.overridesingleprice" : "One price for all",
			"menus.choices.field.overridePrice.overridefixedsum" : "All options included (e.g. Menu)",
			//general
			"common.warning.title" : "Warning!",
			"common.ok" : "Ok",
			"common.cancel" : "Cancel",
			"common.add" : "Add",
			"common.delete" : "Delete",
			"common.save" : "Save",
			"common.search" : "Search",
			"general.sortable" : "Drag to sort elements",
			//file upload
			"fileupload.button.add" : "Choose picture ...",
			"fileupload.image.label" : "Selected picture: ",
			"fileupload.button.submit.saving" : "Saving ...",
			"fileupload.submit.error" : "An error occured during the upload.",
			"propertyeditor.error.required" : "Please input a text.",
			"propertyeditor.error.number" : "Please input a number.",
			"propertyeditor.error.email" : "Please input a valid e-mail adress.",
			//general error messages
			"common.error.404" : "A resource could not be found.",
			"common.error" : "There is a problem with the connection to the service."
		}
	}

	$provide.value("translation", map);
}]);
