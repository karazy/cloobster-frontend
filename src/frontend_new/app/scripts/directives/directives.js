/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.directives = angular.module('Cloobster.directives', []);


/**
* Used to translate UI texts.
* Usage: l="languageKey"
* (optional) l-attribute: if specified translates an attribute instead of html content
*/
Cloobster.directives.directive('l', ['$locale', 'lang', '$interpolate', function($locale, langService,$interpolate) {


	//link function
	return function (scope, iElement, iAttrs, controller) {
		var key = iAttrs.l,
			//attribute whos value to translate, if nothing provided html content is replaced
			replaceAttr = iAttrs.lAttribute,
			translation,
			interpolation,
			oldWatch;

		function watchTranslation(value) {
			if(!value) {
				return;
			}

			//if no translation is found, don't replace html, this is useful to provide default values in html
			translation = langService.translate(value) || (replaceAttr ? iAttrs[replaceAttr]  :iElement.html());

			// Interpolate the text to parse possible {{expressions}}
			interpolation = $interpolate(translation);

			// Deregister a possible previous watcher.
			(oldWatch || angular.noop)();

			// Register for changes to the interpolated translation.
			// Ensure the translated value is updated if the binding changes.
			// The return value is a deregister function and will be saved for later.
			oldWatch = scope.$watch(interpolation, function(newVal, oldVal) {
				// Write the inner html text.
				// newVal is the result of evaluating the interpolated expression against the scope.
				if(!replaceAttr) {
					iElement.html(newVal);	
				} else {
					iElement.attr(replaceAttr, newVal);
				}
				
			});
		}

		iAttrs.$observe('l', watchTranslation);
		watchTranslation(key);
	}
}]);

/**
* Used to display a Bootstrap tooltip which gets localized.
* http://twitter.github.com/bootstrap/javascript.html#tooltips
*/
Cloobster.directives.directive('tooltip', ['$locale', 'lang', function($locale, langService) {
	return function(scope, iElement, iAttrs, controller) {
		var key = iAttrs.tooltip,
			//position of the tooltip
			position = iAttrs.tooltipPosition || "top",
			translation;

		if(!key) {
			return;
		}

		//if no translation is found, don't replace html, this is useful to provide default values in html
		translation = langService.translate(key) || key;

		if(translation) {
			iElement.tooltip({
				"title" : translation,
				"placement" : position
			});
		}

	};
}]);

/**
*
*/
Cloobster.directives.directive('showRole', ['login', function(login) {
	return function(scope, iElement, iAttrs, controller) {
		var role = iAttrs.showRole,
			account = login.getAccount();

		if(!role) {
			return;
		}

		scope.$watch('loggedIn', function(newVal, oldVal) {
			
			if(!(login.getAccount()['role'] === role)) {
				iElement.css('display', 'none');
			}
		});
	};
}]);
