/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.directives = angular.module('Cloobster.directives', []);

// angular.module('Cloobster.directives', [])
Cloobster.directives.directive('simplePropertyEditor', function() {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitle: 'bind',
			editorOnSave: 'expression',
			editorProperty: 'accessor',
			editorEnabled: 'accessor'
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
				html = 
				'<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
				  '<div class="modal-header">'+
				   ' <button type="button" class="close" data-dismiss="modal">×</button>'+
				    '<h3>{{editorTitle}}</h3>'+
				 ' </div>'+
				'  <form name="simplePropertyForm" novalidate ng-submit="save()">'+
					 ' <div class="modal-body">'+
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
								' <input type="'+getEditorType(attrs)+'" name="simpleProperty" ng-model="editorValue" '+required+' '+pattern+'></input>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">Invalid:'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">This field is required!</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email">No valid email.</span>'+
								'</div>'+
							'</div>'+
					'  </div>'+
					 ' <div class="modal-footer">'+
					  '  <button type="button" class="btn" data-dismiss="modal">Close</button>'+
					'    <button type="submit" class="btn btn-primary" data-loading-text="Saving...">Save</button>'+
					'  </div>'+
					'</form>'+
				'</div>';
			
			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
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

		        	scope.getFieldInputClass = getFieldInputClass;
		        }
		      }
		}
	};

	/**
	* Checks if a type is defined in attributes object and returns it.
	* If no type is defined return text;
	* @param attr
	*	Attributes object.
	*/
	function getEditorType(attrs) {
		var type = "text";

		if(attrs && attrs.hasOwnProperty('editorType')) {
			type = attrs.editorType;
			if(type != "email" && type != "password") {
				type = "text";
			}
		}

		return type;
	}

	/*
	* Get css class for field highlighting.
	* @returns error if invalid
	*		  success if !invalid
	*         empty string otherwise
	*/
	getFieldInputClass = function(invalid) {
		if(invalid) {
			return "error";
		} else if (!invalid) {
			return "success";
		} else {
			return "";
		}
	};

	return config;
});


