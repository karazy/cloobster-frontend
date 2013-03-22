/** @module Cloobster/InfoPage */
'use strict';

/**
* 	@name Cloobster.InfoPage
*
* 	Infopage controller 
* 	View and manage infopages for static information (e.g. contact information).
* 	@constructor
*/
Cloobster.InfoPage = function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, InfoPage, Business, langcodes, validator) {

	var activeBusinessId,
			requiredInfoPageFields = {
				title: true
			};

	/** Resource for CRUD on info pages. */	
	$scope.infoPageResource = null;
	/* holds all infopages */
	$scope.infopages = null;
	/* holds the currently selected page */
	$scope.currentInfoPage = null;
	/** This is the infoPage selected in the list. Difference to currentInfoPage is that 
 	 * currentInfoPage gets loaded on list selection because of language.
	 */
	$scope.selectedInfoPage = null;
	/** Template resource used to create concrete image resources. */
	$scope.imageResource = null;
	/** Active business. */
	$scope.activeBusiness = null;
	/* The selected language in which to save data. */
	$scope.currentLanguage = "";
	/** List of a languages. */
	$scope.langcodes = langcodes;



	/**
	* Loads all infopages
	*/
	$scope.loadInfoPages = function(businessId, language) {
		var account,
			params = {},
			businessLang;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load info pages.');
			return;
		}

		if(language) {
			params.lang = language;
		}

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		// function businessLoaded() {

		// 	params['lang'] = $scope.activeBusiness.lang;

		
		// }

			$scope.currentInfoPage = null;

			// $scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

			//create info page resource
			$scope.infoPageResource = InfoPage.buildResource(activeBusinessId);

			//load info pages
			$scope.infopages = $scope.infoPageResource.query(params, angular.noop,	handleError);
	}

	function updateSelectedInfoPage (newData) {
		if($scope.selectedInfoPage && newData) {
			angular.extend($scope.selectedInfoPage, newData);
		}
	}

	$scope.selectInfoPage = function(page) {
		$scope.selectedInfoPage = page;
		// $scope.currentInfoPage = page;

		$scope.loadInfoPage(page, $scope.activeBusiness.lang);

		$scope.currentLanguage = null;
		$scope.imageResource = InfoPage.buildImageResource(activeBusinessId, page.id);
		$scope.infoPageInvalid = false;
	};

	/**
	* Load given infopage in needed language from server and store it in $scope.currentInfoPage
	*/
	$scope.loadInfoPage =  function(page, languageCode) {
		var params = {'id': page.id};
		
		if(languageCode) {
			params.lang = languageCode;
		}

		// This will blank the current info page leading to a flickering of the screen.
		// To only display the new data after loading set the currentInfoPage in the success callback.
		$scope.currentInfoPage = $scope.infoPageResource.get(params, function(data) {
			$scope.imageResource = InfoPage.buildImageResource(activeBusinessId, page.id);
			if(!languageCode) {
				updateSelectedInfoPage(data);
			}
		},	handleError);
	}

	/**
	*
	*/
	$scope.createInfoPage = function() {
		$scope.currentInfoPage = new $scope.infoPageResource();
		$scope.infoPageInvalid = false;
	}

	$scope.saveInfoPage = function() {
		$log.log("save infopage");
		if(!$scope.currentInfoPage) {
			return;
		}

		if(!validator.validateModel($scope.currentInfoPage, requiredInfoPageFields)) {
			$scope.infoPageInvalid = true;
			return;
		}
		$scope.infoPageInvalid = false;

		if($scope.currentLanguage) {
			$http.defaults.headers.common['Content-Language'] = $scope.currentLanguage.code;
		}
		else {
			delete $http.defaults.headers.common['Content-Language'];
		}

		// Add http protocol prefix to url if none of http or https are present.
		if($scope.currentInfoPage['url'] != null && $scope.currentInfoPage.url.lastIndexOf('http://', 0) != 0 && $scope.currentInfoPage.url.lastIndexOf('https://', 0) != 0) {
			$scope.currentInfoPage.url = 'http://' + $scope.currentInfoPage.url;
		}

		if($scope.currentInfoPage && $scope.currentInfoPage.id) {
			if($scope.currentLanguage) {
				$scope.currentInfoPage.$update(null, null, handleError);
			}
			else {
				// use callback here to update the infopage in the list because we updated the default language
				$scope.currentInfoPage.$update(updateSuccess, handleError);	
			}
		} else {
			$scope.currentInfoPage.$save(saveSuccess, handleError);
		}

		function updateSuccess(infopage) {
			updateSelectedInfoPage(infopage);
		};

		function saveSuccess(infopage) {
			$scope.infopages.push(infopage);
			$scope.selectedInfoPage = infopage;
			$scope.imageResource = InfoPage.buildImageResource(activeBusinessId, infopage.id);
		}
	}

	$scope.deleteInfoPage = function(pageToDelete) {
		pageToDelete.$delete(angular.noop, handleError);

		angular.forEach($scope.infopages, function(page, index) {
			if(pageToDelete.id == page.id) {
				$scope.infopages.splice(index, 1);
				//exit loop
				return false;
			}
		});

		$scope.currentInfoPage = null;
	}

	$scope.setImage = function(image) {
		$scope.currentInfoPage.image = {
			url: image.url,
			blobKey: image.blobKey
		};
	}

	$scope.discardImage = function(image) {
		if(image && image.blobKey) {
			$http['delete']('/uploads/images/' + image.blobKey)
			.error(handleError);
		}
	}

	$scope.deleteInfoPageImage = function() {
		if($scope.imageResource) {
			var infoPage = $scope.currentInfoPage;
			$scope.imageResource.remove(null,null, function() {
				infoPage.image = null;
			}, handleError);	
		}
	};

	$scope.switchLanguage = function(lang) {
		if(lang) {
			//$scope.loadInfoPages(activeBusinessId, $scope.currentLanguage.code);
			if($scope.currentInfoPage) {
				$scope.loadInfoPage($scope.currentInfoPage, lang.code);
			}
			$scope.currentLanguage = lang;
		} else {
			$scope.currentLanguage = null;
			//$scope.loadInfoPages(activeBusinessId);
			if($scope.currentInfoPage) {
				$scope.loadInfoPage($scope.currentInfoPage);
			}
		}

		$scope.resetSearchField();		
	}

	$scope.isSelectedLanguage = function(langToFilter) {
		if(!$scope.activeBusiness.lang) {
			return false;
		}

		if(jQuery.inArray(langToFilter.code, $scope.activeBusiness.lang) >= 0) {
			return true;
		}

		return false;
	}

	/**
	*
	* Reset the searchfield to an empty state.
	*/
	$scope.resetSearchField = function() {
		//reset search field
		if($scope.infopagesQuery)  {
			$scope.infopagesQuery.title = "";
		}		
	}

	/**
	* Toggle hideInDashboard flag of product.
	* Executes a save afterwards.
	*/
	$scope.toggleHideInDashboard = function(infopage) {
		var objectToToggle = infopage || $scope.currentInfoPage;
		
		objectToToggle.hideInDashboard = !objectToToggle.hideInDashboard;

		//due to currentInfoPage not related to the original infopage because of languages in the list
		//we have to reflect the change in the list by explicitly setting it
		updateSelectedInfoPage(objectToToggle);
		$scope.saveInfoPage();
	}

	/**
	* Returns an infopage based on the current translation.
	* @param {String} fieldName
	*	Name of field to return
	* @param {Boolean} useDefault (optional)
	*	If true, uses default language value if none was found in translation.
	* @return
	*	Translated infopage
	*/
	$scope.translatedInfoPage = function(fieldName, useDefault) {
		var tField;

		if(!fieldName) {
			$log.log('Infopage.translatedInfoPage: no fieldName provided');
			return;
		}

		if(!$scope.currentInfoPage) {
			$log.log('Infopage.translatedInfoPage: currentInfoPage does not exist');
			return;
		}

		//no translations exist
		if(!$scope.currentInfoPage.translations || !$scope.currentLanguage) {
			return $scope.currentInfoPage[fieldName];
		}

		tField = $scope.currentInfoPage.translations[$scope.currentLanguage.code][fieldName];

		if(!tField && useDefault) {
			tField = $scope.currentInfoPage[fieldName];
		}

		return tField;

	}

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			$scope.loadInfoPages(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}

Cloobster.InfoPage.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'InfoPage', 'Business', 'langcodes','validator'];