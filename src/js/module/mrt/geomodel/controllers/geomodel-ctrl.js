angular.module('MRT').controller('GeoModelCtrl', ['$scope', '$filter', 'geoModelService', 'geoGroupService', function($scope, $filter, geoModelService, geoGroupService) {
        $scope.data = {weight: 10};
        $scope.response = {};
        $scope.response.geogroups = {data: []};
        $scope.response.geoindicators = {list: []};
        $scope.data.values = {};
        $scope.data.scoreMax = 100;
        $scope.data.indicators = [];
        $scope.data.params = {id: 1, date: 2013};
        $scope.predicate = '-score';


        $scope.getValues = function(model, item) {
            $scope.data.params.geogroup_id = item.id;
            geoModelService.getValues($scope.data.params).success(function(data) {

                $scope.data.values = data;
                $scope.setIndicators();

            }).error(function(error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });
        };

        // get indicators
        geoModelService.getIndicators($scope.data.params).success(function(data) {

            $scope.response.geoindicators.list = data.indicators;

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

        geoGroupService.list().success(function(data) {
            $scope.response.geogroups.data = data.geogroups;

        }).error(function(error) {
            $scope.status = 'Unable to load groups data: ' + error.message;

        });
        $scope.setIndicators = function() {
            // $scope.data.indicators = $scope.data.values.indicators;
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
                    $return += (($scope.data.scoreMax / found[0].value) * weight);
                }
            });
            geography.score = $return;
            return $return;
        }

        $scope.getGeographyIndicator = function(geography, indicator) {
            var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);
            // console.log(found);
            if (found.length) {
                return found[0].value;
            } else {
                return '';
            }
        }

    }]);