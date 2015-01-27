angular.module('MRT').controller('GeoModelCtrl', ['$scope', '$filter', 'geoModelService', function($scope, $filter, geoModelService) {
        $scope.data = {weight: 10};
        $scope.data.values = {};
        $scope.data.scoreMax = 5;
        $scope.data.indicators = [];

        geoModelService.getValues(1).success(function(data) {

            $scope.data.values = data;
            $scope.setIndicators();
            // alert('call' + 1);
            // console.log($scope.data.indicators);

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

        $scope.setIndicators = function() {
            $scope.data.indicators = $scope.data.values.indicators;

        };

        $scope.getScore = function(geography) {
            var $return = 0;
            var per = this.data.values.indicators.length * this.data.values.settings.max_weight;
            angular.forEach(this.data.values.indicators, function(indicator, key) {

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