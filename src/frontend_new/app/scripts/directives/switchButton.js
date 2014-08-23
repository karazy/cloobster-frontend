/**
* An on/off switch based on https://github.com/nostalgiaz/bootstrap-switch and wrapped in a directive.
*/
Cloobster.directives.directive('switchButton', ['lang', '$log', '$timeout', function(langService, $log, $timeout) {
	var //directive configuration
		config = {
		restrict: 'A',
		replace: true,
		transclude: false,
		priority: 100,
		scope: {
			switchButton: '=',
			switchLabelKey: '@',
			onSwitch: '&'
		},
		template: function(element, attrs) {
			var html;

			html = 
			'<div style="margin-right: 10px; float:left;">'+
				    '<input type="checkbox" /><span style="margin-left:5px;" l="{{switchLabelKey}}"></span>'+
			'</div>';

			return html;
		},
		compile: function(element, attrs, transclude) {

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var switchEle = iElement.find('[type=checkbox]');

		        	switchEle.bootstrapSwitch();
		        	switchEle.on('switchChange.bootstrapSwitch', function (e, state) {
				        scope.switchButton = state;
				        scope.$digest();
				        $timeout(scope.onSwitch);
					}); 

					scope.$watch('switchButton', function(newVal, oldVal) {
						// switchEle.data('animated', false);
						switchEle.bootstrapSwitch('state', newVal, true);
						// switchEle.data('animated', true);
					});

		        }
		      }
		}
	};

	function l(key) {
		return langService.translate(key) || key;
	}

	return config;
}]);