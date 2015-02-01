angular.module('MRT').controller('GeoModelCtrl', ['$scope', '$filter', 'geoModelService', 'geoGroupService', function($scope, $filter, geoModelService, geoGroupService) {
		$scope.data = {weight: 10};
		$scope.response = {};
		$scope.response.geogroups = {data: []};
		$scope.response.geoindicators = {list: []};
		$scope.data.values = {};
		$scope.data.maxGeoScore = 0;
		$scope.data.scoreMax = 100;
		$scope.data.indicators = [];
		$scope.data.clusters = [];
		$scope.data.clusterData = [];
		$scope.data.params = {id: 1, date: 2013};
		$scope.predicate = '-score';

		$scope.clusterio = new clusterio.KMeans();
		
		$scope.data.dates = [2013, 2012, 2011, 2010];

		$scope.data.params.date = $scope.data.dates[0];
		// Here we are referencing the same object, so Angular inits the select box correctly

		$scope.getIndicatorValues = function(model, item) {
			$scope.data.params.geogroup_id = item.id;
			$scope.getValues();
		};
		
		$scope.getClusterIndicatorValues = function(model, item) {
			$scope.data.params.geogroup_id = item.id;
			$scope.getValues();
		};
		
		$scope.setClusterData = function() {
			$scope.data.clusterData = [];
			angular.forEach($scope.data.values.geographies, function(geography, key) {
				var row = [];
				angular.forEach($scope.response.geoindicators.list, function(indicator, key) {
					var geographyIngicator = $scope.getGeographyIndicator(geography, indicator);
					if(typeof geographyIngicator.value !== "undefined") {
						row.push(geographyIngicator.value);
					} else {
						row.push(null);
					}
				});
				$scope.data.clusterData.push(row);
			});
			
			// $scope.cluster();
			// console.log($scope.data.clusterData);
		};

		$scope.cluster = function() {
			$scope.data.clusters = $scope.clusterio.cluster($scope.data.clusterData, 9);
			console.log($scope.data.clusters);
		};


		$scope.getValues = function() {
			geoModelService.getValues($scope.data.params).success(function(data) {

				$scope.data.values = data;
				$scope.setIndicators();
				$scope.setClusterData();
				

			}).error(function(error) {
				$scope.status = 'Unable to load customer data: ' + error.message;

			});
		};

		// get indicators
		geoModelService.getIndicators($scope.data.params).success(function(data) {

			$scope.response.geoindicators.list = data.indicators;
			$scope.setIndicators();


		}).error(function(error) {
			$scope.status = 'Unable to load customer data: ' + error.message;

		});

		geoGroupService.list().success(function(data) {
			$scope.response.geogroups.data = data.geogroups;


		}).error(function(error) {
			$scope.status = 'Unable to load groups data: ' + error.message;

		});

		$scope.setIndicators = function() {
			$scope.indicatorChanged();
			// $scope.data.indicators = $scope.data.values.indicators;
			angular.forEach($scope.response.geoindicators.list, function(indicator, key) {
				indicator.max = 0;
				indicator.maxScore = 0;
			});
		};
		$scope.indicatorChanged = function(indicator) {
			$scope.data.maxGeoScore = 0;
			if (typeof indicator !== "undefined") {
				indicator.max = 0;
				indicator.maxScore = 0;
			}
			// alert("hey");
		};



		$scope.getScore = function(geography) {
			var $return = 0;
			var per = $scope.response.geoindicators.list.length * this.data.values.settings.max_weight;
			angular.forEach($scope.response.geoindicators.list, function(indicator, key) {

				var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);
				// console.log(indicator);
				if (found.length) {
					var weight = ((indicator.weight / per) * 100);
					// $return = indicator.weight;
					found[0].score = (($scope.data.scoreMax / found[0].value) * weight);

					if (found[0].score > indicator.maxScore) {
						indicator.max = found[0].value;
						indicator.maxScore = found[0].score;
					}
					$return += found[0].score;
				}
			});
			geography.score = $return;
			if (geography.score > $scope.data.maxGeoScore) {
				$scope.data.maxGeoScore = geography.score;
			}

			return $return;
		};

		$scope.getGeographyIndicator = function(geography, indicator) {
			var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);
			// console.log(found);

			if (found.length) {
				return found[0];
			} else {
				return {};
			}
		}

	}]);