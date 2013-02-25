/** @module Cloobster/InfoPage */
'use strict';

/**
* 
*
*/
Cloobster.Reports =  function($scope, $http, $routeParams, $location, loginService, langService, $log, handleError, InfoPage, Business, langcodes) {
	//checkins, feedback, orders, vip calls
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

	$scope.loadReport = function(type) {
		
	}

		/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			// $scope.loadInfoPages(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}
Cloobster.Reports.$inject = ['$scope', '$http', '$routeParams', '$location', 'login', 'lang', '$log', 'errorHandler', 'InfoPage', 'Business', 'langcodes'];