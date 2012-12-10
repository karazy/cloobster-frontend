/** @module Cloobster/Documents */
'use strict';

Cloobster.Documents = function($scope, $rootScope, $http, $routeParams, $location, loginService, langService, $log, handleError, Documents, $timeout) {

	var pollingInterval = 5000,
		dummyDocuments = [
			{
				id: 1,
				name: 'Barcodes für Schablonen',
				type: 'PDF',
				entity: 'Spot',
				createDate: (new Date().getTime()) - 10000000,
				status: 'complete'
			},
			{
				id: 2,
				type: 'PDF',
				name: 'Barcodes für Schablonen',
				entity: 'Spot',
				createDate: new Date().getTime(),
				status: 'pending'
			},
			{
				id: 3,
				type: 'PDF',
				name: 'Barcodes für Schablonen',
				entity: 'Spot',
				createDate: new Date().getTime() + 10000000,
				status: 'error'
			}
		];

	$scope.documentsResource = null;
	$scope.documents = null;
	$scope.documentToDelete = null;



	$scope.loadDocuments = function(businessId) {

		if(!$scope.loggedIn) {
			$log.log('Documents.loadDocuments: Not logged in! Failed to documents.');
			return;
		}
		
		$scope.documentsResource = Documents.buildResource(businessId);		

		$scope.documents = $scope.documentsResource.query(angular.noop, handleError);

		//TODO testing purpose
		// $scope.documents = dummyDocuments;

		//cancel old timeouts
		if($rootScope.documentTimeoutPromise) {
			$timeout.cancel($rootScope.documentTimeoutPromise);
		}		
		pollDocuments();
	}

	function pollDocuments(businessId) {

		//only poll if the documents tab is open
		if($location.path().indexOf('documents') > -1) {
			$scope.documents = $scope.documentsResource.query(angular.noop, handleError);
			$rootScope.documentTimeoutPromise = $timeout(pollDocuments, pollingInterval);
		} else {
			$log.log('Documents.pollDocuments: stop polling');			
		}
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
			$scope.documentToDelete = null;
			$scope.documents.splice(index, 1);
		}
	}

	/**
	* Sets document to delete.
	*/
	$scope.setDeleteDocument = function(d) {
		//TODO  FR: since ng-click="documentToDelete=d" didn't work, I use this workaround
		$scope.documentToDelete = d;
	}

	/**
	* Returns a css class based on the documents status.
	* @param doc
	*	Doc whos status gets examined
	*/
	$scope.getStatusColumnClass = function(doc) {

		switch(doc.status.toLowerCase()) {
			case "complete":
				return "label-success";
			case "pending":
				return "label-warning";
			case "error":
				return "label-important"
			default:
				return "";
		}
	}


	$scope.$watch('loggedIn', function(newVal, oldVal) {
		var businessId = $routeParams.businessId || "";

		if(newVal == true && businessId) {
			//load areas
			$scope.loadDocuments(businessId);
		} else if(newVal == false) {
			$location.url('/');
		}
	});	

}

Cloobster.Documents.$inject = ['$scope', '$rootScope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'Documents', '$timeout'];