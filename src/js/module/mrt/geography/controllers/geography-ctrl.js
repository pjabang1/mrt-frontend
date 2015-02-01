angular.module('MRT').controller('GeographyCtrl', ['$scope', '$filter', 'ngTableParams', 'geographyService', function($scope, $filter, ngTableParams, geographyService) {

		$scope.data = {};
		$scope.data.geographies = [];
		$scope.data.tableData = [];


		geographyService.getGeographies($scope.data.params).success(function(data) {

			$scope.data.geographies = data.geographies;


		}).error(function(error) {
			$scope.status = 'Unable to load customer data: ' + error.message;

		});
		$scope.tableParams = new ngTableParams({
			page: 1, // show first page
			count: 10, // count per page
			filter: {
				name: ''       // initial filter
			}
		}, {
			total: $scope.data.geographies.length, // length of data
			getData: function($defer, params) {
				// use build-in angular filter
				var orderedData = params.filter() ?
						$filter('filter')($scope.data.geographies, params.filter()) :
						$scope.data.geographies;
				$scope.data.tableData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
				params.total(orderedData.length); // set total for recalc pagination
				$defer.resolve($scope.data.tableData);
			}
		});
	}]);