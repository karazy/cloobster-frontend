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
		//index
		"product.brand" : {
			"DE" : "Cloobster",
			"EN" : "Cloobster"
		},
		"nav.logout" : {
			"DE" : "Logout",
			"EN" : "Logout"
		},
		"nav.login" : {
			"DE:" : "Login",
			"EN": "Login"
		},
		"nav.restaurants" : {
			"DE" : "Betriebe",
			"EN" : "Businesses"
		},
		"nav.menus" : {
			"DE" : "Produkte",
			"EN" : "Products"
		},
		"nav.about" : {
			"DE" : "Über",
			"EN": "About"
		},
		"nav.profile" : {
			"DE" : "Profil",
			"EN" : "",
			"EN" : "Profile"
		},
		"nav.registration" : {
			"DE" : "Registrieren",
			"EN" : "Register"
		},
		"nav.accounts" : {
			"DE" : "Benutzerkonten",
			"EN" : "User accounts"
		},
		//registration partial
		"registration.title" : {
			"DE" : "Cloobster Registration",
			"EN" : "Cloobster Registration"
		},
		"registration.form.fullname" : {
			"DE" : "Name*",
			"EN" : "Name*"
		},
		"registration.form.fullname.error.required" : {
			"DE" : "Teile uns deinen Namen mit.",
			"EN" : "Tell us your Name."
		},
		"registration.form.fullname.error.minlength" : {
			"DE" : "Der Name muss min. aus 3 Zeichen bestehen",
			"EN" : "Name must consist at least of 3 characters."
		},
		"registration.form.login" : {
			"DE" : "Benutzername*",
			"EN" : "Username*"
		},
		"registration.form.login.error.required" : {
			"DE" : "Such dir einen Benutzernamen aus.",
			"EN" : "Choose a username."
		},
		"registration.form.login.error.pattern" : {
			"DE" : 'Dein Benutzername muss zwischen 4-30 Zeichen lang sein. Es sind nur Kleinbuchstanen und "_" "-" "." erlaubt.',
			"EN" : 'Your username must consist of 4-30 characters. Only lowercase and "_" "-" "." are permittet.'
		},
		"registration.form.email" : {
			"DE" : "E-Mail*",
			"EN" : "Email*"
		},
		"registration.form.email.error.required" : {
			"DE" : "Bitte gib deine E-Mail ein",
			"EN" : "Please enter your email."
		},
		"registration.form.email.error.email" : {
			"DE" : "Keine gültige E-Mail",
			"EN" : "No valid email."
		},
		"registration.form.emailrepeat" : {
			"DE" : "E-Mail wiederholen*",
			"EN" : "Email repeat*"
		},
		"registration.form.emailrepeat.error.match" : {
			"DE" : "E-Mails stimmen nicht überein.",
			"EN" : "Emails don't match."
		},
		"registration.form.password" : {
			"DE" : "Passwort*",
			"EN" : "Password*"
		},
		"registration.form.password.error.required" : {
			"DE" : "Bitte gib ein Passwort ein.",
			"EN" : "Please enter a password."
		},
		"registration.form.password.error.pattern" : {
			"DE" : "Min. 6 Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
			"EN" : "Min. 6 characters. Must contain one letter and one number or special character."
		},
		"registration.form.passwordrepeat" : {
			"DE" : "Passwort wiederholen*",
			"EN" : "Password repeat*"
		},
		"registration.form.passwordrepeat.error.match" : {
			"DE" : "Passwörter stimmen nicht überein.",
			"EN" : "Passwords don't match."
		},
		"registration.form.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"registration.form.company" : {
			"DE" : "Firmenname*",
			"EN" : "Company name*"
		},
		"registration.form.company.error.required" : {
			"DE" : "Bitte gib deine Firma an.",
			"EN" : "Please enter your company's name."
		},
		"registration.form.address" : {
			"DE" : "Adresse*",
			"EN" : "Address*"
		},
		"registration.form.address.error.required" : {
			"DE" : "Bitte gib deine Adresse an.",
			"EN" : "Please enter your address."
		},
		"registration.form.city" : {
			"DE" : "Stadt*",
			"EN" : "City*"
		},
		"registration.form.city.error.required" : {
			"DE" : "Bitte gib deine Stadt an.",
			"EN" : "Please enter your city."
		},
		"registration.form.postcode" : {
			"DE" : "Postleitzahl*",
			"EN" : "Zipcode*"
		},
		"registration.form.postcode.error.required" : {
			"DE" : "Bitte gib deine Postleitzahl an.",
			"EN" : "Please enter your zipcode."
		},
		"registration.form.businessphone" : {
			"DE" : "Telefon geschäftlich",
			"EN" : "Phone (business)"
		},
		"registration.form.country" : {
			"DE" : "Land*",
			"EN" : "Country*"
		},
		"registration.form.country.error.required" : {
			"DE" : "Bitte gib dein Land an an.",
			"EN" : "Please enter your country."
		},
		"registration.form.fullname.placeholder" : {
			"DE" : "Mein Name",
			"EN" : "My name"
		},
		"registration.form.login.placeholder" : {
			"DE" : "Mein Benutzername",
			"EN" : "My username"
		},
		"registration.form.email.placeholder" : {
			"DE" : "Meine E-Mail",
			"EN" : "My email"
		},
		"registration.form.emailrepeat.placeholder" : {
			"DE" : "E-Mail wiederholen",
			"EN" : "repeat email"
		},
		"registration.form.password.placeholder" : {
			"DE" : "Mein Passwort",
			"EN" : "my password"
		},
		"registration.form.passwordrepeat.placeholder" : {
			"DE" : "Passwort wiederholen",
			"EN" : "repeat password"
		},
		"registration.form.phone.placeholder" : {
			"DE" : "(optional) Meine Telefonnummer",
			"EN" : "(optional) my phone"
		},
		"registration.form.company.placeholder" : {
			"DE" : "Meine Firma",
			"EN" : "my company"
		},
		"registration.form.address.placeholder" : {
			"DE" : "Meine Adresse",
			"EN" : "my address"
		},
		"registration.form.city.placeholder" : {
			"DE" : "Mein Firmensitz",
			"EN" : "my head office"
		},
		"registration.form.postcode.placeholder" : {
			"DE" : "Meine Postleitzahl",
			"EN" : "my zipcode"
		},
		"registration.form.businessphone.placeholder" : {
			"DE" : "(optional) Meine Firmen Telefonnummer",
			"EN" : "(optional) my business phone"
		},
		"registration.action.fblogin" : {
			"DE" : "Mit Facebook einloggen und Cloobster verknüpfen.",
			"EN" : "Login with facebook and link Cloobster."
		},
		"registration.form.account.label" : {
			"DE" : "Meine Benutzerkontodaten",
			"EN" : "My account data"
		},
		"registration.form.action.reset" : {
			"DE" : "Zurücksetzen",
			"EN" : "Reset"
		},
		"registration.form.action.register" : {
			"DE" : "Registrieren",
			"EN" : "Register"
		},
		"registration.form.action.register.tooltip" : {
			"DE" : "Für die Registrierung bitte alle Pflichtfelder ausfüllen.",
			"EN" : "Please enter all mandatory fields to complete registration."
		},
		"registration.form.company.label" : {
			"DE" : "Meine Firmendaten",
			"EN" : "My company data"
		},
		"registration.form.submit.message" : {
			"DE" : "Vielen dank für die Registrierung {{account.name}},<br/>"+
				"eine E-mail mit Bestätigungslink wurde an {{account.email}} gesendet.",
			"EN" : "Thank you for your registration {{account.name}}.<br/>"+
				"An email with activation link will be send to {{account.name}}."
		},
		//businesses partial
		"businesses.title" : {
			"DE" : "Meine Betriebe",
			"EN" : "My businesses"
		},
		"businesses.add" : {
			"DE" : "Restaurant hinzufügen",
			"EN" : "Add business"
		},
		"businesses.action.show" : {
			"DE" : "anzeigen/editieren",
			"EN" : "show/edit"
		},
		"businesses.action.spots" : {
			"DE" : "spots",
			"EN" : "spots"
		},
		"businesses.action.menus" : {
			"DE" : "produkte",
			"EN" : "products"
		},
		"businesses.action.delete" : {
			"DE" : "Betrieb löschen",
			"EN" : "Delete business"
		},
		"businesses.form.name" : {
			"DE" : "Name*",
			"EN" : "Name*"
		},
		"businesses.form.description" : {
			"DE" : "Beschreibung*",
			"EN" : "Description*"
		},
		"businesses.form.address" : {
			"DE" : "Addresse*",
			"EN" : "Address*"
		},
		"businesses.form.city" : {
			"DE" : "Stadt*",
			"EN" : "City*"
		},
		"businesses.form.postcode" : {
			"DE" : "Postleitzahl*",
			"EN" : "Zipcode*"
		},
		"businesses.form.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"businesses.form.currency" : {
			"DE" : "Währung",
			"EN" : "Currency"
		},
		"businesses.form.error.required" : {
			"DE" : "Bitte füllen Sie das Feld aus.",
			"EN" : "Please fill out this field."
		},
		"businesses.form.mandatory" : {
			"DE" : "Felder markiert mit * sind pflicht.",
			"EN" : "Fields marked with * are mandatory."
		},
		"businesses.dialog.delete" : {
			"DE" : "Betrieb löschen",
			"EN" : "Delete business"
		},
		"busineses.business.deleted.tooltip" : {
			"DE" : "Dieses Restaurant wurde gelöscht.",
			"EN" : "This business has been deleted."
		},
		//business detail partial
		"business.action.edit.enable" : {
			"DE" : "Editiermodus aktivieren",
			"EN" : "Activate edit mode"
		},
		"business.action.edit.disabled" : {
			"DE" : "Editiermodus beenden",
			"EN" : "End edit mode"
		},
		"business.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken um zu editieren.",
			"EN" : "Click profile property to edit"
		},
		"business.detail.logo.editor.title" : {
			"DE" : "Logo",
			"EN" : "Logo"
		},
		"business.detail.picture1.editor.title" : {
			"DE" : "Profilbild 1",
			"EN" : "Profile picture 1"
		},
		"business.detail.picture2.editor.title" : {
			"DE" : "Profilbild 2",
			"EN" : "Profile picture 2"
		},
		"business.detail.picture3.editor.title" : {
			"DE" : "Profilbild 3",
			"EN" : "Profile picture 3"
		},
		"business.detail.logo.button" : {
			"DE" : "Logo hinzufügen",
			"EN" : "Add logo"
		},
		"business.detail.picture1.button" : {
			"DE" : "Profilbild 1 hinzufügen",
			"EN" : "Add profile picture 1"
		},
		"business.detail.picture2.button" : {
			"DE" : "Profilbild 2 hinzufügen",
			"EN" : "Add profile picture 2"
		},
		"business.detail.picture3.button" : {
			"DE" : "Profilbild 3 hinzufügen",
			"EN" : "Add profile picture 3"
		},
		"business.detail.picture.edit" : {
			"DE" : "Bild anklicken zum editieren.",
			"EN" : "Click picture to edit."
		},
		"business.detail.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"business.detail.description" : {
			"DE" : "Beschreibung",
			"EN" : "Description"
		},
		"business.detail.slogan" : {
			"DE" : "Slogan",
			"EN" : "Slogan"
		},
		"business.detail.address" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"business.detail.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"business.detail.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"business.detail.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"business.detail.currency" : {
			"DE" : "Währung",
			"EN" : "Currency"
		},
		"business.detail.paymentmethod" : {
			"DE" : "Bezahlart",
			"EN" : "Payment"
		},
		"business.detail.paymentmethods" : {
			"DE" : "Bezahlarten",
			"EN" : "Payments"
		},
		"business.detail.paymentmethods.list.new" : {
			"DE" : "Neue Bezahlart",
			"EN" : "New payment"
		},
		"business.action.delete.invalid" : {
			"DE" : "Passwort inkorrekt!",
			"EN" : "Password invalid!"
		},
		"business.dialog.delete.text" : {
		"DE" : "Du bist dabei <strong>{{activeBusiness.name}}</strong> zu löschen! Das Restaurant wird deaktiviert und in einen read-only modus versetzt. "+
			"Aktuell eingeloggte Servicekräfte und Gäste können noch Bestellungen einsehen aber keine weitere Aktionen tätigen. Das Restaurant "+
			" wird nach einer Weile permanent gelöscht!",
		"EN" : ""
		},
		"business.dialog.delete.confirm" : {
			"DE" : "Bitte gib dein Passwort ein um die Löschaktion zu bestätigen.",
			"EN" : "Please enter your password to confirm delete action."
		},
		//profile partial
		"profile.title" : {
			"DE" : "Profil",
			"EN" : "Profile"
		},
		"profile.account.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"profile.account.email" : {
			"DE" : "E-Mail",
			"EN" : "Email"
		},
		"profile.company.action.edit.enable" : {
			"DE" : "Editiermodus aktivieren",
			"EN" : "Activate edit mode"
		},
		"profile.company.action.edit.disable" : {
			"DE" : "Editiermodus beenden",
			"EN" : "Disable edit mode"
		},
		"profile.company.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken um zu editieren.",
			"EN" : "Click property to edit."
		},
		"profile.company.address" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"profile.company.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"profile.company.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"profile.company.phone" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"profile.company.url" : {
			"DE" : "Homepage",
			"EN" : "Website"
		},
		"profile.company.country" : {
			"DE" : "Land",
			"EN" : "Country"
		},
		"profile.company.address.editor.title" : {
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"profile.company.city.editor.title" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"profile.company.postcode.editor.title" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"profile.company.phone.editor.title" : {
			"DE" : "Telefon",
			"EN" : "Phone"
		},
		"profile.company.url.editor.title" : {
			"DE" : "Homepage",
			"EN" : "Website"
		},
		//menus partial
		"menus.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"menus.list.new" : {
			"DE" : "Neue Kategorie...",
			"EN" : "New category..."
		},
		"menus.list.orphaned" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.list.orphaned.tooltip" : {
			"DE" : "Nicht zugewiesene Produkte anzeigen",
			"EN" : "Show not assigned products."
		},
		"menus.menu.field.active" : {
			"DE" : "Kategorie dem Gast anzeigen",
			"EN" : "Show category to guest."
		},
		"menus.menu.delete" : {
			"DE" : "Kategorie löschen",
			"EN" : "Delete category"
		},
		"menus.menu.dialog.delete.title" : {
			"DE" : "Kategorie {{currentMenu.title}} löschen",
			"EN" : "Delete {{currentMenu.title}} category"
		},
		"menus.menu.dialog.delete.text" : {
			"DE" : "<strong>{{currentMenu.title}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!<br/>Produkte werden nicht gelöscht.",
			"EN" : "Delete <strong>{{currentMenu.title}}</strong>? This can't be undone.!<br/>Products won't be deleted."
		},
		"menus.products.title" : {
			"DE" : "Produkte",
			"EN" : "Products"
		},
		"menus.products.list.new" : {
			"DE" : "Neues Produkt...",
			"EN" : "New product..."
		},
		"menus.products.list.existing" : {
			"DE" : "Bestehendes Produkt...",
			"EN" : "Existing product"
		},
		"menus.products.link.title" : {
			"DE" : "Alle Produkte",
			"EN" : "All products"
		},
		"menus.products.link.action.copy" : {
			"DE" : "Kopieren",
			"EN" : "Copy"
		},
		"menus.products.link.action.copylink" : {
			"DE" : "Kopieren und Auswahlmöglichkeiten verknüpfen.",
			"EN" : "Copy and link choices."
		},
		"menus.products.link.action.deepcopy" : {
			"DE" : "Kopieren inklusive Auswahlmöglichkeiten.",
			"EN" : "Copy including choices."
		},
		"menus.product.copy.name" : {
			"DE" : "-Kopie",
			"EN" : "-copy"
		},
		"menus.products.link.description" : {
			"DE" : "Klicke auf eine bestehendes Produkt, um dieses zu kopieren und der aktuellen Kategory hinzuzufügen. Wahlweise können zusätzlich <strong>Auswahlmöglichkeiten verknüpft</strong> oder <strong>kopiert werden</strong>.",
			"EN" : "Click on existing product to copy it and add to current category."+
				"Optionally link or copy choices."
		},
		"menus.products.orphaned.title" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.products.orphaned.description" : {
			"DE" : "Liste aller Produkte die keiner Kategorie zugeordnet sind.",
			"EN" : "List of all products not assigned to a category."
		},
		"menus.editor.title.tooltip" : {
			"DE" : "Titel editieren",
			"EN" : "Edit title"
		},
		"menus.editor.description.tooltip" : {
			"DE" : "Beschreibung editieren",
			"EN" : "Edit description"
		},
		"product.editor.name.tooltip" : {
			"DE" : "Name editieren",
			"EN" : "Edit name"
		},
		"product.editor.shortDesc.tooltip" : {
			"DE" : "Kurzbeschreibung editieren",
			"EN" : "Edit short description"
		},
		"product.editor.longDesc.tooltip" : {
			"DE" : "Beschreibung editieren",
			"EN" : "Edit description"
		},
		"product.editor.price.tooltip" : {
			"DE" : "Preis editieren",
			"EN" : "Edit price"
		},
		"menus.product.field.active" : {
			"DE" : "Produkt dem Gast anzeigen",
			"EN" : "Show product to guest"
		},
		"menus.product.delete" : {
			"DE" : "Produkt löschen",
			"EN" : "Delete product"
		},
		"menus.product.action.move" : {
			"DE" : "Verschieben nach ...",
			"EN" : "Move to..."
		},
		"menus.product.action.move.tooltip" : {
			"DE" : "Verschiebt das aktuelle Produkt<br/>in ausgewähltes Kategorie.",
			"EN" : "Moves current current to selected category."
		},
		"menus.product.dialog.delete.title" : {
			"DE" : "Produkt {{currentProduct.name}} löschen",
			"EN" : "Delete {{currentProduct.name}} product"
		},
		"menus.product.dialog.delete.text" : {
			"DE" : "<strong>{{currentProduct.name}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!",
			"EN" : "Delete <strong>{{currentProduct.name}}</strong>? This can't be undone!"
		},
		"menus.choices.title" : {
			"DE" : "Auswahlmöglichkeiten",
			"EN" : "Choices"
		},
		"menus.choices.list.new" : {
			"DE" : "Neue Auswahl...",
			"EN" : "New choice..."
		},
		"menus.choices.list.existing" : {
			"DE" : "Bestehende Auswahl...",
			"EN" : "Existing choice..."
		},
		"menus.choices.list.linked" : {
			"DE" : "Abhängige Auswahl",
			"EN" : "Dependent choice"
		},
		"menus.choices.list.remove.tooltip" : {
			"DE" : "Auswahl von diesem Produkt entfernen.",
			"EN" : "Remove choice from this product."
		}, 
		"menus.choices.link.description" : {
			"DE" : "Klicke auf eine bestehende Auswahlmöglichkeit, um diese mit dem aktuellen Produkt zu <strong>verknüpfen</strong> oder zu <strong>kopieren</strong>.<br/>Es werden keine abhängigen Auswahlen angezeigt.",
			"EN" : "Click on existing choice to link (or copy to) it with current product."
		},
		"menus.choices.link.title" : {
			"DE" : "Alle Auswahlmöglichkeiten",
			"EN" : "All choices"
		},
		"menus.choices.link.search" : {
			"DE" : "Suchen: ",
			"EN" : "Search: "
		},
		"menus.choices.link.action.copy" : {
			"DE" : "Kopieren",
			"EN" : "Copy"
		},
		"menus.choices.link.action.link" : {
			"DE" : "Verknüpfen",
			"EN" : "Link"
		},
		"menus.options.title" : {
			"DE" : "Optionen",
			"EN" : "Options"
		},
		"menus.options.list.new" : {
			"DE" : "Neue Option...",
			"EN" : "New option..."
		},
		"menu.editor.title" : {
			"DE" : "Titel",
			"EN" : "Title"
		},
		"menu.editor.description" : {
			"DE" : "Beschreibung",
			"EN" : "Description"
		},
		"product.editor.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"product.editor.price" : {
			"DE" : "Preis",
			"EN" : "Price"
		},
		"product.editor.price.validation" : {
			"DE" : "Muss ein gültiger Preis sein (z.B. 9.95, oder 5).",
			"EN" : "Must be a valid price (e. g. 9.95, or 5)."
		},
		"product.editor.shortDesc" : {
			"DE" : "Kurz Beschreibung",
			"EN" : "Short description"
		},
		"product.editor.longDesc" : {
			"DE" : "Lange Beschreibung",
			"EN" : "Long description"
		},
		"choice.editor.text" : {
			"DE" : "Auswahltext",
			"EN" : "Choice text"
		},
		"choice.editor.maxOccurence" : {
			"DE" : "Maximale Auswahl von Optionen",
			"EN" : "Maximum selected options"
		},
		"choice.editor.minOccurence" : {
			"DE" : "Minimale Auswahl von Optionen",
			"EN" : "Minimum selected options"
		},
		"choice.editor.included" : {
			"DE" : "Anzahl von Inklusivoptionen",
			"EN" : "Amount of options inclusive"
		},
		"menus.choices.field.maxOccurence" : {
			"DE" : "Max. Auswahl: {{currentChoice.maxOccurence}}",
			"EN" : "Max. selections: {{currentChoice.maxOccurence}}"
		},
		"menus.choices.field.minOccurence" : {
			"DE" : "Min. Auswahl: {{currentChoice.minOccurence}}",
			"EN" : "Min. selections: {{currentChoice.minOccurence}}"
		},
		"menus.choices.field.included" : {
			"DE" : "Optionen Inklusive: {{currentChoice.included}}",
			"EN" : "Options inclusive: {{currentChoice.included}}"
		},
		"menus.choices.field.price" : {
			"DE" : "Preis: {{currentChoice.price | kcurrency:activeBusiness.currency}}",
			"EN" : "Price: {{currentChoice.price | kcurrency:activeBusiness.currency}}"
		},
		"menus.choices.field.linkedchoices" : {
			"DE" : "Untergeordnete Auswahlen",
			"EN" : "Subordinate choices"
		},
		"menus.choices.field.linkedproducts" : {
			"DE" : "Wird verwendet in ...",
			"EN" : "Used in ..."
		},
		"menus.choices.field.linkedproducts.help" : {
			"DE" : "Listet alle Produkte auf<br/> die diese Auswahlmöglichkeit verwenden.",
			"EN" : "Lists all products<br/> using this choice."
		},
		"menus.choices.action.remove" : {
			"DE" : "Auswahl von Produkt entfernen.",
			"EN" : "Remove choice from product."
		},
		"menus.choice.dialog.delete.text" : {
			"DE" : "<strong>{{currentChoice.text}}</strong> wird von diesem Produkt entfernt.",
			"EN" : "<strong>{{currentChoice.text}}</strong>  will be removed from this product."
		},
		"choice.editor.text.tooltip" : {
			"DE" : "Auswahltext editieren",
			"EN" : "Edit choice text"
		},
		"choice.editor.price.tooltip" : {
			"DE" : "Preis editieren",
			"EN" : "Edit price"
		},
		"choice.editor.maxOccurence.tooltip" : {
			"DE" : "Maximale Optionsauswahl editieren",
			"EN" : "Edit maximum choice selection"
		},
		"choice.editor.minOccurence.tooltip" : {
			"DE" : "Minimale Optionsauswahl editieren",
			"EN" : "Edit minimum choice selection"
		},
		"choice.editor.included.tooltip" : {
			"DE" : "Anzahl inklusiv<br/>Optionen editieren",
			"EN" : "Edit amount of inclusive options"
		},
		"option.editor.name.tooltip" : {
			"DE" : "Name für Option editieren",
			"EN" : "Edit option name"
		},
		"option.editor.price.tooltip" : {
			"DE" : "Preis für Option editieren",
			"EN" : "Edit option price"
		},
		"menu.new.default.title" : {
			"DE" : "Meine Kategorie",
			"EN" : "My category"
		},
		"product.new.default.name" : {
			"DE" : "Mein Produkt",
			"EN" : "My product"
		},
		"choice.new.default.text" : {
			"DE" : "Meine Auswahlmöglichkeit",
			"EN" : "My choice"
		},
		"option.new.default.name" : {
			"DE" : "Meine Option",
			"EN" : "My option"
		},
		"menus.choices.field.overridePrice.label" : {
			"DE" : "Preisberechnung:",
			"EN" : "Price calculation"
		},
		"menus.choices.field.overridePrice.none" : {
			"DE" : "nichts",
			"EN" : "none"
		},
		"menus.choices.field.overridePrice.overridesingleprice" : {
			"DE" : "Einheitspreis pro Produkt",
			"EN" : "One price for all"
		},
		"menus.choices.field.overridePrice.overridefixedsum" : {
			"DE" : "Gesamtsumme (z. B. Menü)",
			"EN" : "All options included (e.g. Menu)"
		},
		"menus.choices.field.parentselect.label" : {
			"DE" : "Übergeordnete Auswahl:",
			"EN" : "Superior choice"
		},
		"menus.choices.field.parentselect.nullparent" : {
			"DE" : "--- auswählen ---",
			"EN" : "--- select ---"
		},
		"menus.choices.parentselect.tooltip" : {
			"DE" : "Ein hier ausgewähltes Element führt dazu, dass diese Auswahlmöglichkeit nur aktiv wird, "+
			"wenn der Kunde im übergeordneten Element eine Auswahl trifft.",
			"EN" : "Select a superior choice to only enable current choice when the superior gets selected."
		},
		"menus.choices.linkedchoices.tooltip" : {
			"DE" : "Auflistung aller Auswahlmöglichkeiten die von dieser abhängen.",
			"EN" : "Listing of all choices depending on this one."
		},
		//spots partial
		"spots.title" : {
			"DE" : "Spots",
			"EN" : "Spots"
		},
		"spots.list.new" : {
			"DE" : "Neuer Spot...",
			"EN" : "New spot..."
		},
		"spots.editor.name" : {
			"DE" : "Name",
			"EN" : "Name"
		},
		"spots.editor.barcode" : {
		"DE" : "Barcode",
			"EN" : "Barcode"
		},
		"spots.editor.name.tooltip" : {
			"DE" : "Name editieren",
			"EN" : "Edit name"
		},
		"spots.editor.barcode.tooltip" : {
			"DE" : "Barcode editieren",
			"EN" : "Edit barcode"
		},
		"spots.field.active" : {
			"DE" : "Aktiv: Gäste können einchecken",
			"EN" : "Activ: Guests can check-in"
		},
		"spot.action.delete" : {
			"DE" : "Spot löschen",
			"EN" : "Delete spot"
		},
		"spot.action.delete.text" : {
			"DE" : "{{currentSpot.name}} wird gelöscht!<br/>Bereits ausgedruckte Barcodes können nicht wiederverwendet werden!",
			"EN" : "{{currentSpot.name}} will be deleted!<br/>Barcode can't be reused!"
		},
		//accounts partial
		"accounts.title" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "Account management"
		},
		"accounts.admin.exists.company" : {
			"DE" : "Dieser Benutzer ist mit einem anderen Firmenkonto verknüpft!",
			"EN" : "This user is assigned to another company account."
		},
		"accounts.admin.exists.user" : {
			"DE" : "Dieser Benutzer existiert. Möchten Sie ihm Adminrechte für Ihre Firma gewähren?",
			"EN" : "This user exists. Do you want to grant him administrative rights."  
		},
		"accounts.admin.exists.assigned" : {
			"DE" : "Dieser Benutzer ist bereits Administrator.",
			"EN" : "This user is already an administrator."
		},
		"accounts.tab.admin" : {
			"DE" : "Admin",
			"EN" : "Admin"
		},
		"accounts.tab.cockpit" : {
			"DE" : "Service",
			"EN" : "service"
		},
		"accounts.list.title" : {
			"DE" : "Benutzer",
			"EN" : "User"
		},
		"accounts.list.new" : {
			"DE" : "Neuer Benutzer ...",
			"EN" : "New user..."
		},
		"accounts.admin.new.title" : {
			"DE" : "Neuer Administrator",
			"EN" : "New administrator"
		},
		"accounts.admin.mail.check" : {
			"DE" : "E-Mail prüfen",
			"EN" : "Check email"
		},
		"accounts.create" : {
			"DE" : "Anlegen",
			"EN" : "Create"
		},
		"accounts.admin.new.email.placeholder" : {
			"DE" : "Account E-Mail",
			"EN" : "Account email"
		},
		"accounts.admin.new.name.placeholder" : {
			"DE" : "Vor- und Nachname",
			"EN" : "Fore- and lastname"
		},
		"accounts.admin.businesses.list.title" : {
			"DE" : "Zugewiesene Betriebe",
			"EN" : "Assigned businesses"
		},
		"accounts.admin.businesses.list.description" : {
			"DE" : "Für hier aufgelistete Betriebe hat der Benutzer Administrationsrechte.<br/>Dies beinhaltet auch das Servicecockpit.",
			"EN" : "User has administrative rights for here listed businesses.<br/>This includes service cockpit."
		},
		"accounts.admin.dialog.remove.title" : {
			"DE" : "Admin user entfernen",
			"EN" : "Remove admin user"
		},
		"accounts.admin.dialog.remove.text" : {
			"DE" : "{{currentAdmin.name}} wird entfernt!",
			"EN" : "{{currentAdmin.name}} will be removed!"
		},
		"accounts.all.businesses.list.title" : {
			"DE" : "Verfügbare Betriebe",
			"EN" : "Available businesses"
		},
		"accounts.all.businesses.list.description" : {
			"DE" : "Drag&Drop in die Liste der zugewiesenen Betriebe um dem Benutzer entsprechende Rechte zu gewähren.",
			"EN" : "Drag&Drop to list of assigned businesses to grant coressponding rights."
		},
		"accounts.businesses.moveable.tooltip" : {
			"DE" : "Ziehen um zuzuweisen.",
			"EN" : "Drag to assign."
		},
		"accounts.cockpit.new.title" : {
			"DE" : "Neuer Servicebenuzer",
			"EN" : "New service user"
		},
		"accounts.cockpit.edit.title" : {
			"DE" : "Servicebenuzer editieren",
			"EN" : "Edit service user"
		},
		"accounts.cockpit.businesses.list.description" : {
			"DE" : "Für hier aufgelistete Betriebe hat der Benutzer Zugriffsrechte auf das Service Cockpit.",
			"EN" : "User has service cockpit access for here listed businesses"
		},
		//activate account partial
		"account.activation.admin.title" : {
			"DE" : "Account aktivieren",
			"EN" : "Activate account"
		},
		"account.activation.admin.submit" : {
			"DE" : "Aktivieren",
			"EN" : "Activate"
		},
		"account.activation.admin.description" : {
			"DE" : "Um die Aktivierung abzuschliessen, füllen Sie bitte die fehlenden Felder aus.",
			"EN" : "To complete your account activation, please enter the missing details below!"
		},
		//general
		"common.warning.title" : {
			"DE" : "Achtung!",
			"EN" : "Warning!"
		},
		"common.hint.title" : {
			"DE" : "Hinweis!",
			"EN" : "Hint!"
		},
		"common.ok" : {
			"DE" : "Ok",
			"EN" : "Ok"
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
		"general.sortable" : {
			"DE" : "Ziehen um zu sortieren",
			"EN" : "Drag to sort"
		},
		//breadcrumb
		"breadcrumb.home" : {
			"DE" : "Home",
			"EN" : "Home"
		},
		"breadcrumb.businesses" : {
			"DE" : "Betriebe",
			"EN" : "businesses"
		},
		"breadcrumb.menus" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"breadcrumb.tables" : {
			"DE" : "Spots",
			"EN" : "Spots"
		},
		//file upload
		"fileupload.button.add" : {
			"DE" : "Bild auswählen ...",
			"EN" : "Select image"
		},
		"fileupload.image.label" : {
			"DE" : "Ausgewähltes Bild: ",
			"EN" : "Seelcted image: "
		},
		"fileupload.button.submit.saving" : {
			"DE" : "Speichere ...",
			"EN" : "Save..."
		},
		"fileupload.submit.error" : {
			"DE" : "Beim Hochladen ist ein Fehler aufgetreten.",
			"EN" : "An error occurred during upload."
		},
		"propertyeditor.error.required" : {
			"DE" : "Bitte einen Text eingeben.",
			"EN" : "Please enter a text."
		},
		"propertyeditor.error.number" : {
			"DE" : "Bitte eine Zahl eingeben.",
			"EN" : "Please enter a number."
		},
		"propertyeditor.error.email" : {
			"DE" : "Bitte eine gültige E-Mail-Adresse eingeben.",
			"EN" : "Please enter a valid email."
		},
		//common error messages
		"common.error.404" : {
			"DE" : "Eine Ressource konnte nicht geladen werden.",
			"EN" : "Resource not available."
		},
		"common.error" : {
			"DE" : "Es gibt ein Problem mit der Verbindung zum Service.",
			"EN" : "A connection problem to the service exists."
		}
	};
	// var map = {
	// 	"DE" : {
	// 		//index
	// 		"product.brand" : "Cloobster",
	// 		"nav.logout" : "Logout",
	// 		"nav.login": "Login",
	// 		"nav.restaurants" : "Restaurants",
	// 		"nav.menus" : "Menüs",
	// 		"nav.about" : "Über",
	// 		"nav.profile" : "Profil",
	// 		"nav.registration" : "Registrieren",
	// 		"nav.accounts" : "Benutzerkonten",
	// 		//registration partial
	// 		"registration.title" : "Cloobster Registration",
	// 		"registration.form.fullname" : "Name*",
	// 		"registration.form.fullname.error.required" : "Teile uns deinen Namen mit",
	// 		"registration.form.fullname.error.minlength" : "Der Name muss min. aus 3 Zeichen bestehen",
	// 		"registration.form.login" : "Benutzername*",
	// 		"registration.form.login.error.required" : "Such dir einen Benutzernamen aus",
	// 		"registration.form.login.error.pattern" : 'Dein Benutzername muss zwischen 4-30 Zeichen lang sein. Es sind nur Kleinbuchstanen und "_" "-" "." erlaubt.',
	// 		"registration.form.email" : "E-Mail*",
	// 		"registration.form.email.error.required" : "Bitte gib deine E-Mail ein",
	// 		"registration.form.email.error.email" : "Keine gültige E-Mail",
	// 		"registration.form.emailrepeat" : "E-Mail wiederholen*",
	// 		"registration.form.emailrepeat.error.match" : "Die beiden E-Mails stimmen nicht überein",
	// 		"registration.form.password" : "Passwort*",
	// 		"registration.form.password.error.required" : "Bitte gib ein Passwort ein.",
	// 		"registration.form.password.error.pattern" : "Min. 6 Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
	// 		"registration.form.passwordrepeat" : "Passwort wiederholen*",
	// 		"registration.form.passwordrepeat.error.match" : "Passwörter stimmen nicht überein.",
	// 		"registration.form.phone" : "Telefon",
	// 		"registration.form.company" : "Firmenname*",
	// 		"registration.form.company.error.required" : "Bitte gib deine Firma an.",
	// 		"registration.form.address" : "Adresse*",
	// 		"registration.form.address.error.required" : "Bitte gib deine Adresse an.",
	// 		"registration.form.city" : "Stadt*",
	// 		"registration.form.city.error.required" : "Bitte gib deine Stadt an.",
	// 		"registration.form.postcode" : "Postleitzahl*",
	// 		"registration.form.postcode.error.required" : "Bitte gib deine Postleitzahl an.",
	// 		"registration.form.businessphone" : "Telefon geschäftlich",
	// 		"registration.form.country" : "Land*",
	// 		"registration.form.country.error.required" : "Bitte gib dein Land an an.",
	// 		"registration.form.fullname.placeholder" : "Mein Name",
	// 		"registration.form.login.placeholder" : "Mein Benutzername",
	// 		"registration.form.email.placeholder" : "Meine E-Mail",
	// 		"registration.form.emailrepeat.placeholder" : "E-Mail wiederholen",
	// 		"registration.form.password.placeholder" : "Mein Passwort",
	// 		"registration.form.passwordrepeat.placeholder" : "Passwort wiederholen",
	// 		"registration.form.phone.placeholder" : "(optional) Meine Telefonnummer",
	// 		"registration.form.company.placeholder" : "Meine Firma",
	// 		"registration.form.address.placeholder" : "Meine Adresse",
	// 		"registration.form.city.placeholder" : "Mein Firmensitz",
	// 		"registration.form.postcode.placeholder" : "Meine Postleitzahl",
	// 		"registration.form.businessphone.placeholder" : "(optional) Meine Firmen Telefonnummer",
	// 		"registration.action.fblogin" : "Mit Facebook einloggen und Cloobster verknüpfen.",
	// 		"registration.form.account.label" : "Meine Benutzerkontodaten",
	// 		"registration.form.action.reset" : "Zurücksetzen",
	// 		"registration.form.action.register" : "Registrieren",
	// 		"registration.form.action.register.tooltip" : "Für die Registrierung bitte alle Pflichtfelder ausfüllen.",
	// 		"registration.form.company.label" : "Meine Firmendaten",
	// 		"registration.form.submit.message" : "Vielen dank für die Registrierung {{account.name}},<br/>"+
	// 				"eine E-mail mit Bestätigungslink wurde an {{account.email}} gesendet.",
	// 		//businesses partial
	// 		"businesses.title" : "Meine Restaurants",
	// 		"businesses.add" : "Restaurant hinzufügen",
	// 		"businesses.action.show" : "anzeigen/editieren",
	// 		"businesses.action.spots" : "tische",
	// 		"businesses.action.menus" : "menüs",
	// 		"businesses.action.delete" : "Restaurant löschen",
	// 		"businesses.form.name" : "Name*",
	// 		"businesses.form.description" : "Beschreibung*",
	// 		"businesses.form.address" : "Addresse*",
	// 		"businesses.form.city" : "Stadt*",
	// 		"businesses.form.postcode" : "Postleitzahl*",
	// 		"businesses.form.phone" : "Telefon",
	// 		"businesses.form.currency" : "Währung",
	// 		"businesses.form.error.required" : "Bitte füllen Sie das Feld aus.",
	// 		"businesses.form.mandatory" : "Felder markiert mit * sind pflicht.",
	// 		"businesses.dialog.delete" : "Restaurant löschen",
	// 		"busineses.business.deleted.tooltip" : "Dieses Restaurant wurde gelöscht.",
	// 		//business detail partial
	// 		"business.action.edit.enable" : "Editiermodus aktivieren",
	// 		"business.action.edit.disabled" : "Editiermodus beenden",
	// 		"business.action.edit.disable.hint" : "Profileigenschaft anklicken um zu editieren.",
	// 		"business.detail.logo.editor.title" : "Logo",
	// 		"business.detail.picture1.editor.title" : "Profilbild 1",
	// 		"business.detail.picture2.editor.title" : "Profilbild 2",
	// 		"business.detail.picture3.editor.title" : "Profilbild 3",
	// 		"business.detail.logo.button" : "Logo hinzufügen",
	// 		"business.detail.picture1.button" : "Profilbild 1 hinzufügen",
	// 		"business.detail.picture2.button" : "Profilbild 2 hinzufügen",
	// 		"business.detail.picture3.button" : "Profilbild 3 hinzufügen",
	// 		"business.detail.picture.edit" : "Bild anklicken zum editieren",
	// 		"business.detail.name" : "Name",
	// 		"business.detail.description" : "Beschreibung",
	// 		"business.detail.slogan" : "Slogan",
	// 		"business.detail.address" : "Adresse",
	// 		"business.detail.city" : "Stadt",
	// 		"business.detail.postcode" : "Postleitzahl",
	// 		"business.detail.phone" : "Telefon",
	// 		"business.detail.currency" : "Währung",
	// 		"business.detail.paymentmethod" : "Bezahlart",
	// 		"business.detail.paymentmethods" : "Bezahlarten",
	// 		"business.detail.paymentmethods.list.new" : "Neue Bezahlart",
	// 		"business.action.delete.invalid" : "Passwort inkorrekt!",
	// 		"business.dialog.delete.text" : "Du bist dabei <strong>{{activeBusiness.name}}</strong> zu löschen! Das Restaurant wird deaktiviert und in einen read-only modus versetzt. "+
	// 			"Aktuell eingeloggte Servicekräfte und Gäste können noch Bestellungen einsehen aber keine weitere Aktionen tätigen. Das Restaurant "+
	// 			" wird nach einer Weile permanent gelöscht!",
	// 		"business.dialog.delete.confirm" : "Bitte gib dein Passwort ein um die Löschaktion zu bestätigen.",
	// 		//profile partial
	// 		"profile.title" : "Profil",
	// 		"profile.account.name" : "Name",
	// 		"profile.account.email" : "E-Mail",
	// 		"profile.company.action.edit.enable" : "Editiermodus aktivieren",
	// 		"profile.company.action.edit.disable" : "Editiermodus beenden",
	// 		"profile.company.action.edit.disable.hint" : "Profileigenschaft anklicken um zu editieren.",
	// 		"profile.company.address" : "Adresse",
	// 		"profile.company.city" : "Stadt",
	// 		"profile.company.postcode" : "Postleitzahl",
	// 		"profile.company.phone" : "Telefon",
	// 		"profile.company.url" : "Homepage",
	// 		"profile.company.country" : "Land",
	// 		"profile.company.address.editor.title" : "Adresse",
	// 		"profile.company.city.editor.title" : "Stadt",
	// 		"profile.company.postcode.editor.title" : "Postleitzahl",
	// 		"profile.company.phone.editor.title" : "Telefon",
	// 		"profile.company.url.editor.title" : "Homepage",
	// 		//menus partial
	// 		"menus.title" : "Menüs",
	// 		"menus.list.new" : "Neues Menü...",
	// 		"menus.list.orphaned" : "Verwaiste Produkte",
	// 		"menus.list.orphaned.tooltip" : "Nicht zugewiesene Produkte anzeigen",
	// 		"menus.menu.field.active" : "Menü dem Gast anzeigen",
	// 		"menus.menu.delete" : "Menü löschen",
	// 		"menus.menu.dialog.delete.title" : "Menü {{currentMenu.title}} löschen",
	// 		"menus.menu.dialog.delete.text" : "<strong>{{currentMenu.title}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!<br/>Produkte werden nicht gelöscht.",
	// 		"menus.products.title" : "Produkte",
	// 		"menus.products.list.new" : "Neues Produkt...",
	// 		"menus.products.list.existing" : "Bestehendes Produkt...",
	// 		"menus.products.link.title" : "Alle Produkte",
	// 		"menus.products.link.action.copy" : "Kopieren",
	// 		"menus.products.link.action.copylink" : "Kopieren und Auswahlmöglichkeiten verknüpfen",
	// 		"menus.products.link.action.deepcopy" : "Kopieren inklusive Auswahlmöglichkeiten",
	// 		"menus.product.copy.name" : "-Kopie",
	// 		"menus.products.link.description" : "Klicke auf eine bestehendes Produkt, um dieses zu kopieren und dem aktuellen Menü hinzuzufügen. Wahlweise können zusätzlich <strong>Auswahlmöglichkeiten verknüpft</strong> oder <strong>kopiert werden</strong>.",
	// 		"menus.products.orphaned.title" : "Verwaiste Produkte",
	// 		"menus.products.orphaned.description" : "Liste aller Produkte die keinem Menü zugeordnet sind.",
	// 		"menus.editor.title.tooltip" : "Titel editieren",
	// 		"menus.editor.description.tooltip" : "Beschreibung editieren",
	// 		"product.editor.name.tooltip" : "Name editieren",
	// 		"product.editor.shortDesc.tooltip" : "Kurzbeschreibung editieren",
	// 		"product.editor.longDesc.tooltip" : "Beschreibung editieren",
	// 		"product.editor.price.tooltip" : "Preis editieren",
	// 		"menus.product.field.active" : "Produkt dem Gast anzeigen",
	// 		"menus.product.delete" : "Produkt löschen",
	// 		"menus.product.action.move" : "Verschieben nach ...",
	// 		"menus.product.action.move.tooltip" : "Verschiebt das aktuelle Produkt<br/>in ausgewähltes Menü.",
	// 		"menus.product.dialog.delete.title" : "Produkt {{currentProduct.name}} löschen",
	// 		"menus.product.dialog.delete.text" : "<strong>{{currentProduct.name}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!",
	// 		"menus.choices.title" : "Auswahlmöglichkeiten",
	// 		"menus.choices.list.new" : "Neue Auswahl...",
	// 		"menus.choices.list.existing" : "Bestehende Auswahl...",
	// 		"menus.choices.list.linked" : "Abhängige Auswahl",
	// 		"menus.choices.list.remove.tooltip" : "Auswahl von diesem Produkt entfernen.", 
	// 		"menus.choices.link.description" : "Klicke auf eine bestehende Auswahlmöglichkeit, um diese mit dem aktuellen Produkt zu <strong>verknüpfen</strong> oder zu <strong>kopieren</strong>.<br/>Es werden keine abhängigen Auswahlen angezeigt.",
	// 		"menus.choices.link.title" : "Alle Auswahlmöglichkeiten",
	// 		"menus.choices.link.search" : "Suchen: ",
	// 		"menus.choices.link.action.copy" : "Kopieren",
	// 		"menus.choices.link.action.link" : "Verknüpfen",
	// 		"menus.options.title" : "Optionen",
	// 		"menus.options.list.new" : "Neue Option...",
	// 		"menu.editor.title" : "Titel",
	// 		"menu.editor.description" : "Beschreibung",
	// 		"product.editor.name" : "Name",
	// 		"product.editor.price" : "Preis",
	// 		"product.editor.price.validation" : "Muss ein gültiger Preis sein (z.B. 9.95, oder 5).",
	// 		"product.editor.shortDesc" : "Kurz Beschreibung",
	// 		"product.editor.longDesc" : "Lange Beschreibung",
	// 		"choice.editor.text" : "Auswahltext",
	// 		"choice.editor.maxOccurence" : "Maximale Auswahl von Optionen",
	// 		"choice.editor.minOccurence" : "Minimale Auswahl von Optionen",
	// 		"choice.editor.included" : "Anzahl von Inklusivoptionen",
	// 		"menus.choices.field.maxOccurence" : "Max. Auswahl: {{currentChoice.maxOccurence}} ",
	// 		"menus.choices.field.minOccurence" : "Min. Auswahl: {{currentChoice.minOccurence}} ",
	// 		"menus.choices.field.included" : "Optionen Inklusive: {{currentChoice.included}} ",
	// 		"menus.choices.field.price" : "Preis: {{currentChoice.price | kcurrency:activeBusiness.currency}}",
	// 		"menus.choices.field.linkedchoices" : "Untergeordnete Auswahlen",
	// 		"menus.choices.field.linkedproducts" : "Wird verwendet in ...",
	// 		"menus.choices.field.linkedproducts.help" : "Listet alle Produkte auf<br/> die diese Auswahlmöglichkeit verwenden.",
	// 		"menus.choices.action.remove" : "Auswahl von Produkt entfernen",
	// 		"menus.choice.dialog.delete.text" : "<strong>{{currentChoice.text}}</strong> wird von diesem Produkt entfernt.",
	// 		"choice.editor.text.tooltip" : "Auswahltext editieren",
	// 		"choice.editor.price.tooltip" : "Preis editieren",
	// 		"choice.editor.maxOccurence.tooltip" : "Maximale Optionsauswahl editieren",
	// 		"choice.editor.minOccurence.tooltip" : "Minimale Optionsauswahl editieren",
	// 		"choice.editor.included.tooltip" : "Anzahl inklusiv<br/>Optionen editieren",
	// 		"option.editor.name.tooltip" : "Name für Option editieren",
	// 		"option.editor.price.tooltip" : "Preis für Option editieren",
	// 		"menu.new.default.title" : "Mein Menü",
	// 		"product.new.default.name" : "Mein Produkt",
	// 		"choice.new.default.text" : "Meine Auswahlmöglichkeit",
	// 		"option.new.default.name" : "Meine Option",
	// 		"menus.choices.field.overridePrice.label" : "Preisberechnung:",
	// 		"menus.choices.field.overridePrice.none" : "nichts",
	// 		"menus.choices.field.overridePrice.overridesingleprice" : "Einheitspreis pro Produkt",
	// 		"menus.choices.field.overridePrice.overridefixedsum" : "Gesamtsumme (z. B. Menü)",
	// 		"menus.choices.field.parentselect.label" : "Übergeordnete Auswahl:",
	// 		"menus.choices.field.parentselect.nullparent" : "--- auswählen ---",
	// 		"menus.choices.parentselect.tooltip" : "Ein hier ausgewähltes Element führt dazu, dass diese Auswahlmöglichkeit nur aktiv wird, "+
	// 			"wenn der Kunde im übergeordneten Element eine Auswahl trifft.",
	// 		"menus.choices.linkedchoices.tooltip" : "Auflistung aller Auswahlmöglichkeiten die von dieser abhängen.",
	// 		//spots partial
	// 		"spots.title" : "Tische",
	// 		"spots.list.new" : "Neuer Tisch...",
	// 		"spots.editor.name" : "Name",
	// 		"spots.editor.barcode" : "Barcode",
	// 		"spots.editor.name.tooltip" : "Name editieren",
	// 		"spots.editor.barcode.tooltip" : "Barcode editieren",
	// 		"spots.field.active" : "Aktiv: Gäste können einchecken",
	// 		"spot.action.delete" : "Tisch löschen",
	// 		"spot.action.delete.text" : "{{currentSpot.name}} wird gelöscht!<br/>Bereits ausgedruckte Barcodes können nicht wiederverwendet werden!",
	// 		//accounts partial
	// 		"accounts.title" : "Benutzerverwaltung",
	// 		"accounts.admin.exists.company" : "Dieser Benutzer ist mit einem anderen Firmenkonto verknüpft!",
	// 		"accounts.admin.exists.user" : "Dieser Benutzer existiert. Möchten Sie ihm Adminrechte für Ihre Firma gewähren?",
	// 		"accounts.admin.exists.assigned" : "Dieser Benutzer ist bereits Administrator.",
	// 		"accounts.tab.admin" : "Admin",
	// 		"accounts.tab.cockpit" : "Service",
	// 		"accounts.list.title" : "Benutzer",
	// 		"accounts.list.new" : "Neuer Benutzer ...",
	// 		"accounts.admin.new.title" : "Neuer Administrator",
	// 		"accounts.admin.mail.check" : "E-Mail prüfen",
	// 		"accounts.create" : "Anlegen",
	// 		"accounts.admin.new.email.placeholder" : "Account E-Mail",
	// 		"accounts.admin.new.name.placeholder" : "Vor- und Nachname",
	// 		"accounts.admin.businesses.list.title" : "Zugewiesene Betriebe",
	// 		"accounts.admin.businesses.list.description" : "Für hier aufgelistete Betriebe hat der Benutzer Administrationsrechte.<br/>Dies beinhaltet auch das Servicecockpit.",
	// 		"accounts.all.businesses.list.title" : "Verfügbare Betriebe",
	// 		"accounts.all.businesses.list.description" : "Drag&Drop in die Liste der zugewiesenen Betriebe um dem Benutzer entsprechende Rechte zu gewähren.",
	// 		"accounts.businesses.moveable.tooltip" : "Ziehen um zuzuweisen.",
	// 		"accounts.cockpit.new.title" : "Neuer Servicebenuzer",
	// 		"accounts.cockpit.edit.title" : "Servicebenuzer editieren",
	// 		"accounts.cockpit.businesses.list.description" : "Für hier aufgelistete Betriebe hat der Benutzer Zugriffsrechte auf das Service Cockpit.",
	// 		//general
	// 		"common.warning.title" : "Achtung!",
	// 		"common.hint.title" : "Hinweis!",
	// 		"common.ok" : "Ok",
	// 		"common.cancel" : "Abbrechen",
	// 		"common.add" : "Hinzufügen",
	// 		"common.delete" : "Löschen",
	// 		"common.save" : "Speichern",
	// 		"common.search" : "Suchen",
	// 		"common.password" : "Passwort",
	// 		"general.sortable" : "Ziehen um zu sortieren",
	// 		//breadcrumb
	// 		"breadcrumb.home" : "Home",
	// 		"breadcrumb.businesses" : "Restaurants",
	// 		"breadcrumb.menus" : "Menüs",
	// 		"breadcrumb.tables" : "Tische",
	// 		//file upload
	// 		"fileupload.button.add" : "Bild auswählen ...",
	// 		"fileupload.image.label" : "Ausgewähltes Bild: ",
	// 		"fileupload.button.submit.saving" : "Speichere ...",
	// 		"fileupload.submit.error" : "Beim Hochladen ist ein Fehler aufgetreten.",
	// 		"propertyeditor.error.required" : "Bitte einen Text eingeben.",
	// 		"propertyeditor.error.number" : "Bitte eine Zahl eingeben.",
	// 		"propertyeditor.error.email" : "Bitte eine gültige E-Mail-Adresse eingeben.",
	// 		//common error messages
	// 		"common.error.404" : "Eine Ressource konnte nicht geladen werden.",
	// 		"common.error" : "Es gibt ein Problem mit der Verbindung zum Service."
	// 	},
	// 	"EN" : {
	// 	//index
	// 		"product.brand" : "Cloobster",
	// 		"nav.logout" : "Logout",
	// 		"nav.login": "Login",
	// 		"nav.restaurants" : "Restaurants",
	// 		"nav.menus" : "Menus",
	// 		"nav.about" : "About",
	// 		"nav.profile" : "Profile",
	// 		"nav.registration" : "Register",
	// 		//businesses partial
	// 		"businesses.title" : "My Restaurants",
	// 		"businesses.add" : "Add restaurant",
	// 		"businesses.action.show" : "show/edit",
	// 		"businesses.action.menus" : "menus",
	// 		"businesses.action.delete" : "delete",
	// 		"businesses.form.name" : "Name*",
	// 		"businesses.form.description" : "Description*",
	// 		"businesses.form.address" : "Address*",
	// 		"businesses.form.city" : "City*",
	// 		"businesses.form.postcode" : "Postcode*",
	// 		"businesses.form.phone" : "Phone",
	// 		"businesses.form.error.required" : "Please fill out the field.",
	// 		"businesses.form.mandatory" : "Fields marked with * are required.",
	// 		"businesses.dialog.delete" : "Delete Restaurant",
	// 		"business.dialog.delete.text" : "{{activeBusiness.name}} and all data will be deleted!",
	// 		//business detail partial
	// 		"business.detail.logo.editor.title" : "Logo",
	// 		"business.detail.picture1.editor.title" : "Profile picture 1",
	// 		"business.detail.picture2.editor.title" : "Profile picture 2",
	// 		"business.detail.picture3.editor.title" : "Profile picture 3",
	// 		"business.detail.picture.edit" : "Click the picture to edit.",			
	// 		//menus partial
	// 		"menus.title" : "Menus",
	// 		"menus.list.new" : "New Menu ...",
	// 		"menus.menu.field.active" : " Active: Show menu to guests.",
	// 		"menus.products.title" : "Products",
	// 		"menus.products.list.new" : "New Product...",
	// 		"menus.editor.title.tooltip" : "edit title",
	// 		"menus.editor.description.tooltip" : "edit description",
	// 		"product.editor.name.tooltip" : "edit name",
	// 		"product.editor.shortDesc.tooltip" : "edit short description",
	// 		"product.editor.longDesc.tooltip" : "edit description",
	// 		"product.editor.price.tooltip" : "edit price",
	// 		"product.editor.price.validation" : "Must be a valid price (e.g. 5.95 or 10).",
	// 		"menus.product.field.active" : " Active: Show product to guests.",
	// 		"menus.choices.title" : "Choices",
	// 		"menus.choices.list.new" : "New choice ...",
	// 		"menus.choices.list.existing" : "Add existing choice ...",
	// 		"menus.choices.link.description" : "Click on an existing choice, to add to the product as a <strong>link</strong>(changes to the choice will be reflected in all linked products) or create a <strong>copy</strong> with independent data.",
	// 		"menus.choices.link.title" : "All Choices",
	// 		"menus.choices.link.search" : "Search: ",
	// 		"menus.choices.link.action.copy" : "Copy",
	// 		"menus.choices.link.action.link" : "Link",
	// 		"menus.options.title" : "Options",
	// 		"menus.options.list.new" : "New option...",
	// 		"menu.editor.title" : "Title",
	// 		"menu.editor.description" : "Description",
	// 		"product.editor.name" : "Name",
	// 		"product.editor.price" : "Price",
	// 		"product.editor.shortDesc" : "Short description",
	// 		"product.editor.longDesc" : "Long description",
	// 		"menu.new.default.title" : "My menu",
	// 		"product.new.default.name" : "My product",
	// 		"choice.new.default.text" : "My choice",
	// 		"option.new.default.name" : "My option",
	// 		"menus.choices.field.overridePrice.label" : "Price calculation:",
	// 		"menus.choices.field.overridePrice.none" : "none",
	// 		"menus.choices.field.overridePrice.overridesingleprice" : "One price for all",
	// 		"menus.choices.field.overridePrice.overridefixedsum" : "All options included (e.g. Menu)",
	// 		//general
	// 		"common.warning.title" : "Warning!",
	// 		"common.ok" : "Ok",
	// 		"common.cancel" : "Cancel",
	// 		"common.add" : "Add",
	// 		"common.delete" : "Delete",
	// 		"common.save" : "Save",
	// 		"common.search" : "Search",
	// 		"general.sortable" : "Drag to sort elements",
	// 		//file upload
	// 		"fileupload.button.add" : "Choose picture ...",
	// 		"fileupload.image.label" : "Selected picture: ",
	// 		"fileupload.button.submit.saving" : "Saving ...",
	// 		"fileupload.submit.error" : "An error occured during the upload.",
	// 		"propertyeditor.error.required" : "Please input a text.",
	// 		"propertyeditor.error.number" : "Please input a number.",
	// 		"propertyeditor.error.email" : "Please input a valid e-mail adress.",
	// 		//general error messages
	// 		"common.error.404" : "A resource could not be found.",
	// 		"common.error" : "There is a problem with the connection to the service."
	// 	}
	// }

	$provide.value("translation", map);
}]);