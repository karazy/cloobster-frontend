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

	$scope.deleteDocument = function(id) {
		var index; //index in $scope.documents of doc to delete

		if(!id) {
			$log.log('Documents.deleteDocument: no id provided');
			return;
		}

		if(!$scope.documents) {
			$log.log('Documents.deleteDocument: $scope.documents does not exist');
			return;
		}

		for (var i = $scope.documents.length - 1; i >= 0; i--) {
			if($scope.documents[i].id == id) {
				index = id;
				$scope.documents[i].$delete(
					success,
					handleError
				);

				break;
			}
		};

		function success() {
			//remove document from list
			$scope.documents.splice(index, 1);
		}
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