/* Cloobster namespace. Create if not exists.*/
window.CloobsterAdmin =  window.CloobsterAdmin || {};

CloobsterAdmin.Reports = function($scope, $http, handleError,$log) {
	
	function init() {
		$scope.reports = null;
		$scope.toDate = new Date();		
		$scope.fromDate = new Date();
		//show last week
		$scope.fromDate.setDate($scope.toDate.getDate() - 7);
	}

	$scope.loadReport = function() {
		if(!$scope.fromDate) {
			$log.error("Reports.loadReport: no fromDate exists");
			return;
		}

		if(!$scope.toDate) {
			$log.error("Reports.loadReport: no toDate exists");
			return;
		}

		$scope.loadReport.progress = true;

		$http({
			method: 'GET', 
			url: '/admin/m/locations/reports',
			params: {
				'fromDate' : $scope.fromDate.getTime(),
				'toDate' : $scope.toDate.getTime()
			}
		}).success(function(data, status, headers, config) {
	    $scope.reports = data;
	    $scope.loadReport.progress = false;
	  })
	  .error(handleError);
	}

	init();
}
CloobsterAdmin.Reports.$inject = ['$scope', '$http', 'errorHandler', '$log'];
