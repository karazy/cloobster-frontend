
CloobsterAdmin.module.factory('Subscription', ['$resource', function($resource) {

	return $resource('/admin/m/subscriptions/:id',
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

	return $resource('/admin/m/companies/:id',
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

	return $resource('/admin/m/locations/:id',
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

	return $resource('/admin/m/locations/:bid/subscriptions/:id',
		{
			'id': '@id',
			'bid' : '@businessId'
		},
		//methods
		{
			'query':  {method:'GET', isArray:true},
			'update': {method: 'PUT'}
		});

}]);

CloobsterAdmin.module.factory('User', ['$resource', function($resource) {

	return $resource('/admin/user/:id',
		{
			'id': '@id'
		}
	);

}]);

CloobsterAdmin.module.factory('Template', ['$resource', function($resource){
    return $resource('/admin/s/templates/:id',
      {
        'id': '@id'
      },
      {
        save: {method:'PUT'},
        init: {method:'POST', isArray: true}
      }
    );
}]);

CloobsterAdmin.module.factory('TrashEntry', ['$resource', function($resource){
    return $resource('/admin/s/trash/:id',
      {
        'id': '@id'
      },
      {
        restore: {method:'DELETE', params: {'restore':'true'}}
      }
    );
}]);
