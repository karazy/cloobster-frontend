/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
// Cloobster.directives = angular.module('Cloobster.directives', []);

angular.module('Cloobster.directives', []).directive('simplePropertyEditor', function() {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		// template: 
		// 	'<div class="modal hide">'+
		// 	  '<div class="modal-header">'+
		// 	   ' <button type="button" class="close" data-dismiss="modal">×</button>'+
		// 	    '<h3>{{editorTitle}}</h3>'+
		// 	 ' </div>'+
		// 	'  <form name="simplePropertyForm" novalidate ng-submit="editorOnSave()">'+
		// 		 ' <div class="modal-body">'+
		// 		   ' <input type="text" name="simpleProperty" value="{{editorValue}}"></input>'+
		// 		'  </div>'+
		// 		 ' <div class="modal-footer">'+
		// 		  '  <button type="button" class="btn" data-dismiss="modal">Close</button>'+
		// 		'    <button type="submit" class="btn btn-primary" data-loading-text="Saving...">Save</button>'+
		// 		'  </div>'+
		// 		'</form>'+
		// 	'</div>',
		scope: {
			editorTitle: 'bind',
			editorOnSave: 'expression',
			editorProperty: 'accessor',
			editorEnabled: 'accessor'
			//editorOnCancel: 'expression',
		},
		link: function(scope, element, attrs) {
			var modal = jQuery(this).find('div.modal'),
				clickFunction = null,
				ele = element[0];
				console.log('link');
			clickFunction = function(evtObj) {
				jQuery(this).find('div.modal').modal('toggle');
				// jQuery(this).find('div.modal').on('hide', function() {
				// 	jQuery(ele).one('click',clickFunction);
				// 	console.log('on hide');
				// });
			};

			jQuery('#test123').on('click',clickFunction);

			
		},
		compile: function(element, attrs, transclude) {
			var value = attrs.editorValue || "",
				title = attrs.editorTitle || "",
				onSave = attrs.editorOnSave,
				required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				html = 
				'<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
				  '<div class="modal-header">'+
				   ' <button type="button" class="close" data-dismiss="modal">×</button>'+
				    '<h3>{{editorTitle}}</h3>'+
				 ' </div>'+
				'  <form name="simplePropertyForm" novalidate ng-submit="save()">'+
					 ' <div class="modal-body">'+
					   ' <input type="text" name="simpleProperty" ng-model="editorValue" '+required+'></input>'+
					'  </div>'+
					 ' <div class="modal-footer">'+
					  '  <button type="button" class="btn" data-dismiss="modal">Close</button>'+
					'    <button type="submit" class="btn btn-primary" data-loading-text="Saving...">Save</button>'+
					'  </div>'+
					'</form>'+
				'</div>';

			// jQuery(element).append("<span>{{editorValue}}</span>");

			element.append(html);		

			// jQuery(element).on('click', function() {
			// 	jQuery('#modal').modal('toggle');
			// });
			
			//TODO restore value on close
		

			// jQuery(element[0]).click(function(){
			//   jQuery('#modal').modal('toggle');
			// }).children().click(function(e) {
			//   return false;
			// });

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	console.log('preLink');
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.modal');
		        	//backup original value

		        	scope.save = function () {
		        		scope.editorProperty(scope.editorValue);
		        		scope.editorOnSave();
		        		dialog.modal('toggle');
		        	}
		        	
		        	iElement.find('div.toggler').bind('click', function() {		   
		        		if(scope.editorEnabled() == true) {
		        			scope.$apply('editorValue = editorProperty()');
						
							dialog.modal('toggle');	
		        		}
					});
		        }
		      }
		}
	};


	return config;

	function toggleDialog() {

	}

});




// angular.module('formComponents', [])
//   .directive('formInput', function() {
//     return {
//         restrict: 'E',
//         compile: function(element, attrs)
//         {
//             var type = attrs.type || 'text';
//             var required = attrs.hasOwnProperty('required') ? "required='required'" : "";
//             var htmlText = '<div class="control-group">' +
//                 '<label class="control-label" for="' + attrs.formId + '">' + attrs.label + '</label>' +
//                     '<div class="controls">' +
//                     '<input type="' + type + '" class="input-xlarge" id="' + attrs.formId + '" name="' + attrs.formId + '" ' + required + '>' +
//                     '</div>' +
//                 '</div>';
//             element.replaceWith(htmlText);
//         }
//     }
// })



