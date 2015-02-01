angular.module('MRT').controller('GeoGroupCtrl', ['$scope', '$filter', 'geoGroupService', function($scope, $filter, geoGroupService) {

		$scope.data = {};
		$scope.search = '';
		$scope.data.geogroups = [];

		geoGroupService.list($scope.data.params).success(function(data) {

			$scope.data.geogroups = data.geogroups;

		}).error(function(error) {
			$scope.status = 'Unable to load customer data: ' + error.message;

		});


		$scope.selected = function(item) {
			geoGroupService.data.selected = item;
		};

	}]).controller('GeoGroupViewCtrl', ['$scope', '$filter', '$stateParams', 'geoGroupService', 'geographyService', function($scope, $filter, $stateParams, geoGroupService, geographyService) {
		$scope.data = {};
		$scope.data.geographies = [];
		$scope.data.geogroupgeographies = [];
		$scope.data.geogroup = {name: '', description: ''};
		$scope.data.params = {};
		$scope.data.params.id = $stateParams.id;

		
		geographyService.getGeographies($scope.data.params).success(function(data) {
			$scope.data.geographies = data.geographies;
			$scope.getGeographies();

		}).error(function(error) {
			$scope.status = 'Unable to load customer data: ' + error.message;

		});
		


		$scope.getGeographies = function() {
			geoGroupService.getGeographies($scope.data.params).success(function(data) {

				$scope.data.geogroupgeographies = data.geographies;
				$scope.data.geogroup = data.group;
				// console.log($scope.data.geographies);

				angular.forEach($scope.data.geogroupgeographies, function(geography, key) {
					$scope.select(geography.geography_id);

				});

			}).error(function(error) {
				$scope.status = 'Unable to load customer data: ' + error.message;

			});

			$scope.select = function(id) {
				
				var found = $filter('filter')($scope.data.geographies, {id: parseInt(id)}, true);
				
				if (found.length) {
					// console.log(found);
					found[0].selected = true;
				}
			};

			$scope.deselect = function(id) {

				var found = $filter('filter')($scope.data.geographies, {id: id}, true);

				if (found.length) {
					found[0].selected = false;
				}
			};
		}







	}]);