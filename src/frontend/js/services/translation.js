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
			"DE" : "Administration",
			"EN" : "Administration"
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
		//businesses header partial
		"businesses.headertabs.location" : {
			"DE" :  "Locations",
			"EN" : "Locations"
		},
		"businesses.headertabs.locationsettings" : {
			"DE" :  "Locations Einstellungen",
			"EN" : "Location Settings"
		},
		"businesses.headertabs.categories" : {
			"DE" :  "Kategorien und Produkte/Services",
			"EN" : "Categories and Products/Services"
		},
		"businesses.headertabs.accounts" : {
			"DE" :  "Benutzerkonten",
			"EN" : "User Accounts"
		},
		"businesses.headertabs.activation" : {
			"DE" :  "Kategorien aktivieren",
			"EN" : "Activate categories"
		},
		"businesses.headertabs.areas" : {
			"DE" :  "Servicebereiche und Spots",
			"EN" : "Service Areas and Spots"
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
			"DE" : "Telefon*",
			"EN" : "Phone*"
		},
		"registration.form.phone.error.required" : {
			"DE" : "Bitte gib eine Telefonnummer für Rückfragen an.",
			"EN" : "Please enter a phone number, where we can call you back."
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
			"DE" : "Adresse",
			"EN" : "Address"
		},
		"registration.form.address.error.required" : {
			"DE" : "Bitte gib deine Adresse an.",
			"EN" : "Please enter your address."
		},
		"registration.form.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"registration.form.city.error.required" : {
			"DE" : "Bitte gib deine Stadt an.",
			"EN" : "Please enter your city."
		},
		"registration.form.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
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
			"DE" : "Land",
			"EN" : "Country"
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
			"DE" : "Meine Telefonnummer",
			"EN" : "my phone"
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
				"An email with activation link will be send to {{account.email}}."
		},
		"registration.confirmemail.title" : {
			"DE" : "E-Mail Bestätigung",
			"EN" : "E-Mail Confirmation"
		},
		"registration.confirmemail.message" : {
			"DE" : "Vielen dank, die E-Mail Adresse wurde bestätigt und das Konto kann ab sofort genutzt werden.",
			"EN" : "Thank you, the e-mail address was confirmed and the account can be used immediately."
		},
		//businesses partial
		"businesses.title" : {
			"DE" : "Meine Locations",
			"EN" : "My Locations"
		},
		"businesses.description" : {
			"DE" :  "Hier können Sie Ihre unterschiedlichen Locations (Hotels, Restaurants) die cloobster verwenden verwalten.",
			"EN" : "You have more than one site you want to use cloobster with.<br/>"+
					"Here you can maintain the different locations you want to \"cloobsterize\"."
		},
		"businesses.add" : {
			"DE" : "Location hinzufügen",
			"EN" : "Add location"
		},
		"businesses.action.show" : {
			"DE" : "Einstellungen",
			"EN" : "Settings"
		},
		"businesses.action.spots" : {
			"DE" : "Servicebereiche und Spots",
			"EN" : "Service Areas and Spots"
		},
		"businesses.action.menus" : {
			"DE" : "Produkte",
			"EN" : "Products"
		},
		"businesses.action.accounts" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "User Management"
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
			"DE" : "Dieser Betrieb wurde gelöscht.",
			"EN" : "This business has been deleted."
		},
		//business detail partial
		"business.detail.help" : {
			"DE" :  "Hier können Sie das Profil der aktiven Location pflegen.<br/>Außerdem können Sie die CI für die App konfigurieren.",
			"EN" : "Here you can manage the profil information for your selected business.<br/>"+
			"You also can customize the CI which affects how your business is presented in the app."
		},
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
		"business.detail.section.profile" : {
			"DE" :  "Location Profil",
			"EN" : "Location Profile"
		},
		"business.detail.add.image.button" : {
			"DE" :  "Bild hinzufügen",
			"EN" : "Add image"
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
		"business.detail.url" : {
			"DE" : "Webseite",
			"EN" : "Website"
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
		"business.detail.section.app" : {
			"DE" :  "App Konfiguration",
			"EN" : "App Configuration"
		},
		"business.detail.section.app.description" : {
			"DE" :  "Konfigurieren Sie das Aussehen der cloobster App um es an Ihre CI anzupassen.",
			"EN" : "Configure the look of the cloobster App to best fit your CI."
		},
		"business.detail.app.header" : {
			"DE" :  "App Header Bild ",
			"EN" : "App Header Image"
		},
		"business.detail.app.header.description" : {
			"DE" : "Für ein optimales Aussehen wird das Bild auf ein festes Seitenverhältnis zugeschnitten.<br>Wählen sie mit dem Rahmen einen Ausschnitt.",
			"EN" : "For the best looks in the app, the image will be cut.<br>Change the selection for cutting below."
		},
		"business.detail.themes" : {
			"DE" : "Themes",
			"EN" : "Themes"
		},
		"business.detail.themes.description" : {
			"DE" : "Wähle ein Theme was am besten zu deiner CI passt.",
			"EN" : "Choose a theme which fits your CI best."
		},
		"business.detail.themes.tooltip" : {
			"DE" : "Klicken um Theme zu aktivieren.",
			"EN" : "Click to activate theme."
		},
		"business.detail.themes.default.description" : {
			"DE" :  "Der Standard Cloobster Theme",
			"EN" : "Default cloobster theme"
		},
		"business.detail.themes.red.description" : {
			"DE" :  "Ein roter und eleganter Theme",
			"EN" : "A red and elegant theme"
		},
		"business.detail.themes.green.description" : {
			"DE" :  "Ein grüner und freundlicher Theme",
			"EN" : "A green and friendly theme"
		},
		"business.detail.themes.blue.description" : {
			"DE" :  "Ein blauer und luftiger Theme",
			"EN" : "A blue and airy theme"
		},
		"business.detail.themes.orange.description" : {
			"DE" :  "Ein orangener und gemütlicher Theme",
			"EN" : "An orange and cosy theme"
		},
		"business.detail.section.facebook" : {
			"DE" :  "Facebook Konfiguration",
			"EN" : "Facebook Configuration"
		},
		"business.detail.section.facebook.description" : {
			"DE" :  "Hier können Sie konfigurieren wie Posts in Facebook dargestellt werden.",
			"EN" : "Here you can configure how Facebook posts will look like."
		},
		"business.detail.facebook.url" : {
			"DE" :  "Facebook Link",
			"EN" : "Facebook URL"
		},
		"business.detail.facebook.wallpost.image" : {
			"DE" :  "Pinwand Bild",
			"EN" : "Wallpost Image"
		},
		"business.action.delete.invalid" : {
			"DE" : "Passwort inkorrekt!",
			"EN" : "Password invalid!"
		},
		"business.dialog.delete.text" : {
		"DE" : "Du bist dabei <strong>{{activeBusiness.name}}</strong> zu löschen! Der Betrieb wird deaktiviert und in einen read-only modus versetzt. "+
			"Aktuell eingeloggte Servicekräfte und Gäste können noch Bestellungen einsehen aber keine weitere Aktionen tätigen. Der Betrieb "+
			" wird nach einer Weile permanent gelöscht!",
		"EN" : ""
		},
		"dialog.delete.confirm" : {
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
			"DE" : "Firmenprofil bearbeiten",
			"EN" : "Edit Company Profile"
		},
		"profile.company.action.edit.disable" : {
			"DE" : "Bearbeiten beenden",
			"EN" : "Done editing"
		},
		"profile.account.action.changepassword" : {
			"DE" : "Passwort ändern",
			"EN" : "Change password"
		},
		"profile.account.action.edit.enable" : {
			"DE" : "Account bearbeiten",
			"EN" : "Edit Account"
		},
		"profile.account.action.edit.disable.hint" : {
			"DE" : "Account Eigenschaft anklicken um diese zu editieren.",
			"EN" : "Click a account profile feature to edit."
		},
		"profile.account.action.edit.disable" : {
			"DE" : "Bearbeiten beenden",
			"EN" : "Done editing"
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
		"profile.dialog.changepassword.title" : {
			"DE" : "Passwort ändern",
			"EN" : "Change password"
		},
		"profile.dialog.changepassword.text" : {
			"DE" : "Bitte gib sowohl das aktuelle als auch das neue Passwort ein. Danach musst du dich mit den neuen Zugangsdaten erneut einloggen.",
			"EN" : "Please enter the current and new password. After submitting the new password you will have to login again with the new credentials."	
		},
		"profile.account.newpasswordrepeat" : {
			"DE" :  "Neues Passwort wiederholen",
			"EN" : "Repeat new password"
		},
		"profile.account.newpassword" : {
			"DE" :  "Neues Passwort",
			"EN" : "New password"
		},
		"profile.confirmemailupdate.message" : {
			"DE" : "Vielen Dank, die neue E-Mail Adresse wurde bestätigt.<br/>Alle neuen Nachrichten werden an diese Adresse gesendet.",
			"EN" : "Thank you, the new e-mail address was confirmed.<br/>All new messages will be send to this address."
		},
		//menus partial
		"menus.description" : {
			"DE" : "Hier können Sir ihre Produkte und Services anlegen und diesen einer Kategorie zuweisen.<br/>"+
					"Alle Kategorien können verschiedenen \"Service Bereichen\" zugewiesen werden um Zeit zu sparen (im Service Area Tab).",
			"EN" : "Here you can manage your catalog of products and services.<br/>"+
					"All categories can be associated with several service areas to save time and avoid duplicate entries."
		},
		"menus.list.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		// "menus.list.new" : {
		// 	"DE" : "Neue Kategorie...",
		// 	"EN" : "New category..."
		// },
		"menu.container.title" : {
			"DE" : "Kategorie editieren",
			"EN" : "Category edit"
		},		
		"menus.list.orphaned" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.list.orphaned.tooltip" : {
			"DE" : "Nicht zugewiesene Produkte anzeigen",
			"EN" : "Show not assigned products."
		},
		// "menus.menu.field.active" : {
		// 	"DE" : "Kategorie dem Gast anzeigen",
		// 	"EN" : "Show category to guest."
		// },
		"menus.menu.field.activate" : {
			"DE" : "Aktiv",
			"EN" : "Active"
		},
		"menus.menu.field.deactivate" : {
			"DE" : "Inaktiv",
			"EN" : "Inactive"
		},
		"menus.menu.delete" : {
			"DE" : "Löschen",
			"EN" : "Delete"
		},
		"menus.menu.dialog.delete.title" : {
			"DE" : "Kategorie {{currentMenu.title}} löschen",
			"EN" : "Delete {{currentMenu.title}} category"
		},
		"menus.menu.dialog.delete.text" : {
			"DE" : "<strong>{{currentMenu.title}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!<br/>Produkte werden nicht gelöscht.",
			"EN" : "Delete <strong>{{currentMenu.title}}</strong>? This can't be undone.!<br/>Products won't be deleted."
		},
		"menu.products.container.title" : {
			"DE" : "Produkte zur Kategorie",
			"EN" : "Products of categorie"
		},
		"products.list.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"menus.products.list.new" : {
			"DE" : "Neu",
			"EN" : "New"
		},
		"menus.products.container.link.title" : {
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
		"product.container.title" : {
			"DE" : "Produkt editieren",
			"EN" : "Product edit"
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
			"DE" : "Löschen",
			"EN" : "Delete product"
		},
		"menus.product.action.move" : {
			"DE" : "Verschieben...",
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
		"product.choices.container.title" : {
			"DE" : "Optionen zum Produkt",
			"EN" : "Options of product"
		},
		"menus.choices.list.new" : {
			"DE" : "Neu.",
			"EN" : "New choice..."
		},
		"menus.choices.list.existing" : {
			"DE" : "Bestehend",
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
		"choices.container.link.title" : {
			"DE" : "Auswahlmöglichkeiten",
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
		"menu.container.empty.description" : {
			"DE" : "Um die Details zu einer Kategorie anzuzeigen, wählen Sie bitte eine Kategorie aus der Liste links oder legen eine neue an.",
			"EN" : "To view category details please select a category from the list or add a new category."
		},
		"choice.container.title" :{
			"DE" : "Option editieren",
			"EN" : "Option edit"
		},
		"menus.options.title" : {
			"DE" : "Optionen",
			"EN" : "Options"
		},
		"option.configuration.container.title" : {
			"DE" : "Konfigurationen zur Option",
			"EN" : "Configurations of option"
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
		"product.container.empty.description" : {
			"DE" : "Um die Details zu einem Produkt anzuzeigen, wählen Sie bitte ein Produkt aus der Liste links oder legen ein neues an.",
			"EN" : "To view product details please select a product from the list or add a new product."
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
		"choice.editor.maxOccurence.error" : {
			"DE" : "Maximale Auswahl muss größer als minimale Auswahl sein oder 0 für keine Beschränking.",
			"EN" : "Maximum selected options must be greater than minimum selected options or 0 for no limit."
		},
		"choice.editor.minOccurence.error" : {
			"DE" : "Minimale Auswahl muss kleiner als maximale Auswahl sein, falls diese nicht 0 ist.",
			"EN" : "Minimum selected options must be less than maximum selected, if the maximum is different from 0."
		},
		"choice.editor.included" : {
			"DE" : "Anzahl von Inklusivoptionen",
			"EN" : "Amount of options inclusive"
		},
		"menus.choices.field.maxOccurence" : {
			"DE" : "Gast muss max auswählen {{currentChoice.maxOccurence}}",
			"EN" : "Guest has to chose max {{currentChoice.maxOccurence}}"
		},
		"menus.choices.field.minOccurence" : {
			"DE" : "Gast muss min auswählen {{currentChoice.minOccurence}}",
			"EN" : "Guest has to chose min {{currentChoice.minOccurence}}"
		},
		"menus.choices.field.included" : {
			"DE" : "Optionen Inklusive: {{currentChoice.included}}",
			"EN" : "Options free of charge {{currentChoice.included}}"
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
			"DE" : "Entfernen",
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
			"DE" : "Preis pro Selektion",
			"EN" : "Price per selection"
		},
		"menus.choices.field.overridePrice.none" : {
			"DE" : "Individueller Preis",
			"EN" : "Individual Price"
		},
		"menus.choices.field.overridePrice.overridesingleprice" : {
			"DE" : "Standardpreis",
			"EN" : "Standard price"
		},
		"menus.choices.field.overridePrice.overridefixedsum" : {
			"DE" : "Bündelpreis",
			"EN" : "Bundle price"
		},
		"menus.choices.field.overridePrice.description" : {
			"DE" : "<b>Individueller Preis</b> - Alle Selektionen haben eigenen Preis<br/>"+
					"<b>Standardpreis</b> - Alle Selektionen haben den selben Preis<br/>"+
					"<b>Bündelpreis</b> - Alle Selektionen zusammen haben einen Preis<br/>",
			"EN" : "<b>Individual Price</b> - Alle Selektionen haben eigenen Preis<br/>"+
					"<b>Standard price</b> - Alle Selektionen haben den selben Preis<br/>"+
					"<b>Bundle price</b> - Alle Selektionen zusammen haben einen Preis<br/>"
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
		"choice.container.empty.description" : {
			"DE" : "Um die Details zu einer Option anzuzeigen, wählen Sie bitte eine Option aus der Liste links oder legen eine neue an.",
			"EN" : "To view option details please select a option from the list or add a new option."
		},
		//spots partial
		"areas.description" : {
			"DE" :  "Für jede \"cloobster location\" können Sie mehrere \"Servicebereiche\" anlegen(z. B. \"Bar\", \"Zimmer\", \"Spa\", \"Konferenzraum\", etc.).<br>"
			+"Jeder Servicebereich beinhaltet verschiedene Spots (Barcode für den Check-in) und zugewiesene Produktkategorien.",
			"EN" : "For each \"cloobster location\" you can add several \"service areas\" (like \"Bar\", \"Rooms\", \"Spa\", \"Conference Area\", etc.).<br>"+
				"Each service area has different spots and a selection of product categories."
		},
		"areas.list.title" : {
			"DE" :  "Servicebereiche",
			"EN" : "Service Areas"
		},
		"areas.detail.title" : {
			"DE" :  "Servicebereich editieren",
			"EN" : "Edit Service Area"
		},
		"area.new.default.name" : {
			"DE" :  "Mein Servicebereich",
			"EN" : "My Service Area"
		},
		"areas.field.active" : {
			"DE" :  "Aktiv: Gäste können einchecken",
			"EN" : "Active: Guests can check-in"
		},
		"areas.editor.name" : {
			"DE" :  "Name des Servicebereichs",
			"EN" : "Name of service area"
		},
		"areas.editor.name.tooltip" : {
			"DE" :  "Name editieren",
			"EN" : "Edit name"
		},
		"areas.editor.description" : {
			"DE" :  "Beschreibung des Servicebereichs",
			"EN" : "Description of service area"
		},
		"areas.editor.description.tooltip" : {
			"DE" :  "Beschreibung editieren",
			"EN" : "Edit description"
		},
		"areas.spot.detail.title" : {
			"DE" :  "Spot editieren",
			"EN" : "Edit spot"
		},
		"areas.spots.list.title" : {
			"DE" : "Spots hinzufügen/editieren",
			"EN" : "Edit/Add Spots"
		},
		"areas.container.empty.description" : {
					"DE" :  "Zeigt Details des ausgewählten Servicebereichs an. Wählen Sie einen Bereich aus der Liste links",
					"EN" : "Shows the selected area details. Select an area from the list."
				},		
		"areas.spots.list.description" : {
			"DE" : "Spots (z. B. Tische oder Zimmer), die diesem Servicebereich zugeordnet sind.",
			"EN" : "Spots assigned to this area."
		},
		"areas.spot.container.empty.description" : {
			"DE" :  "Zeigt Details des ausgewählten Spots an. Wählen Sie einen Spot aus der Liste links.",
			"EN" : "Shows the selected area details. Select an area from the list."
		},
		"areas.categories.list.title" : {
			"DE" :  "Zugewiesenen Kategorien",
			"EN" : "Assigned categories"
		},
		"areas.categories.list.description" : {
			"DE" :  "Liste der Produktkategorien (z. B. Getränke) auf die der Gast zugriff hat, wenn er in diesem Bereich eingecheckt ist."+
				"Die Anzeigereihenfolge kann hier ebenfalls per Drag&Drop geregelt werden.",
			"EN" : "List of product categories (e. .g beverages) available to customers checked in in this service area."
		},
		"areas.allcategories.list.title" : {
			"DE" :  "Verfügbare Kategorien",
			"EN" : "Available categories"
		},
		"areas.allcategories.list.description" : {
			"DE" :  "Hier aufgelistete Produktkategorien können (mittels Drag&Drop) dem aktuellen Servicebereich zugewiesen werden um diese für eingecheckte Gäste verfügbar zu machen.",
			"EN" : "Here listed product categories can be assigned (via drag&drop) to current service area to make them available for checked in guests."
		},
		"areas.categories.moveable.tooltip" : {
			"DE" :  "Ziehen und loslassen um zuzuweisen oder die Reihenfolge zu ändern.",
			"EN" : "Drag&Drop to assign and order."
		},
		"areas.action.delete" : {
			"DE" : "Servicebereich löschen",
			"EN" : "Delete service area"
		},
		"areas.dialog.delete.text" : {
			"DE" : "{{currentArea.name}} wird gelöscht! Der Servicebereich, alle Spots und ihre Barcode können dann nicht mehr verwendet werden."+
					" Aktuell eingeloggte Servicekräfte und Gäste können den Bereich noch nutzen.<br/>"+
					"Der Bereich und alle Spots werden nach einer Weile permanent gelöscht",
			"EN" : "You're about to delete {{currentArea.name}}. The area, all spots and their barcodes won't be usable."+
					"All current customer checkins at the specific spots, will keep working.<br/>"+
					"Data will be kept for a while until it will be deleted permanently."
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
		"breadcrumb.areas" : {
			"DE" : "Servicebereiche",
			"EN" : "Service areas"
		},
		//file upload
		"fileupload.button.add" : {
			"DE" : "Bild auswählen ...",
			"EN" : "Select image"
		},
		"fileupload.button.crop" : {
			"DE" : "Zuschneiden",
			"EN" : "Crop image"
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
		"fileupload.error.size" : {
			"DE" : "Maximal erlaubte Dateigröße beträgt 3Mb.",
			"EN" : "Maximum allowed file size is 3Mb."
		},
		"fileupload.error.type" : {
			"DE" : "Bild muss vom Typ JPEG, GIF oder PNG sein.",
			"EN" : "Image type must be JPEG, GIF or PNG."
		},
		"propertyeditor.repeat.placeholder" : {
			"DE" : "Hier die Eingabe wiederholen",
			"EN" : "Repeat the input here"
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
		//login_form partial
		"login.password.forgot" : {
			"DE" :  "Passwort vergessen?",
			"EN" : "Forgot password?"
		},
		"login.facebook" : {
			"DE" :  "Login mit Facebook",
			"EN" : "Login with Facebook"
		},
		"login.remember" : {
			"DE" :  "eingeloggt bleiben",
			"EN" : "remember login"
		},
		"login.input.login" : {
			"DE" :  "Login",
			"EN" : "login"
		},
		"login.input.password" : {
			"DE" :  "Passwort",
			"EN" : "password"
		},
		//loginService errors
		"login.error.cockpituser" : {
			"DE" :  "Cockpit-Benutzerkonten haben auf die Verwaltung keinen Zugriff.",
			"EN" : "Cockpit user accounts can't access the management options."
		},
		//passwordforgot partial
		"login.password.reset.title" : {
			"DE" :  "Passwort zurücksetzen",
			"EN" : "Password reset"
		},
		"login.password.reset.description" : {
			"DE" :  "Bitte gebe die E-Mail Adresse deines Accounts an.",
			"EN" : "Enter the e-mail you registered with the account."
		},
		"login.password.reset.complete.description" : {
			"DE" :  "Eine Nachricht mit Resetlink wurde an deinen E-Mail Account geschickt.",
			"EN" : "Watch your e-mail account for a message with the password reset link."
		},
		//passwordreset partial
		"passwordreset.complete" : {
			"DE" :  "Neues Passwort erfolgreich gespeichert.",
			"EN" : "The new password was saved."
		},
		"passwordreset.description" : {
			"DE" :  "Gib ein neues Passwort ein.",
			"EN" : "Enter the new password."
		},
		//specific error messages
		"error.account.login.exists" : {
			"DE" : "Der Benutzername existiert bereits.",
			"EN" : "The login already exists."
		},
		"error.account.email.exists" : {
			"DE" : "Die E-Mail-Adresse wird bereits benutzt.",
			"EN" : "The e-mail address is already in use."
		},
		"error.accesstoken.invalid" : {
			"DE" : "Dieser Link ist nicht mehr gültig.",
			"EN" : "The link is no longer valid."
		},
		//common error messages
		"error.404" : {
			"DE" : "Eine Ressource konnte nicht geladen werden.",
			"EN" : "Resource not available."
		},
		"error.403" : {
			"DE" : "Ungültige Zugangsdaten oder keine Zugriffsrechte.",
			"EN" : "Invalid credentials, or insufficient rights."
		},
		"error.general" : {
			"DE" : "Es gibt ein Problem mit der Verbindung zum Service.",
			"EN" : "A connection problem to the service exists."
		},
		"common.sending" : {
			"DE" :  "Sende...",
			"EN" : "Sending..."
		},
		"common.send" : {
			"DE" :  "Sende",
			"EN" : "Send"
		}
	};

	$provide.value("translation", map);
}]);