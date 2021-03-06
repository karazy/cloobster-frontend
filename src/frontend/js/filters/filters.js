Cloobster.filters = angular.module('Cloobster.filters', ['Cloobster.services']);

Cloobster.filters.filter('kcurrency', ['$locale', '$log','config', function($locale, $log, config) {
	//angular style. formatNumber is private in angular lib
	// var EUR = {
 //        DECIMAL_SEP: ',',
 //        GROUP_SEP: '.',
 //        PATTERNS: [
	// 		{ //Currency Pattern
	//             minInt: 1,
	//             minFrac: 2,
	//             maxFrac: 2,
	//             posPre: '\u00A4',
	//             posSuf: '',
	//             negPre: '(\u00A4',
	//             negSuf: ')',
	//             gSize: 3,
	//             lgSize: 3
 //          	}
 //        ],
 //        CURRENCY_SYM: 'karazy'
 //      }

	// var formats = EUR || $locale.NUMBER_FORMATS;
 //  	return function(amount, currencySymbol){
	//     if (isUndefined(currencySymbol)) currencySymbol = formats.CURRENCY_SYM;
	//     return formatNumber(amount, formats.PATTERNS[0], formats.GROUP_SEP, formats.DECIMAL_SEP, 2).
	//                 replace(/\u00A4/g, currencySymbol);
 //  	};

 	//Define currency formats for supported cloobster currencies
  	var currencyFormats = config['currencyFormats'];
	var priceRegExp = config['priceRegExp'];

	/**
	*	Takes a price and formats it in the configured currency
	*	@param price
	*		price to format
	*/
	function formatPrice(price, currency) {
		var fixedPrice,
			matcher = currencyFormats[currency] || currencyFormats['EUR'],
			formattedPrice = "";

		if(!price && price == null) {
			return;
		}				

		try {
			if(typeof price == 'number') {
				fixedPrice = price.toFixed(2);
				formattedPrice = fixedPrice.replace(priceRegExp, matcher);	
			}			
		} catch(e) {
			$log.log('price formatting failed reason:' + e);
		}


		return (formattedPrice != "") ? formattedPrice : price;
	};

  	return function(price, currency) {
  		return formatPrice(price, currency);
  	};

}]);