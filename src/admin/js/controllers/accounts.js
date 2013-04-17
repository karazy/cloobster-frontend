/* Cloobster namespace. Create if not exists.*/
window.CloobsterAdmin =  window.CloobsterAdmin || {};

CloobsterAdmin.Accounts = function($rootScope, $scope, $http) {
	$http.get('admin/m/accounts').success(function(data) {
		 $rootScope.accounts = data;
	});

	$scope.setAccountActive = function(active) {
		var scope = this;
		if(!this.account) {
			return;
		}

		this.account.active = active;
		scope.setAccountActiveProgress = true;
		
		$http.put('admin/m/accounts/'+this.account.id, this.account).success(function() {
			scope.setAccountActiveProgress = false;
		}).error(function() {
			scope.setAccountActiveProgress = false;
			scope.account.active = !active;
		});
	}
}
CloobsterAdmin.Accounts.$inject = ['$rootScope','$scope', '$http'];
