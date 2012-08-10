/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.directives = angular.module('Cloobster.directives', []);

Cloobster.directives.directive('simplePropertyEditor', ['lang','$timeout', function(langService,$timeout) {
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
			editorEnabled: '='
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
				pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
				html = 
				'<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
				  '<div class="modal-header">'+
				   ' <button type="button" class="close" data-dismiss="modal">×</button>'+
				    '<h3 l="{{editorTitle}}">Edit property</h3>'+
				 '</div>'+
				'<form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					'<div class="modal-body">'+
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
					 			createFormInput(attrs)+
					 			'<i class="icon-remove icon-black" ng-click="clearInput()"></i>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.number">'+ l('propertyeditor.error.number') +'</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern" l="{{editorPatternText}}">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email" >+'+ l('propertyeditor.error.email')+'</span>'+									
								'</div>'+
							'</div>'+
						'</div>'+
						createRepeatInput(attrs)+
					'</div>'+
					'<div class="modal-footer">'+
						'<button type="button" class="btn" data-dismiss="modal">'+l('common.cancel')+'</button>'+
						'<button type="submit" class="btn btn-primary" ng-disabled="simplePropertyForm.$invalid">'+l('common.save')+'</button>'+
					'</div>'+
					'</form>'+
				'</div>';
			
			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.modal'),
		        		input = iElement.find('input.property-input, textarea.property-input');

		        	scope.save = function () {
		        		//only save when form is valid
		        		if(scope.simplePropertyForm.$valid) {
		        			scope.editorProperty = scope.editorValue;
		        			// Wrap this in a timeout, because the model change is not immediate.
			        		$timeout(scope.editorOnSave);
			        		dialog.modal('toggle');
		        		}
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
		        			scope.$apply('editorValue = editorProperty;editorRepeat=""');
						
							dialog.modal('toggle');	
							input.trigger("focus");
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
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputHtml;

		if(type == "textarea") {
			inputHtml = '<textarea class="property-input" rows="4" cols="100" name="simpleProperty" ng-model="editorValue"' + maxLength +' '+required+' '+pattern+'></textarea>';
		} else {
			if(type != "email" && type != "password" && type != "number") {
				type = "text";
			}

			inputHtml = '<input class="property-input" type="'+type+'" name="simpleProperty" ng-model="editorValue"' + maxLength +' '+required+' '+pattern+' '+repeat+'></input>';
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

Cloobster.directives.directive('simpleImageEditor',['upload', 'lang','$log', function(uploadService, langService, $log) {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitleKey: '@',
			editorOnSave: '&',
			editorOnCancel: '&',
			editorImageResource: '=',
			editorImageId: '@',
			editorEnabled: '='
		},
		compile: function(element, attrs, transclude) {
			var html = '<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
					'<div class="modal-header">'+
				  		'<button type="button" class="close" ng-click="cancel()" data-dismiss="modal">×</button>'+
				   		'<h3>{{getTitle()}}</h3>'+
					'</div>'+
					'<form name="simpleImageForm" novalidate ng-submit="save()" class="upload-image-form">'+
						'<div class="alert alert-error alert-block" ng-show="error">'+
							'<button  type="button" class="close" ng-click="hideError()">×</button>'+
							'<h4 class="alert-heading">Warning!</h4>'+
							'{{errorMessage}}'+
						'</div>'+
						'<div class="modal-body">'+
						 	'<span class="btn btn-success fileinput-button">'+
						 		'<i class="icon-plus icon-white"></i>'+
	                    		'<span l="fileupload.button.add">Add image...</span>'+
						 		'<input type="file" name="files[]" accept="image/jpeg,image/png,image/gif"></input>'+
					 		'</span>'+
					 		'<span l="fileupload.image.label">Selected file: </span><span class="selected-files"></span>'+
						'</div>'+
						'<div class="modal-footer" style="clear:both;">'+
							'<button type="button" class="btn" ng-click="cancel()" data-dismiss="modal" l="common.cancel">Close</button>'+
							'<button type="submit" ng-disabled="!fileAdded || fileUploading" class="btn btn-primary" data-loading-text="Saving..." l="common.save">Save</button>'+
						'</div>'+
					'</form>'+
				'</div>';
			
			element.append(html);
			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.modal'),
		        		fileList = iElement.find('.selected-files'),
		        		submitButton = iElement.find("button[type=submit]"),
		        		uploadInput = iElement.find('form[name=simpleImageForm]'),
		        		uploadObject; //returned from file upload initialization

		        	// Initialize private scope variables.
		        	scope.error = false,
		        	scope.errorMessage = "";

		        	scope.fileAdded = false;
		        	scope.fileUploading = false;

		        	/** Gets localized title. */
		        	scope.getTitle = function() {
		        		return langService.translate(scope.editorTitleKey);
		        	}

					/** Called from upload service when upload is finished and updates U */
					function fileUploadedCallback(success, errorText) {
						var imageResource = scope.editorImageResource,
							imageUrl = imageResource.url,
							activeImage = null;


						if(success) {

			        		activeImage = new imageResource({
			    				id: scope.editorImageId,
			    				blobKey: imageResource.blobKey,
			    				url: imageResource.url
	    					});

			        		activeImage.$save(function() {
								scope.editorOnSave({ "image" : activeImage});
								scope.fileUploading = false;
								submitButton.button('reset');
								dialog.modal('hide');								
							});
						} else {
							scope.fileUploading = false;
							submitButton.button('reset');
							scope.errorMessage = langService.translate("fileupload.submit.error");
							scope.error = true;
							scope.$digest();
						}
					}

		        	/**
		        	* Called from file upload service. Activates the save button.
		        	* @param fileName
		        	*	name of selected file
		        	*/
		        	function fileAddedCallback (fileName) {
		        		scope.$apply('fileAdded = true');
		        		fileList.html(fileName);
		        	}


		        	//backup original value
		        	scope.save = function() {		        		
		        		//disable button and set saving text
		        		submitButton.attr('data-loading-text', langService.translate("fileupload.button.submit.saving"));
		        		submitButton.button('loading');
		        		scope.fileUploading = true;

		        		uploadObject.upload();
		        	}		        	

		        	scope.cancel = function() {
		        		//TODO not needed because we don't upload files automatically
		        		// if(scope.editorImageResource() && scope.editorImageResource().blobKey) {
		        		// 	scope.editorOnCancel({ 
		        		// 	"image" : {
		        		// 		"blobKey" : scope.editorImageResource().blobKey
		        		// 	}
		        		// });
		        		// }
		        	}

		        	/**
					* Set error message to empty string and hide the error box.
					*/
					scope.hideError = function() {
						scope.error = false;
					};

					/** Reset url and uploadFinished on show. */
					dialog.on("show", function() {
						scope.fileAdded = false;
						scope.fileUploading = false;
						scope.error = false;
						scope.errorMessage = "";
						scope.$digest();
					});
		        	
		        	iElement.find('div.toggler').bind('click', function() {		   
		        		if(scope.editorEnabled == true) {
		        			//init file upload plugin for this dialog
	        				uploadObject = uploadService.getFileUploadObject(uploadInput, scope.editorImageResource, fileAddedCallback, fileUploadedCallback);
						
							dialog.modal('show');	
		        		}
					});

		        }
		      }
		}
	};
	return config;
}]);

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
* Used to display a Bootstrap tooltip which gets localized.
* http://twitter.github.com/bootstrap/javascript.html#tooltips
*/
Cloobster.directives.directive('showRole', ['login', function(login) {
	return function(scope, iElement, iAttrs, controller) {
		var role = iAttrs.showRole,
			account = login.getAccount();

		if(!role) {
			return;
		}

		function checkForRole() {
			iElement.css('display', ( login.getAccount()['role'] === role ) ? '' : 'none');
		}

		scope.$watch('loggedIn', function(newVal, oldVal) {
			checkForRole();
		});
	};
}]);
