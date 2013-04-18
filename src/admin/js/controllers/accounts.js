/* Cloobster namespace. Create if not exists.*/
window.CloobsterAdmin =  window.CloobsterAdmin || {};

CloobsterAdmin.Accounts = function($rootScope, $scope, $http, Account) {
	$rootScope.accounts = Account.query();

	$scope.createNewAccount = function() {
		$scope.newAccount = new Account();
	}
	
	$scope.saveNewAccount = function() {
		if(!$scope.newAccount)
			return;
		$scope.saveNewAccount.disabled = true;
		$scope.saveNewAccount.error = null;
		$scope.newAccount.$save(null, function() {
			//succcess callback
			$scope.saveNewAccount.disabled = false;
		}, function(data, status) {
			// error callback
			$scope.saveNewAccount.error = data;
			$scope.saveNewAccount.disabled = false;
		});
	};

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
CloobsterAdmin.Accounts.$inject = ['$rootScope','$scope', '$http', 'Account'];
