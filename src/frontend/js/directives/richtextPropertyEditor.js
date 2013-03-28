Cloobster.directives.directive('richtextPropertyEditor', ['lang','langcodesMap','$timeout', function(langService,langcodesMap,$timeout) {
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
			editorEntity: '=',
			editorField: '@',
			editorEnabled: '=',
			editorValidate: '&',
			editorValidateText: '@'
		},
		compile: function(element, attrs, transclude) {
			var required = attrs.hasOwnProperty('editorRequired') ? "required='required'" : "",			
				editorFieldAttr = attrs.hasOwnProperty('editorField') ? attrs.editorField : null,
				editorEntityAttr = attrs.hasOwnProperty('editorEntity') ? attrs.editorEntity : null,
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
					 			'<textarea class="property-input" style="float:left;" rows="12" cols="300" ng-model="editorValue"></textarea>'+
								'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
									'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
								'</div>'+
							'</div>'+
						'</div>';
				if(editorFieldAttr && editorEntityAttr) {
					html +=	'<select ng-model="currentLang" ng-options="langcode as langcodesMap[langcode].lang for (langcode, translation) in editorEntity.translations">'+
									'<option value="">-- choose lang --</option>'+
    							'</select><br>'+
						'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.propertyTranslation.$invalid)">'+
					 		'<div class="controls">'+
					 			'<textarea class="translation-input" style="float:left;" rows="12" cols="300"></textarea>'+
							'</div>'+
						'</div>';
					};
				html+='</div>'+
					'<div class="modal-footer">'+
						'<button type="button" class="btn" ng-click="cancel()" data-dismiss="modal">'+l('common.cancel')+'</button>'+
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
		        		editorTextarea = iElement.find('textarea.property-input'),
		        		editorTranslationTextarea = iElement.find('textarea.translation-input'),
		        		ctrl = scope.simplePropertyForm.simpleProperty,
		        		editorConfig = {
			        		//config
			        		resize_enabled: false,
			        		// Disabled because of duplicate bug - see Ticket #527
			        		//forcePasteAsPlainText: true,
			        		toolbar: [
										// { name: 'document', items : [ 'Source','-','Save','NewPage','DocProps','Preview','Print','-','Templates' ] },
										{ name: 'clipboard', items : [ 'Undo','Redo' ] },
										// { name: 'editing', items : [ 'Find','Replace','-','SelectAll','-','SpellChecker', 'Scayt' ] },
										// { name: 'forms', items : [ 'Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 
									 //        'HiddenField' ] },
										// '/',
										{ name: 'basicstyles', items : [ 'Bold', 'Underline', 'RemoveFormat' ] },
										{ name: 'paragraph', items : [ 'NumberedList','BulletedList', //'Outdent','Indent'
										'JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock'] },
										// { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
										// { name: 'insert', items : [ 'Image','Flash','Table','HorizontalRule','Smiley','SpecialChar','PageBreak','Iframe' ] },
										// '/',
										{ name: 'styles', items : [ 'Format'] }
										// { name: 'colors', items : [ 'TextColor','BGColor' ] },
										// { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About' ] }
									]
			        	},
		        		editor,
		        		translationEditor,
		        		deregisterWatch;
		        		

							//init editor		        	
		        	editor = editorTextarea.ckeditor(function() {
		        		//callback after editor is succesfully loaded

		        	}, editorConfig);

							if(editorEntityAttr) {
								// init editor for additional translation text fields
								translationEditor = editorTranslationTextarea.ckeditor(function() {
			        		//callback after editor is succesfully loaded

			        	}, editorConfig);
							}

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

		        	scope.langcodesMap = langcodesMap;		      
		        	
		        	scope.save = function () {
		        		//only save when form is valid
		        		if(scope.simplePropertyForm.$valid && !scope.saved) {
		        			scope.saved = true;
		        			

		        			if(editorEntityAttr) {
		        				//grab the value of richtext editor
		        				scope.editorEntity[scope.editorField] = editor.val();
		        				scope.editorTranslations[scope.currentLang] = translationEditor.val();

		        				// set all values on the original entity
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					translation[scope.editorField] = scope.editorTranslations[key];
		        				});
		        			}
		        			else {
		        				//grab the value of richtext editor
		        				scope.editorProperty = editor.val();	
		        			}		        			
		        			// Wrap this in a timeout, because the model change is not immediate.
			        		$timeout(scope.editorOnSave);
			        		dialog.modal('toggle');
		        		}
		        	}

		        	/**
		        	* User canceled edit. Reset the value of the texteditor.
		        	*/
		        	scope.cancel = function() {
		        		editor.val(scope.editorProperty);

		        		if(editorEntityAttr) {
			        		scope.editorTranslations = {};
	        				angular.forEach(scope.editorEntity.translations, function(translation, key){
	        					// Set value of the field in the translation object
										scope.editorTranslations[key] = translation[scope.editorField];
										if(!scope.currentLang)
											scope.currentLang = key;
									});
	        			}
	        			translationEditor.val(scope.editorTranslations[scope.currentLang]);
		        	}

		        	/**
		        	* Convenience method to clear the input field.
		        	*/
		        	scope.clearInput = function() {
		        		scope.editorValue = "";
		        		scope.editorTranslations = {};
		        		scope.currentLang = null;
		        	}

		        	function switchLanguage(newValue, oldValue) {
		        		if(oldValue) {
		        			console.log('oldlanguage '+ oldValue);
		        			scope.editorTranslations[oldValue] = translationEditor.val();
		        			translationEditor.val(scope.editorTranslations[newValue]);
		        		}
		        	}

		        	dialog.on("hide", function() {
		        		if(deregisterWatch) {
		        			deregisterWatch();
		        			deregisterWatch = null;
		        		}
		        	});
		        	
		        	iElement.find('div.toggler').bind('click', function() { 
		        		if(scope.editorEnabled == true || typeof scope.editorEnabled == 'undefined') {
									deregisterWatch = scope.$watch('currentLang', switchLanguage);
		        			scope.clearInput();
		        			scope.$digest();
		        			if(editorEntityAttr) {
		        				scope.editorValue = scope.editorEntity[scope.editorField];
		        				scope.editorTranslations = {};		        			
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					// Set value of the field in the translation object
  										scope.editorTranslations[key] = translation[scope.editorField];
  										if(!scope.currentLang) {
  											scope.currentLang = key;
  										}  											
										});

										translationEditor.val(scope.editorTranslations[scope.currentLang]);

		        			}
		        			else {
		        				scope.editorValue = scope.editorProperty;		        				
		        			}
		        			scope.saved = false;		        			
									dialog.modal('toggle');
									console.log("currentLang=" + scope.currentLang);
									// Set focus to editor.
		        			editor.ckeditorGet().focus();
		        			scope.$digest();
		        			console.log("currentLang=" + scope.currentLang);
		        						        	
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
