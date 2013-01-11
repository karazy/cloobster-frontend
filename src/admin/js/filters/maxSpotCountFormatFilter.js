CloobsterAdmin.filters = angular.module('CloobsterAdmin.filters', ['CloobsterAdmin.services']);

/**
* mSCFF = max spot count format filter
* @param maxSpotCount
*	Number of maximum spots
* @param basic
*	true if basic package
* @return
*	1 if package is basic
*	unlimited if package not basic and maxSpotCount = 0
*	maxSpotCount it not basic and greater 0
*/
CloobsterAdmin.filters.filter('mSCFF', ['$locale', '$log', function($locale, $log) {

	/**
	*	
	*/
	function formatMaxSpotCount(maxSpotCount, basic) {
		var formated = maxSpotCount;

		if(basic) {
			formated = "1";
		} else if(maxSpotCount == 0) {
			formated = "unlimited";
		}

		return formated;
	};

  	return function(maxSpotCount, basic) {
  		return formatMaxSpotCount(maxSpotCount, basic);
  	};

}]);