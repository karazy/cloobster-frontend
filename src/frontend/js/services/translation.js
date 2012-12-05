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
			"DE" : "cloobster",
			"EN" : "cloobster"
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
			"DE" :  "Location Einstellungen",
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
		"businesses.headertabs.infopages" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info Pages"
		},
		"businesses.headertabs.documents" : {
			"DE" :  "Dokumente",
			"EN" : ""
		},
		//registration partial
		"registration.title" : {
			"DE" : "cloobster Registrierung",
			"EN" : "cloobster Registration"
		},
		"registration.form.fullname" : {
			"DE" : "Name*",
			"EN" : "Name*"
		},
		"registration.form.fullname.error.required" : {
			"DE" : "Bitte teilen Sie uns ihren Namen mit.",
			"EN" : "Tell us your name."
		},
		"registration.form.fullname.error.minlength" : {
			"DE" : "Der Name muss min. aus 3 Zeichen bestehen",
			"EN" : "Name must consist at least of 3 characters."
		},
		"registration.form.login" : {
			"DE" : "Benutzername*",
			"EN" : "User name*"
		},
		"registration.form.login.error.required" : {
			"DE" : "Suchen Sie sich bitte einen Benutzernamen aus.",
			"EN" : "Select a user name."
		},
		"registration.form.login.error.pattern" : {
			"DE" : 'Ihr Benutzername muss zwischen 4-30 Zeichen lang sein. Es sind nur Kleinbuchstanen und "_" "-" "." erlaubt.',
			"EN" : 'Your username must consist of 4-30 characters. Only lowercase and "_" "-" "." are permittet.'
		},
		"registration.form.email" : {
			"DE" : "E-Mail*",
			"EN" : "Email*"
		},
		"registration.form.email.error.required" : {
			"DE" : "Bitte geben Sie Ihre E-Mail an.",
			"EN" : "Please enter your email address."
		},
		"registration.form.email.error.email" : {
			"DE" : "Keine gültige E-Mail.",
			"EN" : "No valid email address."
		},
		"registration.form.emailrepeat" : {
			"DE" : "E-Mail wiederholen*",
			"EN" : "Repeat email address*"
		},
		"registration.form.emailrepeat.error.match" : {
			"DE" : "E-Mails stimmen nicht überein.",
			"EN" : "Email address does not match."
		},
		"registration.form.password" : {
			"DE" : "Passwort*",
			"EN" : "Password*"
		},
		"registration.form.password.error.required" : {
			"DE" : "Bitte wählen Sie ein Passwort.",
			"EN" : "Please enter a password."
		},
		"registration.form.password.error.pattern" : {
			"DE" : "Min. 6 Zeichen. Muss einen Buchstaben und eine Ziffer oder Sonderzeichen besitzen.",
			"EN" : "Min. 6 characters. Must contain one letter and one number or special character."
		},
		"registration.form.passwordrepeat" : {
			"DE" : "Passwort wiederholen*",
			"EN" : "Repeast password*"
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
			"DE" : "Bitte geben Sie eine Telefonnummer für Rückfragen an.",
			"EN" : "Please enter a phone number, so you we can call you back."
		},
		"registration.form.company" : {
			"DE" : "Firmenname*",
			"EN" : "Company name*"
		},

		"registration.form.company.error.required" : {
			"DE" : "Bitte geben Sie den Namen Ihrer Firma an.",
			"EN" : "Please enter company name."
		},
		"registration.form.address" : {
			"DE" : "Straße",
			"EN" : "Street"
		},
		"registration.form.address.error.required" : {
			"DE" : "Bitte geben Sie Ihre Adresse an.",
			"EN" : "Please enter address."
		},
		"registration.form.city" : {
			"DE" : "Stadt",
			"EN" : "City"
		},
		"registration.form.city.error.required" : {
			"DE" : "Bitte geben Sie Ihre Stadt an.",
			"EN" : "Please enter city."
		},
		"registration.form.postcode" : {
			"DE" : "Postleitzahl",
			"EN" : "Zipcode"
		},
		"registration.form.postcode.error.required" : {
			"DE" : "Bitte geben Sie Ihre Postleitzahl an.",
			"EN" : "Please enter zip code."
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
			"DE" : "Bitte geben Sie Ihr Land an.",
			"EN" : "Please enter country."
		},
		"registration.form.fullname.placeholder" : {
			"DE" : "z.B. Max Mustermann",
			"EN" : "e.g. John Doe"
		},
		"registration.form.login.placeholder" : {
			"DE" : "z.B. mustermann63",
			"EN" : "e.g. jdoe63"
		},
		"registration.form.email.placeholder" : {
			"DE" : "z.B. mustermann@gmail.com",
			"EN" : "e.g. johndoe@gmail.com"
		},
		"registration.form.emailrepeat.placeholder" : {
			"DE" : "E-Mail wiederholen",
			"EN" : "Repeat email address"
		},
		"registration.form.password.placeholder" : {
			"DE" : "Passwort",
			"EN" : "Password"
		},
		"registration.form.passwordrepeat.placeholder" : {
			"DE" : "Passwort wiederholen",
			"EN" : "Repeat password"
		},
		"registration.form.phone.placeholder" : {
			"DE" : "z.B. 0049-170-4153172",
			"EN" : "e.g. 0049-170-4153172"
		},
		"registration.form.company.placeholder" : {
			"DE" : "z.B. ACME Hotel",
			"EN" : "e.g. ACME Hotel"
		},
		"registration.form.address.placeholder" : {
			"DE" : "z.B. Bahnhofstraße 3",
			"EN" : "e.g. Mainstreet 3"
		},
		"registration.form.city.placeholder" : {
			"DE" : "z.B. Frankfurt",
			"EN" : "e.g. London"
		},
		"registration.form.postcode.placeholder" : {
			"DE" : "z.B. 60311",
			"EN" : "e.g. W11"
		},
		"registration.form.businessphone.placeholder" : {
			"DE" : "z.B. 0049-170-4153172",
			"EN" : "e.g. 0049-170-4153172"
		},
		"registration.action.fblogin" : {
			"DE" : "Mit Facebook einloggen und cloobster verknüpfen.",
			"EN" : "Log in to Facebook and link with cloobster."
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
		"registration.form.terms" : {
			"DE" : 'Allgemeine Geschäftsbedinungen (AGB) und Datenschutzbestimmung',
			"EN" : 'Terms Of Service and Privacy Policy'
		},
		"registration.form.acceptterms" : {
			"DE" : "Hiermit akzeptiere ich die AGB und Datenschutzbestimmung der Karazy GmbH",
			"EN" : "I hereby accept the Terms Of Service and Privacy Policy "
		},
		"registration.form.accept-terms.error.required" : {
			"DE" : "Bitte akzeptieren Sie die AGB und Datenschutzbestimmung, um fortzufahren.",
			"EN" : "Please accept the Terms Of Service and Privacy Policy to continue."
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
			"EN" : "Thank you for your registration, {{account.name}}.<br/>"+
				"An email with an activation link will be sent to {{account.email}}."
		},
		"registration.confirmemail.title" : {
			"DE" : "E-Mail-Adresse bestätigt",
			"EN" : "E-mail address has been confirmed."
		},
		"registration.confirmemail.message" : {
			"DE" : "Vielen Dank, die E-Mail-Adresse wurde bestätigt, und das Konto kann ab sofort genutzt werden.",
			"EN" : "Thank you, your e-mail address has been confirmed and your account can now be used."
		},
		"registration.form.requiredfield" : {
			"DE" :  "* Pflichtfeld",
			"EN" : "* required field"
		},
		"registration.success.title" : {
			"DE" :  "cloobster Registrierung erfolgreich!",
			"EN" :  "cloobster registration successful!"
		},
		//businesses partial
		"businesses.title" : {
			"DE" : "Meine Locations",
			"EN" : "My Locations"
		},
		"businesses.empty.description" : {
			"DE" :  "Im Moment haben Sie keine gespeicherten Locations. Um cloobster zu nutzen, müssen Sie mindestens eine Location (Hotel, Restaurant) anlegen.",
			"EN" : "You have no current locations. You need at least one location (hotel, restaurant) to use cloobster."
		},
		"businesses.description" : {
			"DE" :  "Hier können Sie Ihre unterschiedlichen Locations (Hotels, Restaurants) verwalten und für cloobster vorbereiten.",
			"EN" :  "You can add, edit, or delete your locations (hotels, restaurants) here."
		},
		"businesses.add" : {
			"DE" : "Location hinzufügen",
			"EN" : "Add location"
		},
		"businesses.add.title" : {
			"DE" : "Location hinzufügen",
			"EN" : "Add location"
		},
		"businesses.action.show" : {
			"DE" : "Einstellungen",
			"EN" : "Settings"
		},
		"businesses.action.spots" : {
			"DE" : "Servicebereiche und Spots",
			"EN" : "Service areas and spots"
		},
		"businesses.action.menus" : {
			"DE" : "Produkte",
			"EN" : "Products"
		},
		"businesses.action.documents" : {
			"DE" :  "Dokumente",
			"EN" : ""
		},
		"businesses.action.infopages" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info pages"
		},
		"businesses.action.accounts" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "User management"
		},
		"businesses.action.delete" : {
			"DE" : "Location löschen",
			"EN" : "Delete location"
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
			"EN" : "Zip code*"
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
			"DE" : "Location löschen",
			"EN" : "Delete location"
		},
		"busineses.business.deleted.tooltip" : {
			"DE" : "Diese Location wurde gelöscht.",
			"EN" : "This location has been deleted."
		},
		//business detail partial
		"business.detail.help" : {
			"DE" :  "Hier können Sie das Profil der aktiven Location pflegen.<br/>Außerdem können Sie hier die Oberfläche der App konfigurieren.",
			"EN" : "Edit properties of current location.<br/>Configure corporate identity for app."
		},
		"business.action.edit.enable" : {
			"DE" : "Editiermodus aktivieren",
			"EN" : "Enable edit mode"
		},
		"business.action.edit.disabled" : {
			"DE" : "Editiermodus beenden",
			"EN" : "Disable edit mode"
		},
		"business.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken, um zu editieren.",
			"EN" : "Select profile properties to edit"
		},
		"business.detail.section.profile" : {
			"DE" :  "Location Profil",
			"EN" :  "Location profile"
		},
		"business.detail.add.image.button" : {
			"DE" :  "Bild hinzufügen",
			"EN" :  "Add image"
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
		"business.detail.logo" : {
			"DE" :  "Logo Bild",
			"EN" : "Logo picture"
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
			"EN" : "Zip code"
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
			"EN" : "Payment method"
		},
		"business.detail.paymentmethods" : {
			"DE" : "Bezahlarten",
			"EN" : "Payment methods"
		},
		"business.detail.paymentmethods.list.new" : {
			"DE" : "Neue Bezahlart",
			"EN" : "New payment"
		},
		"business.detail.section.app" : {
			"DE" :  "App Konfiguration",
			"EN" : "App configuration"
		},
		"business.detail.section.app.description" : {
			"DE" :  "Konfigurieren Sie das Aussehen der cloobster App, um es an Ihre CI anzupassen.",
			"EN" : "Configure cloobster app to best fit your corporate identity."
		},
		"business.detail.app.header" : {
			"DE" :  "App Header Bild ",
			"EN" :  "App header image"
		},
		"business.detail.app.header.description" : {
			"DE" : "Für ein optimales Aussehen der App wird das Bild auf ein festes Seitenverhältnis zugeschnitten.<br>Wählen Sie mit dem Rahmen einen Ausschnitt.",
			"EN" : "To fit your app the image will have to be cropped.<br>Change aspect ratio below."
		},
		"business.detail.themes" : {
			"DE" : "Themes",
			"EN" : "Themes"
		},
		"business.detail.themes.description" : {
			"DE" : "Wählen Sie das Motiv, das am besten zu Ihrer CI passt.",
			"EN" : "Choose a theme which best fits your corporate identity."
		},
		"business.detail.themes.tooltip" : {
			"DE" : "Bitte klicken, um Motiv zu aktivieren.",
			"EN" : "Click to activate theme."
		},
		"business.detail.themes.default.description" : {
			"DE" :  "Das Standard-cloobster-Motiv",
			"EN" :  "Default cloobster theme"
		},
		"business.detail.themes.red.description" : {
			"DE" :  "Ein rotes und elegantes Motiv",
			"EN" :  "A red and elegant theme"
		},
		"business.detail.themes.green.description" : {
			"DE" :  "Ein grünes und freundliches Motiv",
			"EN" :  "A green and friendly theme"
		},
		"business.detail.themes.blue.description" : {
			"DE" :  "Ein blaues und luftiges Motiv",
			"EN" :  "A blue and breezy theme"
		},
		"business.detail.themes.orange.description" : {
			"DE" :  "Ein orangenes und gemütliches Motiv",
			"EN" :  "An orange and cosy theme"
		},
		"business.detail.section.facebook" : {
			"DE" :  "Facebook Konfiguration",
			"EN" :  "Facebook configuration"
		},
		"business.detail.section.facebook.description" : {
			"DE" : "Hier können Sie konfigurieren, wie Posts in Facebook dargestellt werden.",
			"EN" : "Configure appearance of facebook posts here."
		},
		"business.detail.facebook.url" : {
			"DE" :  "Facebook Link",
			"EN" :  "Facebook link"
		},
		"business.detail.facebook.wallpost.image" : {
			"DE" :  "Pinwand Bild",
			"EN" :  "Wallpost image"
		},
		"business.detail.facebook.wallpost.image.description"  : {
			"DE" : "Für ein optimales Aussehen in einem Facebook-Post wird das Bild auf ein festes Seitenverhältnis zugeschnitten.<br>Wählen Sie mit dem Rahmen einen Ausschnitt.",
			"EN" : "Image needs to be cropped.<br>Change aspect ratio below."
		},
		"business.action.delete.invalid" : {
			"DE" : "Passwort inkorrekt!",
			"EN" : "Password invalid!"
		},
		"business.dialog.delete.text" : {
		"DE" : "Du bist dabei, <strong>{{activeBusiness.name}}</strong> zu löschen! Die Location wird deaktiviert und in einen Lesemodus versetzt. "+
			"Aktuell eingeloggte Servicekräfte und Gäste können noch Bestellungen einsehen, aber keine weitere Aktionen tätigen. Die Location "+
			" wird nach einer Weile permanent gelöscht!",
		"EN" : "You are about to delete <strong>{{activeBusiness.name}}</strong>! Location will be read-only after it has been deleted and will be permanently removed shortly afterwards."
		},
		"dialog.delete.confirm" : {
			"DE" : "Bitte geben Sie Ihr Passwort ein, um die Löschaktion zu bestätigen.",
			"EN" : "Please enter your password to confirm deletion."
		},
		"business.languageselection.title" : {
			"DE" :  "Sprachauswahl",
			"EN" :  "Select language"
		},
		"business.languageselection.description" : {
			"DE" :  "Wählen Sie die Sprachen aus, die Sie in cloobster anbieten wollen.<br/>Sie können dann in Bereichen, die Mehrsprachigkeit "+
			"unterstützen, mittels einer Auswahlliste (rechts oben) die jeweilige Sprache, die Sie pflegen wollen, auswählen.<br/>"+
			"Nicht übersetzte Felder werden dem Kunden in der Standardsprache angezeigt.",
			"EN" : "Please select languages you want to offer in cloobster app.<br/>You can select a language for each location using the drop-down menu in the upper right corner.<br/>Fields that have not been translated will be shown in the default language."
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
			"EN" : "Edit company profile"
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
			"DE" : "Konto bearbeiten",
			"EN" : "Edit account"
		},
		"profile.account.action.edit.disable.hint" : {
			"DE" : "Kontoeigenschaft anklicken, um dieses zu editieren.",
			"EN" : "Click to edit account profile."
		},
		"profile.account.action.edit.disable" : {
			"DE" : "Bearbeiten beenden",
			"EN" : "Done editing"
		},
		"profile.company.action.edit.disable.hint" : {
			"DE" : "Profileigenschaft anklicken, um zu editieren.",
			"EN" : "Click to edit property."
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
			"EN" : "Zip code"
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
			"DE" : "Bitte geben Sie sowohl das aktuelle als auch das neue Passwort ein. Danach müssen Sie sich mit den neuen Zugangsdaten erneut einloggen.",
			"EN" : "Please enter current and new password. You will have to log in again afterwards with your new credentials."	
		},
		"profile.account.newpasswordrepeat" : {
			"DE" :  "Neues Passwort wiederholen",
			"EN" :  "Repeat password"
		},
		"profile.account.newpassword" : {
			"DE" :  "Neues Passwort",
			"EN" :  "New password"
		},
		"profile.confirmemailupdate.message" : {
			"DE" : "Vielen Dank, die neue E-Mail Adresse wurde bestätigt.<br/>Alle neuen Nachrichten werden an diese Adresse gesendet.",
			"EN" : "Thank you, your new e-mail address has been confirmed.<br/>All new messages will be sent to this address."
		},
		//menus partial
		"menus.description" : {
			"DE" : "Hier können Sie Ihre Produkte und Services anlegen und diese einer Kategorie zuweisen.<br/>"+
					"Alle Kategorien können verschiedenen \"Service Bereichen\" zugewiesen werden, um Zeit zu sparen (im Service Area Tab).",
			"EN" : "You can manage your products and services here.<br/>"+
					"In order to save time, all categories can be associated with several service areas."
		},
		"menus.list.title" : {
			"DE" : "Kategorien",
			"EN" : "Categories"
		},
		"menu.container.hint" : {
			"DE" :  "Bitte vergessen Sie nicht, die Kategorie einem Servicebereich zuzuweisen.",
			"EN" : "Don't forget to assign this category to a service area afterwards."
		},
		"menu.container.title" : {
			"DE" : "Kategorie editieren",
			"EN" : "Edit category"
		},		
		"menus.list.orphaned" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.list.orphaned.tooltip" : {
			"DE" : "Nicht zugewiesene Produkte anzeigen",
			"EN" : "Show non-assigned products."
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
			"EN" : "Delete <strong>{{currentMenu.title}}</strong>? This cannot be undone.!<br/>Products won't be deleted."
		},
		"menu.products.container.title" : {
			"DE" : "Produkte dieser Kategorie",
			"EN" : "Products of this category"
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
			"DE" : "Klicken Sie auf eine bestehendes Produkt, um dieses zu kopieren und der aktuellen Kategory hinzuzufügen. Wahlweise können zusätzlich <strong>Auswahlmöglichkeiten verknüpft</strong> oder <strong>kopiert werden</strong>.",
			"EN" : "Click on existing product to copy it and add to current category."+
				"Optionally link or copy choices."
		},
		"menus.products.orphaned.title" : {
			"DE" : "Verwaiste Produkte",
			"EN" : "Orphaned products"
		},
		"menus.products.orphaned.description" : {
			"DE" : "Liste aller Produkte die keiner Kategorie zugeordnet sind.",
			"EN" : "List of all non-assigned products."
		},
		"product.container.title" : {
			"DE" : "Produkt editieren",
			"EN" : "Edit product"
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
			"EN" : "Show product to customers"
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
			"DE" : "Verschiebt das aktuelle Produkt<br/>in ausgewählte Kategorie.",
			"EN" : "Moves current product to selected category."
		},
		"menus.product.dialog.delete.title" : {
			"DE" : "Produkt {{currentProduct.name}} löschen",
			"EN" : "Delete {{currentProduct.name}} product"
		},
		"menus.product.dialog.delete.text" : {
			"DE" : "<strong>{{currentProduct.name}}</strong> löschen? Dies kann nicht rückgängig gemacht werden!",
			"EN" : "Delete <strong>{{currentProduct.name}}</strong>? This cannot be undone!"
		},
		"product.choices.container.title" : {
			"DE" : "Optionen zum Produkt",
			"EN" : "Product options"
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
			"DE" : "Klicken Sie auf eine bestehende Auswahlmöglichkeit, um diese mit dem aktuellen Produkt zu <strong>verknüpfen</strong> oder zu <strong>kopieren</strong>.<br/>Es werden keine abhängigen Auswahlen angezeigt.",
			"EN" : "Click on existing choice to link with (or copy to) current product."
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
			"DE" : "Um die Details zu einer Kategorie anzuzeigen, wählen Sie bitte eine Kategorie aus der Liste links oder legen Sie eine neue an.",
			"EN" : "To view category details, please select a category from the list or add a new category."
		},
		"choice.container.title" :{
			"DE" : "Option editieren",
			"EN" : "Edit option"
		},
		"menus.options.title" : {
			"DE" : "Optionen",
			"EN" : "Options"
		},
		"option.configuration.container.title" : {
			"DE" : "Konfigurationen zur Option",
			"EN" : "Configure options"
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
			"EN" : "Ente a valid price (e. g. 9.95, or 5)."
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
			"DE" : "Um die Details zu einem Produkt anzuzeigen, wählen Sie bitte ein Produkt aus der Liste links oder legen Sie ein neues an.",
			"EN" : "To view product details, please select a product from the list or add a new product."
		},		
		"choice.editor.text" : {
			"DE" : "Auswahltext",
			"EN" : "Choice text"
		},
		"choice.editor.maxOccurence" : {
			"DE" : "Maximale Auswahl von Optionen",
			"EN" : "Maximum number of options"
		},
		"choice.editor.minOccurence" : {
			"DE" : "Minimale Auswahl von Optionen",
			"EN" : "Minimum number of options"
		},
		"choice.editor.maxOccurence.error" : {
			"DE" : "Maximale Auswahl muss größer als minimale Auswahl sein oder 0 für keine Beschränkung.",
			"EN" : "Maximum number of options must be greater than minimum number of options or 0 for no limit."
		},
		"choice.editor.minOccurence.error" : {
			"DE" : "Minimale Auswahl muss kleiner als maximale Auswahl sein, falls diese nicht 0 ist.",
			"EN" : "Minimum number of options must be less than maximum number of options if the maximum is greater than 0."
		},
		"choice.editor.included" : {
			"DE" : "Anzahl von Inklusivoptionen",
			"EN" : "Amount of options included"
		},
		"menus.choices.field.maxOccurence" : {
			"DE" : "Gast muss max. auswählen {{currentChoice.maxOccurence}}",
			"EN" : "Guest has to choose max. {{currentChoice.maxOccurence}}"
		},
		"menus.choices.field.minOccurence" : {
			"DE" : "Gast muss min auswählen {{currentChoice.minOccurence}}",
			"EN" : "Guest has to choose at min. {{currentChoice.minOccurence}}"
		},
		"menus.choices.field.included" : {
			"DE" : "Optionen inklusive: {{currentChoice.included}}",
			"EN" : "Options free of charge {{currentChoice.included}}"
		},
		"menus.choices.field.price" : {
			"DE" : "Preis: {{currentChoice.price | kcurrency:activeBusiness.currency}}",
			"EN" : "Price: {{currentChoice.price | kcurrency:activeBusiness.currency}}"
		},
		"menus.choices.field.linkedchoices" : {
			"DE" : "Untergeordnete Auswahlen",
			"EN" : "Linked choices"
		},
		"menus.choices.field.linkedproducts" : {
			"DE" : "Wird verwendet in ...",
			"EN" : "Used in ..."
		},
		"menus.choices.field.linkedproducts.help" : {
			"DE" : "Listet alle Produkte auf,<br/> die diese Auswahlmöglichkeit verwenden.",
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
			"EN" : "Edit maximum number of choices"
		},
		"choice.editor.minOccurence.tooltip" : {
			"DE" : "Minimale Optionsauswahl editieren",
			"EN" : "Edit minimum number of choices"
		},
		"choice.editor.included.tooltip" : {
			"DE" : "Anzahl inklusiv<br/>Optionen editieren",
			"EN" : "Edit number of included options"
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
			"DE" : "Preis pro Auswahlmöglichkeit",
			"EN" : "Price per choice"
		},
		"menus.choices.field.overridePrice.none" : {
			"DE" : "Individueller Preis",
			"EN" : "Individual price"
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
			"DE" : "<b>Individueller Preis</b> - Alle Auswählmöglichkeiten haben einen eigenen Preis<br/>"+
					"<b>Standardpreis</b> - Alle Auswählmöglichkeiten haben den gleichen Preis<br/>"+
					"<b>Bündelpreis</b> - Alle Auswählmöglichkeiten zusammen haben einen Preis<br/>",
			"EN" : "<b>Individual price</b> - All choices have an individual price<br/>"+
					"<b>Standard price</b> - All choices have the same price<br/>"+
					"<b>Bundle price</b> - All choices have one price and are included<br/>"
		},
		"menus.choices.field.parentselect.label" : {
			"DE" : "Übergeordnete Auswahl:",
			"EN" : "Parent choice"
		},
		"menus.choices.field.parentselect.nullparent" : {
			"DE" : "--- auswählen ---",
			"EN" : "--- select ---"
		},
		"menus.choices.parentselect.tooltip" : {
			"DE" : "Ein hier ausgewähltes Element führt dazu, dass diese Auswahlmöglichkeit nur aktiv wird, "+
			"wenn der Kunde im übergeordneten Element eine Auswahl trifft.",
			"EN" : "Select a parent choice to only enable current choice when the parent gets selected."
		},
		"menus.choices.linkedchoices.tooltip" : {
			"DE" : "Auflistung aller Auswahlmöglichkeiten, die von dieser abhängen.",
			"EN" : "Lists all choices link to this choice."
		},
		"choice.container.empty.description" : {
			"DE" : "Um die Details zu einer Option anzuzeigen, wählen Sie bitte eine Option aus der Liste links oder legen Sie eine neue an.",
			"EN" : "To view option details please select an option from the list or add a new option."
		},
		//spots partial
		"areas.description" : {
			"DE" :  "Für jede \"cloobster location\" können Sie mehrere \"Servicebereiche\" anlegen(z.B. \"Bar\", \"Zimmer\", \"Spa\", \"Konferenzraum\", etc.).<br>"
			+"Jeder Servicebereich beinhaltet verschiedene Spots (Barcode für den Check-in) und zugewiesene Produktkategorien.",
			"EN" : "For each \"cloobster location\" you can add several \"service areas\" (like \"Bar\", \"Rooms\", \"Spa\", \"Conference Area\", etc.).<br>"+
				"Each service area has different spots and a selection of product categories."
		},
		"areas.list.title" : {
			"DE" :  "Servicebereiche",
			"EN" :  "Service areas"
		},
		"areas.detail.title" : {
			"DE" :  "Servicebereich editieren",
			"EN" :  "Edit service area"
		},
		"area.new.default.name" : {
			"DE" :  "Mein Servicebereich",
			"EN" :  "My service area"
		},
		"areas.field.active" : {
			"DE" :  "Aktiv: Gäste können einchecken",
			"EN" :  "Active: Guests can check in"
		},
		"areas.editor.name" : {
			"DE" :  "Name des Servicebereichs",
			"EN" :  "Name of service area"
		},
		"areas.editor.name.tooltip" : {
			"DE" :  "Name editieren",
			"EN" :  "Edit name"
		},
		"areas.editor.description" : {
			"DE" :  "Beschreibung des Servicebereichs",
			"EN" :  "Description of service area"
		},
		"areas.editor.description.tooltip" : {
			"DE" :  "Beschreibung editieren",
			"EN" : " Edit description"
		},
		"areas.spot.detail.title" : {
			"DE" :  "Spot editieren",
			"EN" :  "Edit spot"
		},
		"areas.spots.list.title" : {
			"DE" : "Spots hinzufügen/editieren",
			"EN" : "Edit/add spots"
		},
		"areas.container.empty.description" : {
					"DE" :  "Zeigt Details des ausgewählten Servicebereichs an. Wählen Sie einen Bereich aus der Liste links",
					"EN" :  "Shows details of the selected area. Select an area from the list."
				},		
		"areas.spots.list.description" : {
			"DE" : "Spots (z.B. Tische oder Zimmer), die diesem Servicebereich zugeordnet sind.",
			"EN" : "Spots assigned to this area."
		},
		"areas.spot.container.empty.description" : {
			"DE" :  "Zeigt Details des ausgewählten Spots an. Wählen Sie einen Spot aus der Liste links.",
			"EN" :  "Shows details of selected area. Select an area from the list."
		},
		"areas.categories.list.title" : {
			"DE" :  "Zugewiesenen Kategorien",
			"EN" :  "Assigned categories"
		},
		"areas.categories.list.description" : {
			"DE" :  "Liste der Produktkategorien (z.B. Getränke), auf die der Gast Zugriff hat, wenn er in diesem Bereich eingecheckt ist."+
				"Die Anzeigereihenfolge kann hier ebenfalls per Drag&Drop geregelt werden.",
			"EN" :  "List of product categories (e.g. beverages) available to customers checked in to this service area."
		},
		"areas.allcategories.list.title" : {
			"DE" :  "Verfügbare Kategorien",
			"EN" :  "Available categories"
		},
		"areas.allcategories.list.description" : {
			"DE" :  "Hier aufgelistete Produktkategorien können (mittels Drag&Drop) dem aktuellen Servicebereich zugewiesen werden, um diese für eingecheckte Gäste verfügbar zu machen.",
			"EN" : "The following product categories can be assigned (via drag & drop) to current service area to make them available to customers."
		},
		"areas.categories.moveable.tooltip" : {
			"DE" :  "Ziehen und loslassen, um zuzuweisen oder die Reihenfolge zu ändern.",
			"EN" :  "Drag & drop to assign and change order of appearance."
		},
		"areas.action.delete" : {
			"DE" : "Servicebereich löschen",
			"EN" : "Delete service area"
		},
		"areas.dialog.delete.text" : {
			"DE" : "{{currentArea.name}} wird gelöscht! Der Servicebereich, alle Spots und ihre Barcodes können dann nicht mehr verwendet werden."+
					" Aktuell eingeloggte Servicekräfte und Gäste können den Bereich noch nutzen.<br/>"+
					"Der Bereich und alle Spots werden nach einer Weile permanent gelöscht",
			"EN" : "You're about to delete {{currentArea.name}}. This area, all spots, and barcodes cannot be used any longer."+
					"All current customer checkins at the specific spots will continue to work.<br/>"+
					"Data will be permanently deleted."
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
			"EN" : "Activ: Guests can check in"
		},
		"spot.action.delete" : {
			"DE" : "Spot löschen",
			"EN" : "Delete spot"
		},
		"spot.action.delete.text" : {
			"DE" : "{{currentSpot.name}} wird gelöscht!<br/>Bereits ausgedruckte Barcodes können nicht wiederverwendet werden!",
			"EN" : "{{currentSpot.name}} will be deleted!<br/>Barcode cannot be reused!"
		},
		"spots.masscreation.title" : {
			"DE" :  "Mehrere Spots anlegen",
			"EN" : ""
		},
		"spots.masscreation.description" : {
			"DE" :  "Hier können Sie mehrere Spots auf einmal anlegen.<br/>Zum Beispiel Zimmer 100 bis Zimmer 199",
			"EN" : ""
		},
		"spot.masscreation.button" : {
			"DE" :  "Mehrere",
			"EN" : ""
		},
		"spots.masscreation.name" : {
			"DE" :  "Name*",
			"EN" : ""
		},
		"spots.masscreation.startnumber" : {
			"DE" :  "Startnummer",
			"EN" : ""
		},
		"spots.masscreation.count" : {
			"DE" :  "Anzahl*",
			"EN" : ""
		},
		"spots.masscreation.placeholder.name" : {
			"DE" :  "z.B. Zimmer oder Tisch",
			"EN" : ""
		},
		"spots.masscreation.placeholder.startnumber" : {
			"DE" :  "z.B. 100 (Standard 1)",
			"EN" : ""
		},
		"spots.masscreation.placeholder.count" : {
			"DE" :  "z.B. 50",
			"EN" : ""
		},
		"spots.masscreation.count.error.min" : {
			"DE" :  "Anzahl muss min. 1 sein.",
			"EN" : ""
		},
		"spots.masscreation.count.error.max" : {
			"DE" :  "Anzahl darf max. 500 sein.",
			"EN" : ""
		},
		"spots.massdelete.title" : {
			"DE" :  "Selektierte Spots löschen",
			"EN" : ""
		},
		"spots.massdelete.description" : {
			"DE" :  "Löscht alle selektierten Spots. Diese Aktion kann nicht rückgängig gemacht werden.<br/>"+
			"Ausgedruckte Barcodes sind danach nicht mehr gültig.",
			"EN" : ""
		},
		"spots.massactivate.tooltip" : {
			"DE" :  "Selektierte aktivieren",
			"EN" : ""
		},
		"spots.massdeactivate.tooltip" : {
			"DE" :  "Selektiere deaktivieren",
			"EN" : ""
		},
		"spots.massdelete.tooltip" : {
			"DE" :  "Selektierte löschen",
			"EN" : ""
		},
		"spots.masscheck.tooltip" : {
			"DE" :  "Alle anwählen/abwählen",
			"EN" : ""
		},
		"spots.filtered.status" : {
			"DE" :  "Spots gefiltert {{filteredSpots.length}} | markiert {{getCheckedSpotsCount()}}",
			"EN" : ""
		},
		"spots.legend.inactive" : {
			"DE" :  "Inaktiv",
			"EN" : ""
		},
		"spots.listheader.selected" : {
			"DE" :  "Markierte ...",
			"EN" : ""
		},
		"spots.listheader.create" : {
			"DE" :  "Anlegen ...",
			"EN" : ""
		},
		"spots.action.setactive" : {
			"DE" :  "Aktiv setzen",
			"EN" : ""
		},
		"spots.action.setinactive" : {
			"DE" :  "Inaktiv setzen",
			"EN" : ""
		},
		"spots.action.generatepdf" : {
			"DE" :  "PDF generieren",
			"EN" : ""
		},
		"spots.action.generatepdf.description" : {
			"DE" :  "Geniert ein Aufsteller PDF für ausgewählte Spots. Wenn das Dokument fertig erstellt wurde, kann es im Dokumententab heruntergeladen werden.",
			"EN" : ""
		},
		//infopage partial
		"infopages.description" : {
			"DE" :  "Hier können Sie Informationen zur aktuellen Location anlegen. Dies können zum Beispiel Informationen<br/>"+
			"über Blumenservice, Frühstückszeiten, Kontaktdaten und so weiter sein.",
			"EN" : "Information pages for your locations (e.g. business hours, available services, tips)."
		},
		"infopages.list.title" : {
			"DE" :  "Info-Seiten",
			"EN" :  "Info pages"
		},
		"infopage.container.title" : {
			"DE" :  "Informationsdetails",
			"EN" :  "Details"
		},
		"infopage.title" : {
			"DE" :  "Titel bearbeiten",
			"EN" :  "Edit title"
		},
		"infopage.shortText" : {
			"DE" :  "Kurztext bearbeiten",
			"EN" :  "Edit short text"
		},
		"infopage.image" : {
			"DE" :  "Bild hinzufügen",
			"EN" :  "Add picture"
		},
		"infopage.html" : {
			"DE" :  "Text bearbeiten",
			"EN" :  "Edit text"
		},
		"infopages.dialog.delete.title" : {
			"DE" :  "Info-Seite löschen",
			"EN" :  "Delete info page"
		},
		"infopages.dialog.delete.text" : {
			"DE" :  "Die Seite {{currentInfoPage.title}} wird gelöscht.<br/>Dies kann nicht rückgängig gemacht werden.",
			"EN" :  "Info page {{currentInfoPage.title}} will be deleted.<br/>This action cannot be undone."
		},
		"infogape.empty.description" : {
			"DE" :  "Um die Details zu einer Info-Seite zu bearbeiten, wählen Sie bitte eine Info-Seite aus der Liste links oder legen Sie eine neue an.",
			"EN" :  "To edit info page, please select info page from list or add a new page."
		},
		"infopage.placeholder.title" : {
			"DE" :  "Z.B. Frühstückszeiten",
			"EN" :  "e.g. breakfast hours"
		},
		"infopage.placeholder.shortText" : {
			"DE" :  "Kurze Information! z.B. von 8:00 - 10:00",
			"EN" :  "Short text! E.g. 08:00 AM - 10.00 AM"
		},
		"infopage.placeholder.html" : {
			"DE" :  "Ausführliche Information!<br/> z.B. Zu unserem reichhaltigen Frühstück dürfen wir sie zu folgenden Zeiten begrüßen"+
			"<ul><li>Mo- Fr von 8:00 - 10:00</li><li>Sa- So 8:00 - 12:00</li></ul>",
			"EN" :  "Long text! E.g. We offer breakfast between..."
		},
		//documents partial
		"documents.title" : {
			"DE" :  "Dokumente",
			"EN" : ""
		},
		"documents.description" : {
			"DE" :  "Hier können Sie Dokumente der ausgewählten Location verwalten. Dokumente sind zum Beispiel Spot Aufsteller als PDF oder Marketing Flyer.",
			"EN" : ""
		},
		"documents.table.document" : {
			"DE" :  "Name",
			"EN" : ""
		},
		"documents.table.type" : {
			"DE" :  "Typ",
			"EN" : ""
		},
		"documents.table.status" : {
			"DE" :  "Status",
			"EN" : ""
		},
		"documents.table.date" : {
			"DE" :  "Erstellt am",
			"EN" : ""
		},
		"documents.table.actions" : {
			"DE" :  "Aktionen",
			"EN" : ""
		},
		"documents.dialogdelete.title" : {
			"DE" :  "Dokument löschen",
			"EN" : ""
		},
		"documents.dialogdelete.description" : {
			"DE" :  "Löschen des Dokuments \"{{documentToDelete.status}}\" kann nicht rückgängig gemacht werden.",
			"EN" : ""
		},
		"documents.status.complete" : {
			"DE" :  "Abgeschlossen",
			"EN" : ""
		},
		"documents.status.error" : {
			"DE" :  "Fehler",
			"EN" : ""
		},
		"documents.status.pending" : {
			"DE" :  "In Bearbeitung",
			"EN" : ""
		},
		//accounts partial
		"accounts.title" : {
			"DE" : "Benutzerverwaltung",
			"EN" : "Account management"
		},
		"accounts.description" : {
			"DE" :  "Hier können Sie Benutzerkonten verwalten. Es gibt zwei Arten von Konten.<br/>"+
			"<ol><li>Admin-Konten haben die gleichen Rechte wie das Firmenkonto,<br/>können aber keine weiteren Admins "+
			" anlegen und keine Locations anlegen/löschen.</li>"+
			"<li>Service-Konten können nur auf das Cockpit zugreifen.</li></ol>"+
			"Jedem Konto können Sie die Locations zuweisen, auf die es Zugriff hat.",
			"EN" : "Here you can manage user accounts for your company.<br>"+
			"For each account you can define businesses to which the account has access."
		},
		"accounts.admin.exists.company" : {
			"DE" : "Dieser Benutzer ist mit einem anderen Firmenkonto verknüpft!",
			"EN" : "This user is already assigned to another company account."
		},
		"accounts.admin.exists.user" : {
			"DE" : "Dieser Benutzer existiert bereites. Möchten Sie ihm Adminrechte für Ihre Firma gewähren?",
			"EN" : "This user exists. Do you want to assign administrative rights?"  
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
			"EN" : "Service"
		},
		"accounts.list.title.users" : {
			"DE" : "Benutzerkonten",
			"EN" : "User accounts"
		},
		"accounts.list.title.administrators" : {
			"DE" : "Administratorkonten",
			"EN" : "Administrator accounts"
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
			"EN" : "Check email address"
		},
		"accounts.create" : {
			"DE" : "Anlegen",
			"EN" : "Create"
		},
		"accounts.admin.new.email.placeholder" : {
			"DE" : "Account E-Mail",
			"EN" : "Account email address"
		},
		"accounts.admin.new.name.placeholder" : {
			"DE" : "Vor- und Nachname",
			"EN" : "First and last name"
		},
		"accounts.admin.businesses.list.title" : {
			"DE" : "Zugewiesene Locations",
			"EN" : "Assigned businesses"
		},
		"accounts.admin.businesses.list.description" : {
			"DE" : "Für hier aufgelistete Locations hat der Benutzer Administrationsrechte.<br/>Dies beinhaltet auch das Servicecockpit.",
			"EN" : "User has administrative rights for the following locations.<br/>This includes the service cockpit."
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
			"DE" : "Verfügbare Locations",
			"EN" : "Available businesses"
		},
		"accounts.all.businesses.list.description" : {
			"DE" : "Drag & drop in die Liste der zugewiesenen Locations, um dem Benutzer entsprechende Rechte zu gewähren.",
			"EN" : "Drag & drop to list of assigned businesses to grant user access."
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
			"DE" : "Für hier aufgelistete Locations hat der Benutzer Zugriffsrechte auf das Service Cockpit.",
			"EN" : "User has access to the following locations."
		},
		//activate account partial
		"account.activation.admin.title" : {
			"DE" : "Account aktivieren",
			"EN" : "Activate account"
		},
		"activation.description" : {
			"DE" :  "Hier können Sie den Servicebereichen spezifische Kategorien zuweisen.<br/>Somit können in einem \"Spa-Bereich\""+
				" andere Produkte und Dienstleistungen als auf dem \"Zimmer\" angeboten werden.",
			"EN" : "Here you can assign specific categories to your service areas.<br/>E.g. provide different services in \"spa\" than in \"room service\"."
		},
		"account.activation.admin.submit" : {
			"DE" : "Aktivieren",
			"EN" : "Activate"
		},
		"account.activation.admin.description" : {
			"DE" : "Um die Aktivierung abzuschliessen, füllen Sie bitte die fehlenden Felder aus.",
			"EN" : "To complete your account activation, please enter missing details below!"
		},		
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
		},		
		//breadcrumb
		"breadcrumb.home" : {
			"DE" : "Home",
			"EN" : "Home"
		},
		"breadcrumb.businesses" : {
			"DE" : "Locations",
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
			"DE" : "Bild auswählen...",
			"EN" : "Select image..."
		},
		"fileupload.button.crop" : {
			"DE" : "Zuschneiden",
			"EN" : "Crop image"
		},	
		"fileupload.image.label" : {
			"DE" : "Ausgewähltes Bild: ",
			"EN" : "Selected image: "
		},
		"fileupload.button.submit.saving" : {
			"DE" : "Speichere ...",
			"EN" : "Saving..."
		},
		"fileupload.image.description" : {
			"DE" : "Wählen sie eine Bilddatei zum hochladen. Überprüfen sie, dass sie nicht größer als 3Mb ist und vom Typ GIF, PNG oder JPEG.",
			"EN" : "Please select a file. Ensure the file is less than 3 MB in size and the format is GIF, PNG, or JPEG."
		},
		"fileupload.submit.error" : {
			"DE" : "Beim Hochladen ist ein Fehler aufgetreten. Überprüfen sie, dass die Datei nicht größer als 3 Mb ist und vom Typ GIF, PNG oder JPEG.",
			"EN" : "An error occurred during upload. Please check file size (< 3 MB) and format (GIF, PNG, JPEG)."
		},
		"fileupload.crop.error" : {
			"DE" : "Beim Zuschneiden ist ein Fehler aufgetreten. Überprüfen sie die Auswahl und probieren sie es noch einmal.",
			"EN" : "An error occurred while cropping image. Please check selection and try again."
		},
		"fileupload.error.size" : {
			"DE" : "Maximal erlaubte Dateigröße beträgt 3 MB.",
			"EN" : "Maximum file size is 3 MB."
		},
		"fileupload.error.type" : {
			"DE" : "Bild muss vom Typ JPEG, GIF oder PNG sein.",
			"EN" : "Image type must be JPEG, GIF, or PNG."
		},
		"propertyeditor.repeat.placeholder" : {
			"DE" : "Hier die Eingabe wiederholen",
			"EN" : "Repeat input here"
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
			"EN" :  "Login with Facebook"
		},
		"login.remember" : {
			"DE" :  "Eingeloggt bleiben",
			"EN" :  "Remember login"
		},
		"login.input.login" : {
			"DE" :  "Login",
			"EN" : "Login"
		},
		"login.input.password" : {
			"DE" :  "Passwort",
			"EN" : "password"
		},
		//loginService errors
		"login.error.cockpituser" : {
			"DE" :  "Cockpit-Benutzerkonten haben auf die Verwaltung keinen Zugriff.",
			"EN" :  "Cockpit users cannot access management options."
		},
		//passwordforgot partial
		"login.password.reset.title" : {
			"DE" :  "Passwort zurücksetzen",
			"EN" :  "Reset password"
		},
		"login.password.reset.description" : {
			"DE" :  "Bitte gebe die E-Mail Adresse Deines Accounts an.",
			"EN" :  "Enter email address you registered with your account."
		},
		"login.password.reset.complete.description" : {
			"DE" :  "Eine Nachricht mit Resetlink wurde an Deinen E-Mail Account geschickt.",
			"EN" :  "Email has been sent to your email account."
		},
		//passwordreset partial
		"passwordreset.complete" : {
			"DE" :  "Neues Passwort erfolgreich gespeichert.",
			"EN" :  "New password has been saved."
		},
		"passwordreset.description" : {
			"DE" :  "Gib ein neues Passwort ein.",
			"EN" :  "Enter a new password."
		},
		//specific error messages
		"error.account.login.exists" : {
			"DE" : "Der Benutzername existiert bereits.",
			"EN" : "User name already exists."
		},
		"error.account.email.exists" : {
			"DE" : "Die E-Mail-Adresse wird bereits benutzt.",
			"EN" : "The e-mail address is already in use."
		},
		"error.accesstoken.invalid" : {
			"DE" : "Dieser Link ist nicht mehr gültig.",
			"EN" : "This link is no longer valid."
		},
		//common error messages
		"error.404" : {
			"DE" : "Eine Ressource konnte nicht geladen werden.",
			"EN" : "Resource not available."
		},
		"error.403" : {
			"DE" : "Ungültige Zugangsdaten oder keine Zugriffsrechte.",
			"EN" : "Invalid credentials or insufficient access rights."
		},
		"error.general" : {
			"DE" : "Es gibt ein Problem mit der Verbindung zum Service.",
			"EN" : "There has been connection problem."
		},
		"common.error.footer" : {
			"DE" : "Falls dieser Fehler weiterhin besteht, konktaktieren sie <a href='mailto:support@cloobster.com'>support@cloobster.com</a>.",
			"EN" : "If this error persists, contact <a href='mailto:support@cloobster.com'>support@cloobster.com</a>."
		},
		"common.sending" : {
			"DE" :  "Sende...",
			"EN" :  "Sending..."
		},
		"common.send" : {
			"DE" :  "Sende",
			"EN" :  "Send"
		}
	};

	$provide.value("translation", map);
}]);