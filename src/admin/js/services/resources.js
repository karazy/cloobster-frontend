
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