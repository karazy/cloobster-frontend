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
Cloobster.filters.filter('mSCFF', ['$locale', '$log', 'lang', function($locale, $log, langService) {

	/**
	*	
	*/
	function formatMaxSpotCount(maxSpotCount, basic) {
		var formated = maxSpotCount;

		if(basic) {
			formated = "1";
		} else if(maxSpotCount == 0) {
			formated = langService.translate('business.detail.subscription.unlimited');
		} 

		return formated;
	};

  	return function(maxSpotCount, basic) {
  		return formatMaxSpotCount(maxSpotCount, basic);
  	};

}]);