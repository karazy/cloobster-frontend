/** @module CloobsterAdmin/Directives */

/**
*	@name CloobsterAdmin.Directives
*	Module of all custom CloobsterAdmin services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
CloobsterAdmin.directives = angular.module('CloobsterAdmin.directives', []);

CloobsterAdmin.directives.directive('simplePropertyEditor', ['lang','$timeout', '$log', function(langService,$timeout, $log) {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitle: '@',
			editorPatternText: '@',
			editorOnSave: '&',
			editorProperty: '=',
			editorEnabled: '=',
			editorValidate: '&',
			editorValidateText: '@',
			editorPlaceholder: '@'
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
				html = 
				'<div class="toggler" ng-transclude></div>'+
				'<div class="simple-property-editor-mask"></div>'+			
				'<div class="simple-property-editor" style="display:none; position:absolute; background-color:white;">'+
				'<h5 class="editor-title" l="{{editorTitle}}" l-force-override="true">Edit property</h5>'+
				'<form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					'<div class="">'+
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
					 			createFormInput(attrs)+
					 			'<i class="icon-remove icon-black" ng-click="clearInput()"></i>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.number">'+ l('propertyeditor.error.number') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email" >+'+ l('propertyeditor.error.email')+'</span>'+									
								'</div>'+
							'</div>'+
						'</div>'+
						createRepeatInput(attrs)+
					'</div>'+
					'<div class="row-fluid">'+
						'<button type="button" ng-click="closeDialog()" class="btn span6" data-dismiss="modal">'+l('common.cancel')+'</button>'+
						'<button type="submit" class="btn btn-primary span6" ng-disabled="simplePropertyForm.$invalid">'+l('common.save')+'</button>'+
					'</div>'+
					'</form>'+
				'</div>';
			
			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.simple-property-editor'),
		        		mask = iElement.find('div.simple-property-editor-mask'),
		        		input = iElement.find('input.property-input, textarea.property-input'),
		        		ctrl = scope.simplePropertyForm.simpleProperty;

		        	if(iAttrs.hasOwnProperty('editorValidate')) {
		        		ctrl.$parsers.push(function(value) {
			        		if(scope.editorValidate) {
			        			if(scope.editorValidate({'value' : value})) {
			        				ctrl.$setValidity('custom', true);
			        				return value;
			        			}
			        			else {
			        				ctrl.$setValidity('custom', false);
			        				return undefined;
			        			}	
			        		}
			        	});	
		        	}
		        	
		        	scope.save = function () {
		        		//only save when form is valid
		        		if(scope.simplePropertyForm.$valid && !scope.saved) {
		        			scope.saved = true;
		        			scope.editorProperty = scope.editorValue;
		        			// Wrap this in a timeout, because the model change is not immediate.
			        		$timeout(scope.editorOnSave);
			        		// dialog.modal('toggle');

			        		mask.hide();
		        			dialog.hide();
		        		}
		        	}

		        	scope.closeDialog = function() {
		        		mask.hide();
		        		dialog.hide();
		        	}

		        	/**
		        	* Convenience method to clear the input field.
		        	*/
		        	scope.clearInput = function() {
		        		scope.editorValue = "";
		        		if(scope['editorRepeat']) {
		        			scope['editorRepeat'] = "";
		        		}
		        		input.trigger("focus");
		        	}

		        	scope.matchInput = function() {
						if(scope.simplePropertyForm.simpleProperty.$viewValue !== scope.simplePropertyForm.repeatProperty.$viewValue) {
							scope.simplePropertyForm.repeatProperty.$setValidity("match", false);
						} else {
							scope.simplePropertyForm.repeatProperty.$setValidity("match", true);
						}
					}
		        	
		        	iElement.find('div.toggler').bind('click', function() {   
		        		if(scope.editorEnabled == true || typeof scope.editorEnabled == 'undefined') {
		        			scope.$apply('editorValue = editorProperty;editorRepeat="";saved=false');
		        			// dialog.modal('toggle');
		        			var titleHeight,  
		        				offsetTop, 
		        				maskHeight, 
		        				maskWidth,
		        				dataElementValue,
		        				dataElementValueLeft;
		        			
		        			offsetTop = iElement.find('div.toggler').offset().top - iElement.find('div.toggler').offsetParent().offset().top;
		        			titleHeight = iElement.find('h5.editor-title').css('lineHeight');
		        			titleHeight = titleHeight.replace('px','');
		        			dataElementValue = iElement.find('div.value');

		        			maskHeight = $(document).height();
        					maskWidth = $(window).width();
		        			 //Set height and width to mask to fill up the whole screen
        					mask.css({'width':maskWidth,'height':maskHeight}); 
        					mask.show();

        					//if editor is used on a data-element use value div to calculate left!
        					//TODO 14.12.2012 this should be optimized to avoid dependencies to html
        					//maybe make it configurable.
        					try {
        						if(dataElementValue && dataElementValue.length == 1) {
        							dataElementValueLeft = dataElementValue.offset().left - dataElementValue.offsetParent().offset().left;
        							dialog.css('left', dataElementValueLeft);
        						}	
        					} catch(e) {
        						$log.error('simplePropertyEditor: failed to calculate left');
        					}
        					

		        			dialog.css('top', offsetTop - titleHeight - 25);
		        			dialog.show();

		        			input.trigger("focus");
		        		}
					});

					mask.bind('click', function() {
						scope.closeDialog();
					});

					dialog.bind('keyup', function(event) {
						//hide dialog on escape
						if(event.which == 27) {
							scope.closeDialog();	
						}						
					});

		        	scope.getFieldInputClass = getFieldInputClass;		        	

		        }
		      }
		}
	};

	function l(key) {
		return langService.translate(key) || key;
	}

	/**
	* Creates a form input control group for repeated input.
	* @param attrs
	*	Attributes object containing configuration.
	*/
	function createRepeatInput(attrs) {
		var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
			repeat = attrs.hasOwnProperty('editorRepeat'),
			pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputHtml;
		
		if(!repeat)
			return '';

		if(type == "textarea") {
			inputHtml = '';
		} else {
			if(type != "email" && type != "password" && type != "number") {
				type = "text";
			}

			inputHtml = '<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.repeatProperty.$invalid)">'+
		 		'<div class="controls">'+
		 			'<input type="'+type+'" name="repeatProperty" ng-model="editorRepeat" l-attribute="placeholder" l="propertyeditor.repeat.placeholder" required ng-change="matchInput()"></input>'+
					'<div class="help-inline" ng-show="simplePropertyForm.repeatProperty.$dirty && simplePropertyForm.repeatProperty.$invalid">'+
						'<span ng-show="simplePropertyForm.repeatProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
						'<span ng-show="simplePropertyForm.repeatProperty.$error.match">'+ l('propertyeditor.error.match') +'</span>'+
					'</div>'+
				'</div>'+
			'</div>';
		}

		return inputHtml;
	}

	/**
	* Creates an html input tag based on the given configuration.
	* @param attrs
	*	Attributes object containing configuration.
	*/
	function createFormInput(attrs) {
		var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
			pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
			repeat = attrs.hasOwnProperty('editorRepeat') ? "ng-change='matchInput()'" : "",
			maxLength = attrs.hasOwnProperty('editorMaxLength') ? "maxlength='"+attrs.editorMaxLength+"'" : "",
			placeholder = attrs.hasOwnProperty('editorPlaceholder') ? "placeholder='"+l(attrs.editorPlaceholder)+"'" : "",
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputHtml;

		if(type == "textarea") {
			inputHtml = '<textarea class="property-input" rows="4" cols="100" name="simpleProperty" ng-model="editorValue"' + maxLength +' '+required+' '+pattern+' '+placeholder+'></textarea>';
		} else {
			if(type != "email" && type != "password" && type != "number") {
				type = "text";
			}

			inputHtml = '<input class="property-input" type="'+type+'" '+placeholder+' name="simpleProperty" ng-model="editorValue"' + maxLength +' '+required+' '+pattern+' '+repeat+'></input>';
		}

		return inputHtml;
	}

	/*
	* Get css class for field highlighting.
	* 
	* @param {boolean}  
	* @returns error if invalid
	*		  success if !invalid
	*         empty string otherwise
	*/
	function getFieldInputClass(invalid) {
		if(invalid) {
			return "error";
		} else if (!invalid) {
			return "success";
		} else {
			return "";
		}
	};

	return config;
}]);


/**
* Used to translate UI texts.
* Usage: l="languageKey"
* (optional) l-attribute: if specified translates an attribute instead of html content
*/
CloobsterAdmin.directives.directive('l', ['$locale', 'lang', '$interpolate', function($locale, langService,$interpolate) {


	//link function
	return function (scope, iElement, iAttrs, controller) {
		var key = iAttrs.l,
			//attribute whos value to translate, if nothing provided html content is replaced
			replaceAttr = iAttrs.lAttribute,
			forceOverride = iAttrs.lForceOverride,
			translation,
			interpolation,
			oldWatch;

		function watchTranslation(value) {
			if(!value) {
				return;
			}

			//if no translation is found, don't replace html, this is useful to provide default values in html
			translation = langService.translate(value);// || (replaceAttr ? iAttrs[replaceAttr]  : iElement.html());

			if(!translation) {
				if(replaceAttr) {
					translation = iAttrs[replaceAttr]
				} else if(forceOverride) {
					translation = value
				} else {
					translation = iElement.html();
				}
			}

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
CloobsterAdmin.directives.directive('tooltip', ['$locale', 'lang', function($locale, langService) {
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