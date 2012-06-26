/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.directives = angular.module('Cloobster.directives', []);

Cloobster.directives.directive('simplePropertyEditor', ['lang', function(langService) {
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
				    '<h3>{{getTitle()}}</h3>'+
				 ' </div>'+
				'  <form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					 ' <div class="modal-body">'+
					 	'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
					 		'<div class="controls">'+
					 			createFormInput(attrs)+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">Invalid:'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">This field is required!</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.pattern">No valid value.</span>'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.email">No valid email.</span>'+
								'</div>'+
							'</div>'+
					'  </div>'+
					'</div>'+
					'<div class="modal-footer">'+
						'<button type="button" class="btn" data-dismiss="modal">Close</button>'+
						'<button type="submit" class="btn btn-primary" data-loading-text="Saving...">Save</button>'+
					'</div>'+
					'</form>'+
				'</div>';
			
			element.append(html);

			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) { 
		        	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.modal');
		        	//backup original value

		        	/** Gets localized title. */
		        	scope.getTitle = function() {
		        		return langService.translate(scope.editorTitle) || scope.editorTitle;
		        	}

		        	scope.save = function () {
		        		//only save when form is valid
		        		if(scope.simplePropertyForm.$valid) {
		        			scope.editorProperty(scope.editorValue);
			        		scope.editorOnSave();
			        		dialog.modal('toggle');
		        		}
		        	}
		        	
		        	iElement.find('div.toggler').bind('click', function() {		   
		        		if(scope.editorEnabled() == true || typeof scope.editorEnabled() == 'undefined') {
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

	/**
	* Creates an html input tag based on the given configuration.
	* @param attrs
	*	Attributes object containing configuration.
	*/
	function createFormInput(attrs) {
		var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",
			pattern = attrs.hasOwnProperty('editorPattern') ? "ng-pattern='"+attrs.editorPattern+"'" : "",
			type = 	attrs.hasOwnProperty('editorType') ? attrs.editorType : "text",
			inputHtml;

		if(type == "textarea") {
			inputHtml = '<textarea rows="4" cols="100" name="simpleProperty" ng-model="editorValue" '+required+'></textarea>';
		} else {
			if(type != "email" && type != "password") {
				type = "text";
			}

			inputHtml = '<input type="'+type+'" name="simpleProperty" ng-model="editorValue" '+required+' '+pattern+'></input>';
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

Cloobster.directives.directive('simpleImageEditor',['upload', 'lang', function(uploadService, langService) {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitleKey: 'bind',
			editorOnSave: 'expression',
			editorOnCancel: 'expression',
			editorImageResource: 'accessor',
			editorImageId: 'bind',
			editorEnabled: 'accessor'
		},
		compile: function(element, attrs, transclude) {
			var html = 
				'<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
				  '<div class="modal-header">'+
				   '<button type="button" class="close" ng-click="cancel()" data-dismiss="modal">×</button>'+
				    '<h3>{{getTitle()}}</h3>'+
				 ' </div>'+
				'  <form name="simpleImageForm" novalidate ng-submit="save()" class="upload-image-form">'+
					'<div class="alert alert-error alert-block" ng-show="error">'+
						'<button  type="button" class="close" ng-click="hideError()">×</button>'+
						'<h4 class="alert-heading">Warning!</h4>'+
						'{{errorMessage}}'+
					'</div>'+
					'<div class="modal-body">'+
					 	'<span class="btn btn-success fileinput-button">'+
					 		'<i class="icon-plus icon-white"></i>'+
                    		'<span l="fileupload.button.add">Add image...</span>'+
					 		'<input type="file" name="files[]"></input>'+
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
		        		fileAdded = null,
		        		fileUploading = null,
		        		uploadObject, //returned from file upload initialization
		        		error = false,
		        		errorMessage = "";

		        	scope.$apply('fileAdded = false');
		        	scope.$apply('fileUploading = false'); 

		        	/** Gets localized title. */
		        	scope.getTitle = function() {
		        		return langService.translate(scope.editorTitleKey);
		        	}

					/** Called from upload service when upload is finished and updates U */
					scope.fileUploadedCallback = function(success, errorText) {
						var imageResource = scope.editorImageResource(),
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
								scope.$apply('fileUploading = false'); 
								dialog.modal('hide');
								submitButton.button('reset');
							});
						} else {
							fileUploading = false;
							errorMessage = langService.translate("fileupload.submit.error");
							error = true;
							scope.$digest();
							submitButton.button('reset');
						}
					}

		        	/**
		        	* Called from file upload service. Activates the save button.
		        	* @param fileName
		        	*	name of selected file
		        	*/
		        	scope.fileAddedCallback = function(fileName) {
		        		scope.$apply('fileAdded = true');
		        		fileList.html(fileName);
		        	}


		        	//backup original value
		        	scope.save = function() {		        		
		        		//disable button and set saving text
		        		submitButton.attr('data-loading-text', langService.translate("fileupload.button.submit.saving"));
		        		submitButton.button('loading');
		        		scope.$apply('fileUploading = true'); 

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
						scope.$apply("error = false");
					};

					/** Reset url and uploadFinished on show. */
					dialog.on("show", function() {
						fileAdded = false;
						fileUploading = false;
						error = false;
						errorMessage = "";
						scope.$digest();
					});
		        	
		        	iElement.find('div.toggler').bind('click', function() {		   
		        		if(scope.editorEnabled() == true) {
		        			//init file upload plugin for this dialog
	        				uploadObject = uploadService.getFileUploadObject(uploadInput, scope.editorImageResource(), scope.fileAddedCallback, scope.fileUploadedCallback);
						
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
*/
Cloobster.directives.directive('l', ['$locale', 'lang', '$interpolate', function($locale, langService,$interpolate) {
	//link function
	return function (scope, iElement, iAttrs, controller) {
		var key = iAttrs.l,
			translation,
			replacements = iAttrs.replacements,
			argsArr,
			interpolation;

		// console.log(replacements);
		// if(replacements) {
		// 	argsArr = scope.$eval('[' + replacements + ']');	
		// }
        
		if(!key) {
			return;
		}
		//if no translation is found, don't replace html, this is useful to provide default values in html
		translation = langService.translate(key) || iElement.html();

		// Interpolate the text to parse possible {{expressions}}
		interpolation = $interpolate(translation);

		// Register for changes to the interpolated translation.
		// Ensure the translated value is updated if the binding changes.
		scope.$watch(interpolation, function(newVal, oldVal) {
			// Write the inner html text.
			// newVal is the result of evaluating the interpolated expression against the scope.
			iElement.html(newVal);
		});
	}
}]);


