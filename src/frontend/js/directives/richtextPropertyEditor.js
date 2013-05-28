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
				'<div class="modal hide" ng-class="{\'richtext-property-editor-big\' : editorEntity.translations}">'+
				  '<div class="modal-header">'+
				   ' <button type="button" class="close" data-dismiss="modal">×</button>'+
				    '<h3 l="{{editorTitle}}">Edit property</h3>'+
				 '</div>'+
				'<form name="simplePropertyForm" novalidate ng-submit="save()" class="edit-property-form">'+
					'<div class="modal-body">'+
						'<div ng-class="{\'richtext-property-editor-big-left\' : editorEntity.translations}">'+
							'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.simpleProperty.$invalid)">'+
						 		'<div class="controls">'+
						 			'<textarea class="property-input" style="float:left;" rows="12" cols="300" ng-model="editorValue"></textarea>'+
									'<div class="help-inline" ng-show="simplePropertyForm.simpleProperty.$dirty && simplePropertyForm.simpleProperty.$invalid">'+
										'<span ng-show="simplePropertyForm.simpleProperty.$error.required">'+ l('propertyeditor.error.required') +'</span>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
				if(editorFieldAttr && editorEntityAttr) {
					html +=	
					'<div ng-class="{\'richtext-property-editor-big-right\' : editorEntity.translations}" ng-show="editorEntity.translations">'+
						'<select ng-model="currentLang" ng-options="langcode as langcodesMap[langcode].lang for (langcode, translation) in editorEntity.translations">'+
    					'</select><br>'+
						'<div class="control-group" ng-class="getFieldInputClass(simplePropertyForm.propertyTranslation.$invalid)">'+
					 		'<div class="controls">'+
					 			'<textarea class="translation-input" style="float:left;" rows="12" cols="300"></textarea>'+
							'</div>'+
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
		        				//grab the value of richtext editor for the default language
		        				scope.editorEntity[scope.editorField] = editor.val();
		        				//grab the value of richtext editor for the current selected language and save in the scope
		        				scope.editorTranslations[scope.currentLang] = translationEditor.val();

		        				// set all translated field values on the original entity from their isolated scope values
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					translation[scope.editorField] = scope.editorTranslations[key];
		        				});
		        			}
		        			else {
		        				// no translated entity supplied
		        				//  just grab the value of richtext editor
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
		        			// switch the language of the translated field.
		        			// saving the value for the previous selected language and
		        			// setting the value of the richtext editor to
		        			// the content for the new selected language.
		        			scope.editorTranslations[oldValue] = translationEditor.val();
		        			translationEditor.val(scope.editorTranslations[newValue] ? scope.editorTranslations[newValue] : "");
		        		}
		        	}

		        	dialog.on("hide", function() {
		        		if(deregisterWatch) {
		        			// release the watch on the currentLang value
		        			// after hiding the modal, no use in keeping it around
		        			deregisterWatch();
		        			deregisterWatch = null;
		        		}
		        	});
		        	
		        	iElement.find('div.toggler').bind('click', function() { 
		        		if(scope.editorEnabled == true || typeof scope.editorEnabled == 'undefined') {

		        			// watch the currentLang value to react to a switch for the currently
		        			// displayed language in the translated richtext field
									deregisterWatch = scope.$watch('currentLang', switchLanguage);
		        			scope.clearInput();
		        			scope.$digest();

		        			if(editorEntityAttr) {
		        				// we have an entity supplied with translations embeddeed
		        				// grab the default value for the supplied field
		        				scope.editorValue = scope.editorEntity[scope.editorField];

		        				scope.editorTranslations = {};		        			
		        				// copy all translation values for the field
		        				angular.forEach(scope.editorEntity.translations, function(translation, key){
		        					// Set value of the field on the translation object in the isolated scope of the directive
  										scope.editorTranslations[key] = translation[scope.editorField];

  										// select the first available language
  										if(!scope.currentLang) {  											
  											scope.currentLang = key;
  										}  											
										});
		        				// set the content of the richtext editor to the currently selected translation
										translationEditor.val(scope.editorTranslations[scope.currentLang] ? scope.editorTranslations[scope.currentLang] : "");

		        			}
		        			else {
		        				// old way of assigning properties, without embedded translations
		        				scope.editorValue = scope.editorProperty;
		        			}
		        			
		        			editor.val(scope.editorValue);

		        			scope.saved = false;		        			
									dialog.modal('toggle');
									// Set focus to editor.
		        			editor.ckeditorGet().focus();
		        			scope.$digest();		        						        	
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
