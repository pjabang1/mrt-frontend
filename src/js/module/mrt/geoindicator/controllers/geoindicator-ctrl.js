angular.module('MRT').controller('GeoindicatorCtrl', ['$scope', '$filter', 'ngTableParams', 'geoindicatorService', function($scope, $filter, ngTableParams, geoindicatorService) {

	$scope.data = {};
	$scope.data.geoindicators = [];
	$scope.data.response = [];
	var data = [];


		geoindicatorService.getGeoindicators().success(function(data) {

			$scope.data.response = data.geoindicators;
			
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
			total: data.geoindicators, // length of data
			getData: function($defer, params) {
				// use build-in angular filter
            var orderedData = params.filter() ?
                   $filter('filter')($scope.data.response, params.filter()) :
                   $scope.data.response;
            $scope.data.geoindicators = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
            params.total(orderedData.length); // set total for recalc pagination
            $defer.resolve($scope.data.geoindicators); 
			}
		});
	}]);