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
				"placement" : position,
				"trigger" : "hover focus"
			});
		}

	};
}]);