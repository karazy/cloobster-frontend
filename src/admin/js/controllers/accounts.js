/* Cloobster namespace. Create if not exists.*/
window.CloobsterAdmin =  window.CloobsterAdmin || {};

CloobsterAdmin.Accounts = function($rootScope, $scope, $http, Account) {
	$rootScope.accounts = Account.query();

	$scope.createNewAccount = function() {
		$scope.newAccount = new Account();
		$scope.passwordRepeat = "";

	}
	
	$scope.saveNewAccount = function() {
		if(!$scope.newAccount)
			return;
		$scope.saveNewAccount.disabled = true;
		$scope.newAccount.$save(null, function() {
			//succcess callback
			$scope.saveNewAccount.disabled = false;
			$rootScope.accounts.push($scope.newAccount);
			$('#newAccountModal').modal('hide');
		}, function(response) {
			// error callback
			setError(response.data['message']);	
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

	/*
	* Get css class for field highlighting.
	* @returns error if dirty && invalid
	*		  sucess if dirty && !invalid
	*         empty string otherwise
	*/
	$scope.getFieldInputClass = function(dirty, invalid) {
		if(dirty && invalid) {
			return "error";
		} else if (dirty && !invalid) {
			return "success";
		} else {
			return "";
		}
	};

		/**
	* Checks if in registration form controller password and password repeat field match.
	* If they don't match sets the password repeat field as invalid.
	*/
	$scope.matchPasswords = function() {
		if($scope.createAccountForm.password.$viewValue !== $scope.createAccountForm.passwordRepeat.$viewValue) {
			$scope.createAccountForm.passwordRepeat.$setValidity("match", false);
		} else {
			$scope.createAccountForm.passwordRepeat.$setValidity("match", true);
		}
	}

	function setError(message) {
		$scope.alert.show("alert-error", "Error!", message);
	}
}
CloobsterAdmin.Accounts.$inject = ['$rootScope','$scope', '$http', 'Account'];
