/**
* An on/off switch based on https://github.com/nostalgiaz/bootstrap-switch and wrapped in a directive.
*/
Cloobster.directives.directive('switchButton', ['lang', '$log', function(langService, $log) {
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
		compile: function(element, attrs, transclude) {
			var html;

			html = 
			'<div style="width: 250px; margin-right: 10px; float:left;">'+
				'<div class="switch switch-small" data-on="primary" data-off="danger">'+
				    '<input type="checkbox" ng-model="switchButton"/>'+
				'</div> <span l="{{switchLabelKey}}"></span>'+
			'</div>';

			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.simple-confirm-dialog');

		        	iElement.find('.switch').bootstrapSwitch();
		        	iElement.find('.switch').on('switch-change', function (e, data) {
				        scope.switchButton = data.value;
				        scope.onSwitch();
					}); 

					scope.$watch('switchButton', function(newVal, oldVal) {
						iElement.find('.switch').bootstrapSwitch('setState', newVal);
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