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
			editorEnabled: '=',
			editorValidate: '&',
			editorValidateText: '@'
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
									'<span ng-show="simplePropertyForm.simpleProperty.$error.custom" l="{{editorValidateText}}">No valid value.</span>'+
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
		        			scope.$apply('editorValue = editorProperty;editorRepeat="";saved=false');
						
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
						'<div class="modal-body">'+
							'<div class="alert alert-error alert-block" ng-show="error">'+
								'<button  type="button" class="close" ng-click="hideError()">×</button>'+
								'<h4 class="alert-heading" l="common.warning.title">Warning!</h4>'+
								'{{errorMessage}}'+
								'<p l="common.error.footer">If this error persists, contact <a href="mailto:support@cloobster.com">support@cloobster.com</a></p>'+
							'</div>'+
							'<div class="upload-area" ng-hide="selectionActive">'+
								'<p l="fileupload.image.description"> Choose a GIF, PNG or JPEG file with a size less than 3 Mb.</p>'+
							 	'<span class="btn btn-success fileinput-button">'+
							 		'<i class="icon-plus icon-white"></i>'+
		                    		'<span l="fileupload.button.add">Add image...</span>'+
							 		'<input type="file" name="files[]" accept="image/jpeg,image/png,image/gif"></input>'+
							 		'<input type="hidden" value="{{editorImageId}}">'+
						 		'</span>'+
						 		'<p ng-show="selectedFiles"><span l="fileupload.image.label">Selected file: </span><span ng-bind="selectedFiles"></span></p>'+
					 		'</div>'+
					 		'<div class="crop-area" ng-show="selectionActive">'+
					 			'<p>'+langService.translate(attrs.editorCropText)+'</p>'+
					 			'<img class="active-image" ng-src="{{activeImage.url}}"></img><br>'+
					 			'<p ng-show="imgSelection"><span l="fileupload.crop.area">Selected area:</span> {{imgSelection.width}} x {{imgSelection.height}}</p>'+
					 		'</div>'+
					 		'<p>'+
						 		'<div class="progress progress-success" ng-show="fileUploading">'+
									'<div class="bar" ng-style="barStyle"></div>'+
								'</div>'+
							'</p>'+
						'</div>'+
						'<div class="modal-footer" style="clear:both;">'+
							'<button type="button" class="btn" ng-click="cancel()" data-dismiss="modal" l="common.cancel">Close</button>'+
							'<button type="submit" ng-hide="selectionActive" ng-disabled="!fileAdded || fileUploading" class="btn btn-primary" data-loading-text="Saving..." l="common.save">Save</button>'+
							'<button type="button" class="btn btn-primary" ng-click="crop()" ng-show="selectionActive" ng-disabled="fileCropping" l="fileupload.button.crop">Crop image</button>'
						'</div>'+
					'</form>'+
				'</div>';
			
			element.append(html);
			return {
		        pre: function preLink(scope, iElement, iAttrs, controller) {	
		        },
		        post: function postLink(scope, iElement, iAttrs, controller) {
		        	var dialog = iElement.find('div.modal'),
		        		dialogBody = dialog.find('div.modal-body'),
		        		fileList = iElement.find('.selected-files'),
		        		submitButton = iElement.find("button[type=submit]"),
		        		uploadInput = iElement.find('form[name=simpleImageForm]'),
		        		imageElement = iElement.find('img.active-image'),
		        		uploadObject, //returned from file upload initialization
		        		imgAreaSelect, // holds instance of image cropping tool
		        		aspectRatio = iAttrs['editorRatio'], // get the preset ratios for image selection from the "editor-ratios" attribute.
		        		editorCropText = iAttrs['editorCropText'];

		        	/** Initialize private scope variables */
		        	function resetScope () {
						submitButton.button('reset');
						scope.fileAdded = false;
						scope.fileUploading = false;
						scope.fileCropping = false;
						scope.selectionActive = false;
						scope.activeImage = null;
						scope.barStyle= { width: '0%'};
						scope.error = false;
						scope.selectedFiles = null;
						scope.errorMessage = "";
						scope.userSaved = false;
						scope.userCancelled = false;
		        	}

		        	resetScope();

		        	/** Gets localized title. Returns key of no title was found. */
		        	scope.getTitle = function() {
		        		return langService.translate(scope.editorTitleKey) || scope.editorTitleKey;
		        	}

		        	/** Called from imgAreaSelect plugin after user selected an image area. */
		        	function selectionEnd(img, selection) {
		        		scope.imgSelection = selection;
		        		scope.$digest();
		        	}

		        	/** Called from upload service during upload progress. */
		        	function fileUploadProgressCallback(data) {
		        		scope.barStyle.width = parseInt(data.loaded / data.total * 100, 10) + '%';
		        		scope.$digest();
		        	};

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


	    					scope.activeImage = activeImage;
	    					scope.error = false;

							if(scope.userCancelled) {
		    					deleteActiveUpload();
		    					return;
	    					}


	    					if(editorCropText) {
	    						setupCropping();
	    						scope.selectionActive = true;
	    					}
	    					else {
	    						saveImageAndClose();
	    					}
		
						} else {
							
							submitButton.button('reset');
							scope.errorMessage = langService.translate("fileupload.submit.error");
							scope.error = true;
							scope.barStyle.width = '0%';
						}

						scope.fileUploading = false;
						scope.$digest();
					}

					// Register setup of imgAreaSelect plugin to trigger on load of the preview image.
					function setupCropping () {
						imageElement.on('load.areaSelect', function() {
							var ratio = null,
								d,
								width = imageElement.width(),
								height = imageElement.height();
							if(aspectRatio) {
								ratio = (d = aspectRatio.split(/:/))[0] / d[1];

								if((height * ratio) > width) {
									height = width / ratio;
								}
								else {
									width = height * ratio;
								}
							}

    						imgAreaSelect = imageElement.imgAreaSelect({
	    						handles:true,
	    						enable:true,
	    						show:true,
	    						onSelectEnd: selectionEnd,
	    						parent: dialog,
	    						instance: true,
	    						aspectRatio: aspectRatio,
	    						persistent: true,
	    						x1: 0,
	    						y1: 0,
	    						x2: width,
	    						y2: height
	    					});
						});
					}

					function disableCropping() {
						imageElement.off('load.areaSelect');

						if(imgAreaSelect) {
							imgAreaSelect.setOptions({disable: true, hide:true});
						}
					}
		        	/**
		        	* Called from file upload service. Activates the save button.
		        	* @param fileName
		        	*	name of selected file
		        	*/
		        	function fileAddedCallback (fileName) {
		        		scope.selectedFiles = fileName;
		        		scope.fileAdded = true;		        
		        		scope.$digest();
		        		
		        	}

		        	/** Delete the last uploaded image on the server. */
		        	function deleteActiveUpload() {
		        		if(scope.activeImage) {
		        			uploadService.deleteUpload(scope.activeImage.blobKey);
		        			scope.activeImage = null;	
		        		}		      
		        	}

		        	/** Save the uploaded image as the new image for this business. */
		        	function saveImageAndClose() {
		        		var activeImage = scope.activeImage;		        		
		        		activeImage.$save(function() {
		        				scope.barStyle.width = '100%';
		        				scope.editorOnSave({ "image" : activeImage});
				        		dialog.modal('hide');
							});
		        	};

		        	/*
		        	* Send crop request to server and save image after success.
		        	*/
		        	scope.crop = function() {
						var selection = imgAreaSelect.getSelection(),
	        				imgWidth = imageElement.width(),
	        				imgHeight = imageElement.height();
	        			
						disableCropping();
						scope.userSaved = true;

						scope.barStyle.width = '0%';
	        			scope.fileCropping = true;

	        			uploadService.requestImageCrop(scope.activeImage.blobKey,
	        				selection.x1 / imgWidth,
	        				selection.y1 / imgHeight,
	        				selection.x2 / imgWidth,
	        				selection.y2 / imgHeight
	        				).success(function(imageData) {
	        					scope.barStyle.width = '50%';
	        					scope.fileCropping = false;
	        					scope.error = false;
	        					if(scope.userCancelled) {
	        						deleteActiveUpload();
	        						return;
	        					}
	        					
	        					scope.activeImage.url = imageData.url;
	        					scope.activeImage.blobKey = imageData.blobKey;
	        					saveImageAndClose();
		        			}).error(function() {
		        				scope.fileCropping = false;
		        				scope.barStyle.width = '0%';
		        				scope.errorMessage = langService.translate("fileupload.crop.error");
		        				scope.error = true;

		        				if(scope.userCancelled) {
	        						deleteActiveUpload();
	        					}
		        			});
		        	};

		        	/** Save button click handler. */
		        	scope.save = function() {
		        		//disable button and set saving text
		        		if(!editorCropText) {
		        			scope.userSaved = true;
		        		}
		        		if(!scope.selectionActive || scope.fileUploading) {
			        		submitButton.attr('data-loading-text', langService.translate("fileupload.button.submit.saving"));
			        		submitButton.button('loading');
			        		scope.fileUploading = true;			        		
			        		uploadObject.upload();
		        		}
		        	}

		        	/** Cancel button click handler */
		        	scope.cancel = function() {
		        		scope.userCancelled = true;
		        		deleteActiveUpload();
		        	}

		        	/**
					* Set error message to empty string and hide the error box.
					*/
					scope.hideError = function() {
						scope.error = false;
					};

					/** Reset private scope variables. */
					dialog.on("show", function() {
						resetScope();
						scope.$digest();
					});

					dialog.on("hide", function() {
						disableCropping();

						if(!scope.userCropped && !scope.userSaved) {
							deleteActiveUpload();
						}
					});
		        	
		        	iElement.find('div.toggler').bind('click', function() {
		        		if(scope.editorEnabled === true || typeof scope.editorEnabled == "undefined") {
		        			//init file upload plugin for this dialog
	        				uploadObject = uploadService.getFileUploadObject(uploadInput, scope.editorImageResource, fileAddedCallback, fileUploadedCallback, fileUploadProgressCallback);

							if(editorCropText) {
								dialogBody.css('height',function () { 
								    	return ($(window).height() * .8) + 'px';
								    });

								dialogBody.css('max-height', function() { return $(this).height()});
								// Expand the dialog to 80% width and 80% height of window.								

								dialog.css({
						    		'width': '80%',
								    // 'height': function () { 
								    // 	return ($(window).height() * .8) + 'px';
								    // },								    
								    'margin-left': function () { 
								    	return -($(this).width() / 2); 
								   	},
								   	'margin-top': function () { 
								    	return -($(this).height() / 2); 
								   	}
								});
								
							}
							dialog.modal('show');
		        		}
					});

		        }
		      }
		}
	};
	return config;
}]);

