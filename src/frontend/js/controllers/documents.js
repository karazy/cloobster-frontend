/** @module Cloobster/Documents */
'use strict';

Cloobster.Documents = function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, Documents) {

	$scope.documentsResource = null;
	$scope.documents = null;

	$scope.loadDocuments = function(businessId) {

		if(!$scope.loggedIn) {
			$log.log('Documents.loadDocuments: Not logged in! Failed to documents.');
			return;
		}
		
		$scope.documentsResource = Documents.buildResource(businessId);		

		$scope.documents = $scope.documentsResource.query(angular.noop, handleError);
	}


	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var businessId = $routeParams.businessId || "";

		if(newVal == true && businessId) {
			//load areas
			$scope.loadDocuments(businessId);
		}

	});	

}

Cloobster.Documents.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'Documents'];