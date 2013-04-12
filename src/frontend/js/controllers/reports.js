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
		},
		{	
			title: langService.translate("reports.type.turnover") || "Turnover",
			type: 'turnover'
		},
		{	
			title: langService.translate("reports.type.feedbackreport") || "Feedback Report",
			type: 'feedbackreport'
		}
	];
	/** The current selected report type */
	$scope.currentReport = null;
	/** Contains the data of retrieved report. */
	$scope.reportData = null;
	/** Contains the data of retrieved feedback. */
	$scope.feedbackReportData = null;
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
    /** Contains the parameters used to generate the current report. Only used for displaying! */
    $scope.currentReportParameters = null;

    /**
    * Selects a report type.
    * Resets loaded reportData.
    * @param {Object} a report type as defined in $scope.reportTypes
    */
	$scope.selectReportType = function(type) {
		$scope.currentReport = type;		
		$scope.reportData = null;
		$scope.currentReportParameters = null;
		$scope.feedbackReportData = null;

		if(type.type == 'feedbackreport') {
			$http.get('/b/businesses/'+activeBusinessId+'/feedbackforms',{params: {'active': true}}).success(function(data) {
				$scope.selectedFeedbackForm = $scope.activeFeedbackForm = data[0];
			}).error(handleError);
			$http.get('/b/businesses/'+activeBusinessId+'/feedbackforms').success(function(data) {
				$scope.feedbackForms = data;
			}).error(handleError);
		}
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

		//create params object to display in ui
		$scope.currentReportParameters = {
			fromDate: new Date($scope.fromDate),
			toDate: new Date($scope.toDate),
			serviceArea: ($scope.currentArea) ? $scope.currentArea.name.toString() : langService.translate('reports.report.allareas')
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
		    if($scope.reportData.length == 0) {
		    	$scope.reportData = 'noresult';
		    } else {
		    	// Calculate major currency value from returned minor value for turnover
		    	if($scope.currentReport.type == 'turnover') {
		    		for (var i = $scope.reportData.length - 1; i >= 0; i--) {
		    			if($scope.reportData[i].count != 0)
		    				$scope.reportData[i].count = $scope.reportData[i].count / 100;
		    		}	
		    	}		    	
		    	$scope.visualize();	
		    }
		    
		  })
		  .error(handleError);
	}

	function calculateAverageFeedbackRatings() {
		if(!$scope.feedbackReportData || $scope.feedbackReportData.length == 0) 
			return;
		var ratingSums = [];

		// init sum array with zeroes
		for (var i = $scope.selectedFeedbackForm.questions.length - 1; i >= 0; i--) {
			ratingSums[i] = 0;
		};

		$scope.averageFeedbackRatings = [];
		// sum up all ratings
		for (var i = $scope.feedbackReportData.length - 1; i >= 0; i--) {
			for (var j = $scope.feedbackReportData[i].answers.length - 1; j >= 0; j--) {
				ratingSums[j] += $scope.feedbackReportData[i].answers[j].rating;
			};
		};

		// divide by total
		for (var i = ratingSums.length - 1; i >= 0; i--) {
			$scope.averageFeedbackRatings[i] = ratingSums[i] / $scope.feedbackReportData.length;
		};
	};

	/**
	* Load feedback data from server. Store it in $scope.feedbackReportData.
	* /b/businesses/{id}/feedback?formId=X&fromDate=1&toDate=2
	*/
	$scope.loadFeedbackReport = function() {
		var params = {},
			toDateFullDay;

		if(!$scope.showAllData) {
			//use full day 23:59:59:9999 since feedback gets stored with timestamp
			toDateFullDay = new Date($scope.toDate.getTime());
			toDateFullDay.setHours(23);
			toDateFullDay.setMinutes(59, 59, 999);


			//create params object to display in ui
			if($scope.fromDate) {
				params.fromDate = $scope.fromDate.getTime();
			}
			if($scope.toDate) {
				params.toDate = toDateFullDay.getTime();
			}

			//create params object to display in ui
			$scope.currentReportParameters = {
				fromDate: new Date($scope.fromDate),
				toDate: new Date(toDateFullDay.getTime()),
				showAllData: false
			}
		}
		else {
			$scope.currentReportParameters = {showAllData: true};	
		}
		
		$http({
			method: 'GET', 
			url: '/b/businesses/'+activeBusinessId+'/feedback',
			params: params
		})
		  .success(function(data, status, headers, config) {

		    $scope.feedbackReportData = data;
		    calculateAverageFeedbackRatings();

		    $scope.visualizeFeedback();
		  })
		  .error(handleError);
	};

	/**
	* Send create document request.
	*
	*	@param {Array.<Object>} data Array of report objects
	*/
	function postDocument (data) {
		var newDocument = {
			name: $scope.currentReport.type + ' Report',
			type: 'xls',
			entity: 'net.eatsense.counter.Counter',
			representation: 'report'
		};

		newDocument.names = [];

		for (var i = data.length - 1; i >= 0; i--) {
			newDocument.names.push(data[i].id);
		}

		$http.post('/b/businesses/'+activeBusinessId+'/documents', newDocument)
			.success(function() {
				$log.info('Success posting document.');
				$scope.exportRequested = true;
			})
			.error(handleError);
	}

	/**
	* Send request to generate document based on the selected data.
	*/
	$scope.generateReport = function() {
		var areaId = ($scope.currentArea) ? $scope.currentArea.id : 0;

		if(!$scope.currentReport) {
			$log.error("Reports.generateReport: no currentReport exists");
			return;
		}

		if(!$scope.fromDate) {
			$log.error("Reports.generateReport: no fromDate exists");
			return;
		}

		if(!$scope.toDate) {
			$log.error("Reports.generateReport: no toDate exists");
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
		    if(data.length == 0) {
		    	$scope.reportData = 'noresult';
		    	$scope.exportError = true;
		    } else {
		    	postDocument(data);
		    }
		    
		  })
		  .error(handleError);	
	};

	/**
	* Switch to Documents partial.
	*/
	$scope.gotoDocuments = function() {
		$scope.resetExportStatus();
		$location.url('/businesses/'+activeBusinessId+'/documents');
	};

	/**
	* Reset the Export dialog status.
	*/
	$scope.resetExportStatus = function() {
		$scope.exportRequested = false;
		$scope.exportError = false;
	};

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
	* Draws the report chart based on the report data.
	* Uses google chart api.
	*/
	$scope.visualize = function() {
	  // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart'], callback: drawChart});

  		function drawChart() {

      	var data = new google.visualization.DataTable(),
  	 		options,
		  	chart,
		  	dateRows,
		  	tempDate,
		  	minDate,
		  	maxDate;

          data.addColumn('date', 'Date');

			if(!$scope.currentArea) {
				dateRows = generateRowsArray($scope.fromDate, $scope.toDate, ($scope.areas.length + 1));
				angular.forEach($scope.areas, function(area, index) {
					//add an index to each area
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
		  //for each report entity
          angular.forEach($scope.reportData, function(report, index) {
          	tempDate = $filter('date')(new Date(report.date), $scope.dateFormat);
          	// $log.log('Reports.visualize: tempate='+tempDate);
          	//and for each date row
          	angular.forEach(dateRows, function(row, index) {
          		var tmpDate2 = $filter('date')(row[0], $scope.dateFormat);
          		// $log.log('Reports.visualize: tmpDate2='+tmpDate2);
          		//add the reports counter value to this row if the dates match
          		if(tmpDate2 == tempDate) {
          			if($scope.currentArea) {
          				row[1] = report.count;
          			} else {
          				//overwrite all other fields with 0 except another value already exists
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

        //calculate min max date boundaries, otherwise on colum charts some records are not visible
      	minDate = new Date($scope.fromDate.getTime()),
        maxDate = new Date($scope.toDate.getTime());
		minDate.setDate(minDate.getDate() - 1);
		maxDate.setDate(maxDate.getDate() + 1);

        options = {
          title: $scope.currentReport.title,
          hAxis: {
          	title: langService.translate("reports.chart.haxis"),
          	viewWindowMode:'explicit',
            viewWindow:{
                max: maxDate,
                min: minDate
            }
          }
        };
        //switch between line and column charts
        if(dateRows.length <= 8 || $scope.reportData.length < 8) {
	        chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
	        chart.draw(data, options);
        } else {
        	chart = new google.visualization.LineChart(document.getElementById('chart_div'));
        	chart.draw(data, options);
        }
        
		}
	}

	/**
	* Draws the report chart based on the report data.
	* Uses google chart api.
	*/
	$scope.visualizeFeedback = function() {
	  // Load the Visualization API and the piechart package.
      google.load('visualization', '1.0', {'packages':['corechart'], callback: drawChart});

  		function drawChart() {

      	var data = new google.visualization.DataTable(),
  	 		options,
		  	chart,
		  	dateRows,
		  	feedbackRows,
		  	arraySize,
		  	tempArray,
		  	tempDate,
		  	groupedData,
		  	groupedColumns,
		  	minDate,
		  	maxDate;

          data.addColumn('date', 'Date');
          groupedColumns = new Array();

			if($scope.selectedFeedbackForm && $scope.selectedFeedbackForm.questions && $scope.selectedFeedbackForm.questions.length > 0) {
				// dateRows = generateRowsArray($scope.fromDate, $scope.toDate, ($scope.selectedFeedbackForm.questions.length + 1));
				angular.forEach($scope.selectedFeedbackForm.questions, function(q, index) {
					//add an index to each question
					// q['index'] = index;
					data.addColumn('number', q.question);
					groupedColumns.push({
			  		  	'column': index + 1,
			  		  	'aggregation': google.visualization.data.avg,
			  		  	'type': 'number'
		  		  	});
				});	
          } else {
          	$log.log('Reports.visualizeFeedback: no questions exist')
          	return;
          }

		  arraySize = $scope.selectedFeedbackForm.questions.length + 1;

		  feedbackRows = new Array();		  
		  //create feedback array
		  angular.forEach($scope.feedbackReportData, function(feedback, index) {
		  	tempArray = new Array(arraySize);
		  	tempArray[0] = new Date(feedback.date);
		  	angular.forEach(feedback.answers, function(answer, index) {
		  		//+1 to rating because it starts from 0
		  		tempArray[index + 1] = answer.rating + 1;
		  	});
		  	feedbackRows.push(tempArray);		  	
		  });
		  
		  data.addRows(feedbackRows);

		  groupedData = google.visualization.data.group(data, [
		  {
  		  	column: 0,
  		  	modifier: function(value) {
  		  		var aggregateDate = new Date(value.setHours(0,0,0,0));
  		  		$log.log("Reports.visualizeFeedback: aggregate feedback for " + aggregateDate);
  		  		return aggregateDate;
  		  		// return new Data(value);
  		  	},
  		  	'type': 'date'
  		  }], groupedColumns);

        //calculate min max date boundaries, otherwise on colum charts some records are not visible
      	minDate = new Date($scope.fromDate.getTime()),
        maxDate = new Date($scope.toDate.getTime());
		minDate.setDate(minDate.getDate() - 1);
		maxDate.setDate(maxDate.getDate() + 1);

        options = {
          title: $scope.selectedFeedbackForm.title,
          hAxis: {
          	// title: langService.translate("reports.chart.haxis"),
          	viewWindowMode:'explicit',
            viewWindow:{
                max: maxDate,
                min: minDate
            }
          }
        };
        //switch between line and column charts
        if(feedbackRows.length <= 8 || $scope.feedbackReportData.length < 8) {
	        chart = new google.visualization.ColumnChart(document.getElementById('chart_div_feedback'));
	        chart.draw(groupedData, options);
        } else {
        	chart = new google.visualization.LineChart(document.getElementById('chart_div_feedback'));
        	chart.draw(groupedData, options);
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
			$log.log('Reports.generateRowsArray: fromDate must not be greater than toDate');
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
