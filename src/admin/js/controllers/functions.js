CloobsterAdmin.Functions = function($scope, $http) {
	$scope.deleteFunctionsDisabled = (Karazy.environment == "dev")? false : true;
	$scope.confirmDeleteAllDisabled = false;
	$scope.confirmDeleteLiveDisabled = false;

	$scope.deleteAllData = function() {
		$scope.confirmDeleteAllText = "Deleting ...";
		$scope.confirmDeleteAllDisabled = true;
		$http['delete']('/admin/s/datastore/all').success(function() {
				$scope.confirmDeleteAllText = "All data deleted.";
			}).error(function (data, status) {
				$scope.confirmDeleteAllText = status + " error.";
			});
	};

	$scope.deleteLiveData = function() {
		$scope.confirmDeleteLiveText = "Deleting ...";
		$scope.confirmDeleteLiveDisabled = true;
		$http['delete']('/admin/s/datastore/live').success(function() {
				$scope.confirmDeleteLiveText = "Live data deleted.";
			}).error(function (data, status) {
				$scope.confirmDeleteLiveText = status + " error.";
			});
	};

	$scope.createDashboards = function() {
		$scope.createDashboards.text = "Upgrading ...";
		$scope.createDashboards.disabled = true;
		$http.put('/admin/s/dataupgrades/defaultdashboards', {}).success(function(data) {
				$scope.createDashboards.text = "Task started.";
			}).error(function (data, status) {
				$scope.createDashboards.text = status + " error.";
			});	
	};

	$scope.upgradeLocations = function() {
		$scope.upgradeLocationsText = "Upgrading ...";
		$scope.upgradeLocationsDisabled = true;
		$http.put('/admin/s/dataupgrades/subscriptionandwelcome', {}).success(function(data) {
				$scope.upgradeLocationsText = data['entityCount'] + " Locations updated.";
			}).error(function (data, status) {
				$scope.upgradeLocationsText = status + " error.";
			});	
	};

	$scope.upgradeAreas = function() {
		$scope.upgradeAreas.text = "Upgrading ...";
		$scope.upgradeAreas.disabled = true;
		$http.put('/admin/s/dataupgrades/masterspots', {}).success(function(data) {
				$scope.upgradeAreas.text = data['entityCount'] + " Locations updated.";
			}).error(function (data, status) {
				$scope.upgradeAreas.text = status + " error.";
			});	
	};

	$scope.createTestData = function() {
		$scope.createTestDataText = "Creating ...";
		$scope.createTestDataDisabled = true;
		$http.post('/admin/s/testdata', {}).success(function(data) {
				$scope.createTestDataText = "Data created.";
			}).error(function (data, status) {
				$scope.createTestDataText = status + " error.";
			});	
	};

	$scope.deleteTestData = function() {
		$scope.deleteTestDataText = "Deleting ...";
		$scope.deleteTestDataDisabled = true;
		$http['delete']('/admin/s/testdata', {}).success(function(data) {
				$scope.deleteTestDataText = "Data deleted.";
			}).error(function (data, status) {
				$scope.deleteTestDataText = status + " error.";
			});	
	};

	$scope.sendCockpitUpdateMessage = function() {
		$scope.sendCockpitUpdateMessageText = "Creating ...";
		$scope.sendCockpitUpdateMessageDisabled = true;
		$http.post('/admin/s/channels/messages', {'type':'application', 'action': 'update'}).success(function() {
				$scope.sendCockpitUpdateMessageText = "Message sent.";
			}).error(function (data, status) {
				$scope.sendCockpitUpdateMessageText = status + " error.";
			});	
	};
}

CloobsterAdmin.Functions.$inject = ['$scope', '$http'];
