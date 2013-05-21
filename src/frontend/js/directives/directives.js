/** @module Cloobster/Directives */

/**
*	@name Cloobster.Directives
*	Module of all custom Cloobster services.
*	Other modules can depend on this, and resolve service instances
*	with angulars depency injection.
*/
Cloobster.directives = angular.module('Cloobster.directives', []);

Cloobster.directives.directive('simpleImageEditor',['upload', 'lang','$log','$interpolate',function(uploadService, langService, $log, $interpolate) {
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
			editorOnDelete: '&',
			editorImageResource: '=',
			editorImageId: '@',
			editorMinWidth: '@',
			editorMinHeight: '@',
			simpleImageEditor: '=',
			editorEnabled: '='
		},
		compile: function(element, attrs, transclude) {
			var html = '<div class="toggler" ng-transclude></div>'+
				'<div class="modal hide">'+
					'<div class="modal-header">'+
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
								'<p l="fileupload.image.description"> Choose a GIF, PNG or JPEG file with a size less than 3 Mb.</p>';
						 		if(attrs['editorMinWidth'] || attrs['editorMinHeight']) {
						 			html+= '<p><span l="fileupload.dimensions.description"></span>{{editorMinWidth || "*"}} x {{editorMinHeight || "*"}}</p>';
						 		}

						 		html +='<p ng-show="selectedFiles"><span l="fileupload.image.label">Selected file: </span><span ng-bind="selectedFiles"></span></p>'+
						 		'<p ng-show="fileUploading || fileSaving"> '+
						 			'<img src="img/ajax-loader.gif" style="margin-right: 5px;"></img>'+
						 			'<span ng-show="fileSaving">'+langService.translate('fileupload.button.submit.saving')+'</span>'+
						 			'<span ng-show="fileUploading">'+langService.translate('fileupload.uploading')+'</span>'+
						 		'</p>'+
						 		'<div class="progress progress-success" ng-show="fileUploading">'+
									'<div class="bar" ng-style="barStyle"></div>'+
								'</div>'+
						 		'<img ng-src="{{imageUrl}}" style="max-width: 800px; display: block; clear: both; padding-top: 10px;">'+
					 		'</div>'+
					 		'<div class="crop-area" ng-show="selectionActive">'+
					 			'<p>'+langService.translate(attrs.editorCropText)+'</p>'+
					 			'<img class="active-image" ng-src="{{activeImage.url}}"></img><br>'+
					 			'<p ng-show="imgSelection"><span l="fileupload.crop.area">Selected area:</span> {{imgSelection.width}} x {{imgSelection.height}}</p>'+
					 			'<p ng-show="fileCropping || fileSaving">'+
					 				'<img src="img/ajax-loader.gif" style="margin-right: 5px;"></img>'+
					 				'<span ng-show="fileSaving">'+langService.translate('fileupload.button.submit.saving')+'</span>'+
					 				'<span ng-show="fileCropping">'+langService.translate('fileupload.cropping')+'</span>'+
					 			'</p>'+
					 		'</div>'+
						'</div>'+
						'<div class="modal-footer" style="clear:both;">'+
							//image delete button, hide when no delete function is provided, file is uploading, no image exists or selection is active!
							'<button class="btn" type="button" ng-click="deleteImage()" ng-hide="selectionActive || fileUploading || fileSaving || !imageUrl || !deleteImage"><i class="icon-trash icon-black"></i></button>'+
							'<button type="button" class="btn" ng-click="cancel()" data-dismiss="modal" l="common.cancel">Close</button>'+
						 	'<span class="btn btn-success fileinput-button" style="float: none;" ng-hide="selectionActive || fileUploading || fileSaving">'+
						 		'<i class="icon-plus icon-white"></i>'+
            					'<span l="fileupload.button.add">Add image...</span>'+
						 		'<input type="file" name="files[]" accept="image/jpeg,image/png,image/gif"></input>'+
						 		'<input type="hidden" value="{{editorImageId}}">'+
					 		'</span>'+
							'<button type="button" class="btn btn-primary" ng-click="crop()" ng-show="selectionActive" ng-disabled="fileCropping || fileSaving" l="fileupload.button.crop">Crop image</button>'+
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
			        		uploadInput = iElement.find('form[name=simpleImageForm]'),
			        		imageElement = iElement.find('img.active-image'),
			        		uploadObject, //returned from file upload initialization
			        		imgAreaSelect, // holds instance of image cropping tool
			        		aspectRatio = iAttrs['editorRatio'], // get the preset ratios for image selection from the "editor-ratios" attribute.
			        		editorCropText = iAttrs['editorCropText'],
			        		deleteImage = iAttrs['editorOnDelete'],
			        		minImageHeight = iAttrs['editorMinHeight'],
			        		minImageWidth = iAttrs['editorMinWidth'];

		        	/** Initialize private scope variables */
		        	function resetScope () {
								scope.fileAdded = false;
								scope.fileUploading = false;
								scope.fileSaving = false;
								scope.fileCropping = false;
								scope.selectionActive = false;
								scope.activeImage = null;
								scope.barStyle= { width: '0%'};
								scope.error = false;
								scope.selectedFiles = null;
								scope.errorMessage = "";
								scope.userSaved = false;
								if(scope.simpleImageEditor) {
									scope.imageUrl = scope.simpleImageEditor['url'];
								}
								else {
									scope.imageUrl = null;
								}
								scope.userCancelled = false;
		        	}

		        	resetScope();

		        	if(!scope.editorImageResource) {
		        		$log.error('simpleImageEditor: editorImageResource not set');
		        	}

		        	/** Gets localized title. Returns key of no title was found. */
		        	scope.getTitle = function() {
		        		return langService.translate(scope.editorTitleKey) || scope.editorTitleKey;
		        	}

		        	scope.isSaveDisabled = function() {
		        		return !scope.fileAdded || scope.fileUploading;
		        	};

		        	/** Called from imgAreaSelect plugin after user selected an image area. */
		        	function selectionEnd(img, selection) {
		        		scope.imgSelection = selection;
		        		scope.$digest();
		        	}

		        	/** Called from upload service during upload progress. */
		        	function fileUploadProgressCallback(data) {
		        		// Only got to 95% save the last 5% for the save request.
		        		scope.barStyle.width = parseInt(data.loaded / data.total * 99, 10) + '%';
		        		scope.$digest();
		        	};

					/** Called from upload service when upload is finished and updates U */
					function fileUploadedCallback(success, data) {
						var imageResource = scope.editorImageResource,
							activeImage = null;

						if(success) {
			        		activeImage = new imageResource({
			    				id: scope.editorImageId,
			    				blobKey: imageResource.blobKey,
			    				url: imageResource.url
	    					});

	    					scope.activeImage = activeImage;
	    					scope.imageUrl = activeImage.url;
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
							if(data.errorThrown === 'abort') {
								// User cancelled the upload close the dialog
								dialog.modal('hide');
							}
							else {
								// We have an error from the server.
								scope.errorMessage = langService.translate("fileupload.submit.error");
								scope.error = true;
								scope.barStyle.width = '0%';
							}				
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

		        		// Start check for image dimensions
		        		if(minImageHeight || minImageWidth) {
		        			if(uploadObject.checkImageDimensions(function(success) {		        			
		        				if(success) {
		        					// image passed the check
		        					scope.save();
		        				}
		        				else {
		        					scope.error = true;
		        					// interpolate optional expressions (like dimensions)
											scope.errorMessage = $interpolate(langService.translate("fileupload.error.dimensions"))(scope);
											scope.fileAdded = false;
											scope.selectedFiles = null;
											scope.$digest();
		        				}
		        			}, minImageWidth, minImageHeight) == false) {
		        				// no check was done, because of incompatible browser
		        				scope.save();
		        			}
		        		}
		        		else {
		        			// No dimension requirements set, just continue to save
		        			scope.save();
		        		}
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
		        		scope.fileSaving = true;
		        		activeImage.$save(
		        			// Success
		        			function() {
		        				scope.fileSaving = false;
		        				scope.barStyle.width = '100%';
		        				scope.editorOnSave({ "image" : activeImage});
				        		dialog.modal('hide');
									},
									 // Error
		        			function() {
										deleteActiveUpload();
										resetScope();
										scope.error = true;
										scope.errorMessage = langService.translate("fileupload.save.error");
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
			        		scope.fileUploading = true;			        		
			        		uploadObject.upload();
		        		}
		        	}

		        	/** Delete button click handler. */
		        	scope.deleteImage = (deleteImage) ? function() {
		        		scope.editorOnDelete();
		        		dialog.modal('hide');
		        	} : null;

		        	/** Cancel button click handler */
		        	scope.cancel = function() {
		        		scope.userCancelled = true;
		        		if(scope.fileUploading) {
		        			// Abort the upload
		        			uploadObject.cancel();
		        		}
		        		else
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
		        		var modalBodyHeight;

		        		if(scope.editorEnabled === true || typeof scope.editorEnabled == "undefined") {
		        			//init file upload plugin for this dialog
	        				uploadObject = uploadService.getFileUploadObject(uploadInput, scope.editorImageResource, fileAddedCallback, fileUploadedCallback, fileUploadProgressCallback);

	   							dialog.modal({
	   								'keyboard': false,
	   								'backdrop': 'static'	   		
	   							});
	   							dialog.modal('show');

							if(editorCropText) {
								modalBodyHeight = ($(window).height() * .8) + 'px';
								dialogBody.css('height', modalBodyHeight);

								dialogBody.css('max-height', modalBodyHeight);
								// Expand the dialog to 80% width and 80% height of window.								
								dialog.css('width', '80%');
								dialog.css('top', '5%');
								dialog.css({
								    // 'height': function () { 
								    // 	return ($(window).height() * .8) + 'px';
								    // },								    
								    'margin-left': function () { 
								    	return -($(this).width() / 2); 
								   	}
								   	//,'margin-top': function () { 
								    //	return -($(this).height() / 2); 
								   	//}
								});
								
							}
							
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
