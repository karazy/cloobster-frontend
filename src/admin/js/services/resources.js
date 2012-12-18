
CloobsterAdmin.module.factory('Subscription', ['$resource', function($resource) {

	return $resource('/admin/services/subscriptions/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);


CloobsterAdmin.module.factory('Company', ['$resource', function($resource) {

	return $resource('/admin/services/companies/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});
}]);


CloobsterAdmin.module.factory('Location', ['$resource', function($resource) {

	return $resource('/admin/services/locations/:id',
		{
			'id': '@id'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);

CloobsterAdmin.module.factory('LocationSubscription', ['$resource', function($resource) {

	return $resource('/admin/services/locations/:bid/subscriptions/:id',
		{
			'id': '@id',
			'bid' : '@bid'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);



// CloobsterAdmin.module.factory('Location', ['$resource', function($resource) {

// 	return {
// 		buildResource : function() {
// 			return $resource('/admin/services/locations/:id',
// 				{
// 					'id': '@id'
// 				},
// 				//methods
// 				{
// 					'query':  {method:'GET', isArray:true},
// 					'update': {method: 'PUT'}
// 				});
// 		},

// 		buildSubscriptionResource: function() {
// 			return $resource('/admin/services/locations/:bid/subscription/:id',
// 				{
// 					'id': '@id',
// 					'bid': '@bid'
// 				},
// 				//methods
// 				{
// 					'query':  {method:'GET', isArray:true},
// 					'update': {method: 'PUT'}
// 				});
// 		}
// 	}
	

// }]);
