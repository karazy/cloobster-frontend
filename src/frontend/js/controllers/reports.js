/** @module Cloobster/InfoPage */
'use strict';

/**
* Controller handles loading and displaying of cloobster reports.
* Uses google chart api.
*/
Cloobster.Reports =  function($scope, $http, $routeParams, $location, $filter, loginService, langService, $log, handleError, InfoPage, Business, langcodes, Area) {
	
	var activeBusinessId = null;

	/**
	* List of avail report types.
	* checkins, feedback, orders, vip calls ...
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
	/** Start date to generate report for. */
	$scope.fromDate = null;
	/** End date to generate report for. */
	$scope.toDate = null;
	/** Area resource. */
	$scope.areasResource = null;
	/** Avail areas.*/
	$scope.areas = null;
	/** Currently selected area. */
	$scope.currentArea = null;
	/** Date format to use. */
	$scope.dateFormat = 'yyyy-MM-dd';
	/** configuration for datepicker */
	$scope.dateOptions = {
        dateFormat: 'yy-mm-dd',
        maxDate: new Date()
    };

    /**
    * Selects a report type.
    * Resets loaded reportData.
    * @param {Object} a report type as defined in $scope.reportTypes
    */
	$scope.selectReportType = function(type) {
		$scope.currentReport = type;		
		$scope.reportData = null;
	}
	/**
	* Load report data from server. Store it in $scope.reportData.
	* /b/businesses/{id}/reports?kpi=Z&areaId=Y&fromDate=1&toDate=2
	*/
	$scope.loadReport = function() {		
		var areaId = ($scope.currentArea) ? $scope.currentArea.id : 0;

		if(!$scope.currentReport) {
			$log.error("Reports.loadReport: no currentReport exists");
			return;
		}

		if(!$scope.fromDate) {
			$log.error("Reports.loadReport: no fromDate exists");
			return;
		}

		if(!$scope.toDate) {
			$log.error("Reports.loadReport: no toDate exists");
			return;
		}

		$http({
			method: 'GET', 
			url: '/b/businesses/'+activeBusinessId+'/reports',
			params: {
				'kpi' : $scope.currentReport.type,
				'areaId': areaId,
				'fromDate' : $scope.fromDate.getTime(),
				'toDate' : $scope.toDate.getTime()
			}
		})
		  .success(function(data, status, headers, config) {
		    $scope.reportData = data;
		    $scope.visualize();
		  })
		  .error(handleError);
	}

	/**
	* Load areas assigned to given businessId.
	* Retrieved areas are stored in $scpe.areas
	* @param {Long} businessId
	*	Business to load areas for.
	*/
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
		$scope.areas = $scope.areasResource.query(function() {
			if($scope.areas && $scope.areas.length > 0) {
				$scope.currentArea = $scope.areas[0];
			}
		},	handleError);
	}

	/**
	*
	*
	*/
	$scope.visualize = function() {
	  // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart'], callback: drawChart});

      // Set a callback to run when the Google Visualization API is loaded.
      // google.setOnLoadCallback(drawChart);

      // Callback that creates and populates a data table,
      // instantiates the pie chart, passes in the data and
      // draws it.
  	function drawChart() {

      	var data = new google.visualization.DataTable(),
  	 		options,
		  	chart,
		  	dateRows,
		  	tempDate;

          data.addColumn('date', 'Date');

			if(!$scope.currentArea) {
				dateRows = generateRowsArray($scope.fromDate, $scope.toDate, ($scope.areas.length + 1));
				angular.forEach($scope.areas, function(area, index) {
					//add an index
					area['index'] = index;
					data.addColumn('number', area.name);
				});	
          } else {
          	dateRows = generateRowsArray($scope.fromDate, $scope.toDate, 2);
          	data.addColumn('number', $scope.currentArea.name);
          }

           if(!dateRows) {
		  	$log.error('Reports.visualize: no dateRows created!');
		  	return;
		  }

          angular.forEach($scope.reportData, function(report, index) {
          	tempDate = $filter('date')(new Date(report.date), $scope.dateFormat);
          	$log.log('Reports.visualize: tempate='+tempDate);
          	angular.forEach(dateRows, function(row, index) {
          		var tmpDate2 = $filter('date')(row[0], $scope.dateFormat);
          		$log.log('Reports.visualize: tmpDate2='+tmpDate2);
          		if(tmpDate2 == tempDate) {
          			if($scope.currentArea) {
          				row[1] = report.count;
          			} else {
          				angular.forEach($scope.areas, function(area, index) {
          					if(report.areaName == area.name) {
          						row[area.index+1] = report.count;
          					} else if(!row[area.index+1]){
          						row[area.index+1] = 0;
          					}
          				});
          			}
          			
          		}
          	});
          });
          //add all rows
          data.addRows(dateRows);

        options = {
          title: $scope.currentReport.title,
          hAxis: {title: langService.translate("reports.chart.haxis")}
        };

        if(dateRows.length <= 8) {
	        chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	        chart.draw(data, options);
        } else {
        	chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        	chart.draw(data, options);
        }
        
		}
	}

	/**
	* @private
	* Generates a array of rows based on the date range fromDate - toDate.
	* Used in @see Cloobster.Reports.visualize
    * @param {Date} fromDate
    *	Date to start from
    * @param {Date} toDate
    *	Date to end
    * @param {Number} numberOfColumns
    * 	size of array each row consists of
    * @return
    * 2-dim. array: rows[dayRange][numberOfColumns],
    *	where rows[N][0] is set to the specific day of this range
	*/
	function generateRowsArray(fromDate, toDate, numberOfColumns) {
		var rows = [],
			arr,
			from,
			to;

		if(!fromDate) {
			return;
		}

		if(!toDate) {
			return;
		}

		if(fromDate > toDate) {
			$log.log('Reports.generateRowsArray: fromDate must not be greater than toDate').
			return;
		}

		from = new Date(fromDate.getTime());
		to = new Date(toDate.getTime());

		while(from <= to) {
			arr = new Array(numberOfColumns);
			arr[0] = new Date(from);
			rows.push(arr);
			from.setDate(from.getDate() + 1);
		}

		return rows;
	}

	/**
	* @private
	* Init the from and to date fields.
	* fromDate = today
	* startDate = today - 7 days
	*/
	function initDates() {
		var toDate = new Date(),
			fromDate = new Date();

		$scope.toDate = toDate;
		//show last week
		fromDate.setDate(fromDate.getDate() - 7);
		$scope.fromDate = fromDate;
	}

	/** 
	 * Watches loggedIn status and initializes controller when status changes to true.
	 */
	$scope.$watch('loggedIn', function(newValue, oldValue) {
		var businessId = $routeParams.businessId || "";

		if(newValue == true && businessId) {
			activeBusinessId = businessId;
			initDates();
			$scope.loadAreas(businessId);
		} else if(newValue == false) {
			$location.url('/');
		}
	});
}
Cloobster.Reports.$inject = ['$scope', '$http', '$routeParams', '$location', '$filter', 'login', 'lang', '$log', 'errorHandler', 'InfoPage', 'Business', 'langcodes', 'Area'];
