/** @module Cloobster/InfoPage */
'use strict';

/**
* 
* Uses the datepicker from http://www.eyecon.ro/bootstrap-datepicker/
*/
Cloobster.Reports =  function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, InfoPage, Business, langcodes, Area) {
	//checkins, feedback, orders, vip calls
	/**
	* List of avail report types.
	*/
	$scope.reportTypes = [
		{	
			title: langService.translate("reports.type.checkins") || "Check-Ins",
			type: 'checkins'
		},
		{	
			title: langService.translate("reports.type.orders") || "Orders",
			type: 'orders-placed'
		},
		{	
			title: langService.translate("reports.type.customerrequests") || "Service Calls",
			type: 'customer-requests'
		},
		{	
			title: langService.translate("reports.type.feedback") || "Feedback",
			type: 'feedback'
		}
	];
	/** The current selected report type */
	$scope.currentReport = null;
	/** Contains the data of retrieved report. */
	$scope.reportData = null;

	$scope.fromDate = null;
	$scope.toDate = null;
	$scope.dateFormat = "dd.mm.yyyy";

		/** Area resource. */
	$scope.areasResource = null;
	/** Areas assigned*/
	$scope.areas = null;
	/** Currently selected area. */
	$scope.currentArea = null;

	$scope.showReport = function(type) {
		$scope.currentReport = type;
	}

	$scope.loadReport = function() {
		//GET /b/businesses/{id}/reports?kpi=Z&areaId=Y&fromDate=1&toDate=2
		$http({
			method: 'GET', 
			url: '/b/businesses/'+$scope.activeBusinessId+'/reports',
			params: {
				'kpi' : $scope.currentReport.type,
				'areaId': $scope.currentArea.id,
				'fromDate' : $scope.fromDate.getTime(),
				'toDate' : $scope.toDate.getTime(),
			}
		})
		  .success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    $scope.reportData = data;
		  })
		  .error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
	}

	$scope.loadAreas = function(businessId) {
		var account,
			subscriptionResource;

		if(!$scope.loggedIn) {
			$log.log('Not logged in! Failed to load areas.');
			return;
		}
		// activeBusinessId = businessId;

		// account =  loginService.getAccount();

		// subscriptionResource = Business.buildSubscriptionResource(activeBusinessId);

		// $scope.activeBusiness = Business.buildResource(account.id).get(
		// 	{'id' : activeBusinessId, 'countSpots' : true},
		// 	function() {
		// 		$scope.activeSubscription = subscriptionResource.get({'id' : $scope.activeBusiness.activeSubscriptionId});
		// 	}
		// );

		//create areas resource
		$scope.areasResource = Area.buildResource(businessId);
		//load spots
		$scope.areas = $scope.areasResource.query(angular.noop,	handleError);
	}

	function initDates() {
		var toDate = new Date(),
			fromDate = new Date();

		$scope.toDate = toDate;

		fromDate.setDate(fromDate.getDate() - 30);

		$scope.fromDate = fromDate;
	}

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			$scope.activeBusinessId = businessId;
			initDates();
			$scope.loadAreas(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}
Cloobster.Reports.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'InfoPage', 'Business', 'langcodes', 'Area'];