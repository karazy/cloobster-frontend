/** @module Cloobster/InfoPage */
'use strict';

/**
* 	@name Cloobster.InfoPage
*
* 	Infopage controller 
* 	View and manage infopages for static information (e.g. contact information).
* 	@constructor
*/
Cloobster.InfoPage = function($scope, $http, $routeParams, $location, loginService, uploadService, langService, $log, handleError, InfoPage, Business) {

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

	$scope.activeBusiness = null;

	/**
	* Loads all infopages
	*/
	$scope.loadInfoPages = function(businessId) {
		var account;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load info pages.');
			return;
		}

		activeBusinessId = businessId;

		account =  loginService.getAccount();

		$scope.activeBusiness = Business.buildResource(account.id).get({'id' : activeBusinessId});

		//create info page resource
		$scope.infoPageResource = InfoPage.buildResource(activeBusinessId);

		//load info pages
		$scope.infopages = $scope.infoPageResource.query(angular.noop,	handleError);
	};

	/**
	*
	*/
	$scope.loadInfoPage =  function(page) {
		$scope.currentInfoPage = page;
	};

	/**
	*
	*/
	$scope.createInfoPage = function() {
		$scope.currentInfoPage = new $scope.infoPageResource(defaultPage);
	};

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newVal == true && businessId) {
			$scope.loadInfoPages(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}

Cloobster.InfoPage.$inject = ['$scope', '$http', '$routeParams', '$location', 'loginService', 'uploadService', 'langService', '$log', 'handleError', 'InfoPage', 'Business'];