CloobsterAdmin.filters = angular.module('CloobsterAdmin.filters', ['CloobsterAdmin.services']);

/**
*
*/
CloobsterAdmin.filters.filter('mSCFF', ['$locale', '$log', function($locale, $log) {

	/**
	*	
	*/
	function formatMaxSpotCount(maxSpotCount, basic) {
		var formated = maxSpotCount;

		if(basic) {
			formated = "0";
		} else if(maxSpotCount == 0) {
			formated = "unlimited";
		}

		return formated;
	};

  	return function(maxSpotCount, basic) {
  		return formatMaxSpotCount(maxSpotCount, basic);
  	};

}]);