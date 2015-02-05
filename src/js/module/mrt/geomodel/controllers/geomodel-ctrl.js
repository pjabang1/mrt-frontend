angular.module('MRT').controller('GeoModelWeightCtrl', ['$scope', '$filter', '$stateParams', 'geoModelService', 'geoGroupService', function($scope, $filter, $stateParams, geoModelService, geoGroupService) {
        $scope.data = {weight: 10};
        $scope.response = {};
        $scope.response.geogroups = {data: []};
        $scope.response.geoindicators = {list: []};
        $scope.response.parameters = {};
        $scope.data.values = {};
        $scope.data.maxGeoScore = 0;
        $scope.data.scoreMax = 100;
        $scope.data.indicators = [];
        $scope.data.clusters = [];
        $scope.data.clusterData = [];
        $scope.data.params = {id: 1, date: 2013};
        $scope.predicate = '-xScore';
        $scope.data.selectedParameterId = '';
        $scope.data.selectedParameter = {};

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
                    if (typeof geographyIngicator.value !== "undefined") {
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
            // console.log($scope.data.clusters);
        };


        $scope.getValues = function() {
            geoModelService.getValues($scope.data.params).success(function(data) {

                $scope.data.values = data;
                $scope.setIndicators();
                $scope.setMinMaxValues();
                $scope.updateScores();
                // $scope.setClusterData();


            }).error(function(error) {
                $scope.status = 'Unable to load customer data: ' + error.message;

            });
        };
        
        $scope.getParameterByAxis = function(axis) {
            if (typeof axis !== "undefined") {

                var parameter = $filter('filter')($scope.response.parameters, {axis: axis}, true);
                if (parameter.length) {
                   return parameter[0];

                }

            }
            return {};
        };

        $scope.setSelectedParameter = function(id) {
            if (typeof id !== "undefined") {
                id = id.toString();
                $scope.data.selectedParameterId = id;
                var parameter = $filter('filter')($scope.response.parameters, {id: id}, true);
                if (parameter.length) {
                    $scope.data.selectedParameter = parameter[0];
                    return $scope.data.selectedParameter;
                }

            }
            return null;
        };


        $scope.selectParameters = function(id) {

            if ($scope.setSelectedParameter(id) !== null) {
                $scope.predicate = '-' + $scope.getParameterAxis(id) + 'Score';
                //$scope.predicate = '-xScore';
                // $scope.data.selectedParameter = 
                angular.forEach($scope.response.geoindicators.list, function(indicator, key) {
                    if (indicator.parameter_id === id) {
                        indicator.selected = true;
                    } else {
                        indicator.selected = false;
                    }
                });
            }
        };

        // get indicators
        geoModelService.getIndicators($scope.data.params).success(function(data) {

            $scope.response.geoindicators.list = data.indicators;
            $scope.response.parameters = data.parameters;
            angular.forEach($scope.response.parameters, function(parameter, key) {
                parameter.id = parameter.id.toString();
            });

            $scope.selectParameters($scope.response.parameters[0].id);
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

        $scope.setMinMaxValues = function() {
            // $scope.data.indicators = $scope.data.values.indicators;
            angular.forEach($scope.response.geoindicators.list, function(indicator, key) {
                indicator.minimumValue = null;
                indicator.maximumValue = null;
                // set minimum and maximum values
                angular.forEach($scope.data.values.geographies, function(geography, key) {
                    var geographyIndicator = $scope.getGeographyIndicator(geography, indicator);
                    if (typeof geographyIndicator.value !== "undefined") {
                        if (indicator.minimumValue === null || geographyIndicator.value < indicator.minimumValue) {
                            indicator.minimumValue = geographyIndicator.value;
                        }
                        if (indicator.maximumValue === null || geographyIndicator.value > indicator.maximumValue) {
                            indicator.maximumValue = geographyIndicator.value;
                        }

                    }
                });
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


        $scope.toggleRelevanceSort = function(indicator) {
            indicator.relevance_sort = indicator.relevance_sort === 'ASC' ? 'DESC' : 'ASC';
            $scope.updateScores();
        };

        $scope.getRelevanceSortDescription = function(indicator) {
            return indicator.relevance_sort === 'ASC' ? 'Low To High' : 'High To Low';
        };



        $scope.getParameterAxis = function(id) {
            if (typeof id !== "undefined") {
                id = id.toString();
                var parameter = $filter('filter')($scope.response.parameters, {id: id}, true);
                if (parameter.length) {
                    // console.log(parameter[0].axis.toLowerCase());
                    return parameter[0].axis.toLowerCase();

                }
            }
            return '';
        };


        $scope.geGeoSelectedParameterScore = function(geography) {
            var key = $scope.getParameterAxis($scope.data.selectedParameterId) + 'Score';
            return geography[key];
        };

        $scope.geGeoParameterScore = function() {

        };

        $scope.updateScores = function() {
            var x = 3;
            var y = 3;
            angular.forEach($scope.response.parameters, function(parameter, key) {
                parameter.maxScore = 0;
                parameter.minScore = 0;
                var axis = $scope.getParameterAxis(parameter.id);
                var factor = (axis === 'x') ? x : y;
                var maxScore = 0;
                angular.forEach($scope.data.values.geographies, function(geography, key) {
                    var score = $scope.calculateGeographyScore(geography, parameter.id);

                    if (score < parameter.minScore) {
                        parameter.minScore = score;
                    }
                    if (score > parameter.maxScore) {
                        parameter.maxScore = score;
                    }

                    if (score > maxScore) {
                        maxScore = score;
                    }
                });
                
                // console.log("max score : " + maxScore);

                angular.forEach($scope.data.values.geographies, function(geography, key) {

                    var axisKey = axis + 'Axis';
                    var scoreKey = axis + 'Score';
                    var boundry = maxScore / factor;
                    for (i = 1; i <= factor; i++) {
                        var topBoundary = (boundry * i);
                        if(i === factor) {
                            topBoundary = maxScore;
                        }
                        if (geography[scoreKey] <= topBoundary && geography[scoreKey] >= (boundry * (i - 1))) {
                            geography[axisKey] = i;
                            // break;
                        }
                    }

                });
            });
            // console.log($scope.data.values.geographies);
            // console.log($scope.response.parameters);
        };

        $scope.calculateGeographyScore = function(geography, parameter_id) {

            var $return = 0;
            var indicators = $filter('filter')($scope.response.geoindicators.list, {parameter_id: parameter_id}, true);
            var per = indicators.length * this.data.values.settings.max_weight;
            var parameterAxis = $scope.getParameterAxis(parameter_id);
            var scoreKey = parameterAxis + 'Score';
            angular.forEach(indicators, function(indicator, key) {
                var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);
                // console.log(indicator);
                if (found.length) {
                    var weight = ((indicator.weight / per) * 100);
                    // $return = indicator.weight;
                    // found[0].score = (($scope.data.scoreMax / found[0].value) * weight);
                    if (indicator.relevance_sort === 'ASC') {
                        found[0][scoreKey] = ((indicator.minimumValue / found[0].value) * weight);
                    } else {
                        found[0][scoreKey] = ((found[0].value / indicator.maximumValue) * weight);
                    }

                    if (found[0][scoreKey] > indicator.maxScore) {
                        indicator.max = found[0][scoreKey];
                        indicator.maxScore = found[0][scoreKey];
                    }
                    $return += found[0][scoreKey];
                }
            });


            geography[scoreKey] = $return;
            return $return;
        };

        $scope.getScore = function(geography, parameter_id) {
            return 0;
            if (typeof parameter_id === "undefined") {
                parameter_id = $scope.data.selectedParameterId;
            }
            var $return = 0;
            var per = $scope.response.geoindicators.list.length * this.data.values.settings.max_weight;
            angular.forEach($scope.response.geoindicators.list, function(indicator, key) {
                if (indicator.selected === true) {
                    var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);
                    // console.log(indicator);
                    if (found.length) {
                        var weight = ((indicator.weight / per) * 100);
                        // $return = indicator.weight;
                        // found[0].score = (($scope.data.scoreMax / found[0].value) * weight);
                        if (indicator.relevance_sort === 'ASC') {
                            found[0].score = ((indicator.minimumValue / found[0].value) * weight);
                        } else {
                            found[0].score = ((found[0].value / indicator.maximumValue) * weight);
                        }

                        if (found[0].score > indicator.maxScore) {
                            indicator.max = found[0].value;
                            indicator.maxScore = found[0].score;
                        }
                        $return += found[0].score;
                    }
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

            if (found.length) {
                return found[0];
            } else {
                return {};
            }
        };

        $scope.getSelectedScore = function(i) {
            var axis = $scope.getParameterAxis(i.parameter_id);
            if (axis !== null) {
                return (typeof i[axis + 'Score']) !== "undefined" ? i[axis + 'Score'] : 0;
            }
            return 0;
        };

        $scope.getSelectedGeographyIndicator = function(geography, indicator) {
            // add parameter id selector
            var found = $filter('filter')(geography.indicators, {geography_id: geography.id, geoindicator_id: indicator.id}, true);

            if (found.length) {
                return found[0];
            } else {
                return {};
            }
        }

    }]).controller('GeoModelCtrl', ['$scope', '$filter', 'geoModelService', 'geoGroupService', function($scope, $filter, geoModelService, geoGroupService) {
        $scope.data = {};
        geoModelService.list($scope.data.params).success(function(data) {
            $scope.data.geomodels = data.geomodels;

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

    }]);