Cloobster.directives.directive('richtextPropertyEditor', ['lang','$timeout', function(langService,$timeout) {
	var inputType, //type of the input to generate in form
		required, //if present marks a required field
		//directive configuration
		config = {
		restrict: 'A',
		replace: false,
		transclude: true,
		scope: {
			editorTitle: '@',
			editorOnSave: '&',
			editorProperty: '=',
			editorEnabled: '=',
			editorValidate: '&',
			editorValidateText: '@'
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",				
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
					 			'<textarea style="float:left;" rows="10" cols="250" ng-model="editorValue"></textarea>'+
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
		        		input = iElement.find('input.property-input, textarea.property-input'),
		        		editorTextarea = iElement.find('textarea'),
		        		ctrl = scope.simplePropertyForm.simpleProperty,
		        		editor;

		        	//init raptor editor
		        	// if(!$('#richtext-edit').ckeditorGet()) {
		        	
		        	editor = editorTextarea.ckeditor(function() {
		        		//callback
		        	}, {
		        		//config
		        		toolbar: [
							// { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
							// { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
							// { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
							// { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
						 //        'HiddenField' ] },
							// '/',
							{ name: 'basicstyles', items : [ 'Bold','Italic','Underline', 'RemoveFormat' ] },
							{ name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent',
							'-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
							// { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
							// { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
							// '/',
							{ name: 'styles', items : [ 'Format'] },
							// { name: 'colors', items : [ 'TextColor','BGColor' ] },
							// { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
						]
		        	});
					// } else {
					// 	editor = $('#richtext-edit').ckeditorGet();
					// }

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
		        			//grab the value of richtext editor
		        			scope.editorProperty = editor.val();
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
		        			scope.$apply('editorValue = editorProperty;editorRepeat="";saved=false');
						
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
