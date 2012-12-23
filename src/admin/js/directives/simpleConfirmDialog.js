CloobsterAdmin.directives.directive('simpleConfirmDialog', ['lang', '$log', function(langService, $log) {
	var //directive configuration
		config = {
		restrict: 'A',
		replace: true,
		transclude: true,
		priority: 100,
		scope: {
			dialogTitle: '@',
			dialogText: '@',
			dialogOnConfirm: '&',
			dialogConfirmButton: '@',
			dialogDisabled: '='
		},
		compile: function(element, attrs, transclude) {
			var html;

			html = 
			'<span class="toggler" ng-transclude></span>'+
			'<div class="modal hide confirm-modal">'+
			 	'<div class="modal-header">'+
				    	'<button type="button" class="close" data-dismiss="modal">×</button>'+
				    	'<h4 l="{{dialogTitle}}">Confirm dialog</h4>'+
				'</div>'+
				'<div class="modal-body alert-info">'+
				    	'<p l="{{dialogText}}"></p>'+
			   '</div>  '+
				'<div class="modal-footer">'+
				  		'<button type="button" class="btn" data-dismiss="modal" l="common.cancel">Cancel</button>'+
				    	'<button type="button" class="btn btn-primary" data-dismiss="modal" ng-click="confirm()" l="{{dialogConfirmButton}}">Confirm</button>'+
				'</div>'
			'</div>';

			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('.simple-confirm-dialog');
	
		        	scope.confirm = function () {
		        		scope.dialogOnConfirm();
		        		dialog.modal('toggle');
		        	}

		        	
		        	iElement.find('.toggler').bind('click', function() { 
		        		var modal;
		        		if(!scope.dialogDisabled) {
		        			modal = iElement.find(".confirm-modal");
		        			modal.modal('toggle');	
		        		}		        		
		        		
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