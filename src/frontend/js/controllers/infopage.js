/** @module Cloobster/InfoPage */
'use strict';

/**
* 	@name Cloobster.InfoPage
*
* 	Infopage controller 
* 	View and manage infopages for static information (e.g. contact information).
* 	@constructor
*/
Cloobster.InfoPage = function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, InfoPage) {

	var activeBusinessId,
		defaultPage = {
			title: langService.translate("infopages.new.default.title") || "My new InfoPage"
		};

	/** Resource for CRUD on info pages. */	
	$scope.infoPageResource = null;
	/* holds all infopages */
	$scope.infopages = null;
	/* holds the currently selected page */
	$scope.currentInfoPage = null;
	/** Template resource used to create concrete image resources. */
	$scope.imageResource = null;

	$scope.activeBusiness = null;
	/* The selected language in which to save data. */
	$scope.currentLanguage = "";

	/**
	* Loads all infopages
	*/
	$scope.loadInfoPages = function(businessId, language) {
		var account,
			params = {};

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load info pages.');
			return;
		}

		if(language) {
			params.lang = language;
		}

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.currentInfoPage = null;

		// $scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		//create info page resource
		$scope.infoPageResource = InfoPage.buildResource(activeBusinessId);

		//load info pages
		$scope.infopages = $scope.infoPageResource.query(params, angular.noop,	handleError);		
	}

	/**
	*
	*/
	$scope.loadInfoPage =  function(page) {
		$scope.currentInfoPage = page;

		$scope.imageResource = InfoPage.buildImageResource(activeBusinessId, page.id);
	}

	/**
	*
	*/
	$scope.createInfoPage = function() {
		$scope.currentInfoPage = new $scope.infoPageResource(defaultPage);
	}

	$scope.saveInfoPage = function() {
		$log.log("save infopage");

		if($scope.currentInfoPage && $scope.currentInfoPage.id) {
			$scope.currentInfoPage.$update(null, null, handleError);	
		} else {
			$scope.currentInfoPage.$save(saveSuccess, handleError);
		}

		function saveSuccess(infopage) {
			$scope.infopages.push(infopage);
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

	$scope.switchLanguage = function() {
		$scope.loadInfoPages(activeBusinessId, $scope.currentLanguage);
		if($scope.currentLanguage) {
			$http.defaults.headers.common['Content-Language'] = $scope.currentLanguage;	
		} else {
			delete $http.defaults.headers.common['Content-Language'];
		}
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

Cloobster.InfoPage.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'InfoPage'];