angular.module('MRT')
        .factory('vsModelHydratorService', ['$http', '$filter', 'env', 'localStorageService', function($http, $filter, env, localStorageService) {

        var hydrator = {};

        hydrator.getAxis = function(groups) {
          var axis = {};
          for(var i = 0; i < groups.length; i++) {
            var indicators = groups[i].indicators;
            axis[groups[i].dimension] = {name: '', code: ''};
            if(indicators.length) {
              axis[groups[i].dimension].name = indicators[0].name;
              axis[groups[i].dimension].code = indicators[0].code;
            }
          }
          return axis;
        }

        function getDate(dt) {

          var d = new Date(dt);
            if(d && typeof d.getFullYear !== 'undefined') {
                return d.getFullYear();
            }
            return d;
        }

        hydrator.hydrate = function(data) {

          var values = data.geographies.sort(function (a,b) {return d3.ascending(a.name, b.name);});

          var axis = hydrator.getAxis(data.indicators);
          axis.min = getDate(data.from)-1;
          axis.max = getDate(data.to);

          for(var i = 0; i < values.length; i++) {
            angular.forEach(axis, function(indicator, dimensionKey) {
              values[i][dimensionKey] = getCountryValues(values[i].code, indicator.code, dimensionKey, data.indicators);
            });
          }

          angular.forEach(axis, function(indicator, key) {
						axis[key].maxValue = d3.max(values, function(c) {
								return d3.max(c[key], function(v) { return v[1]; });
						});
						axis[key].minValue = d3.min(values, function(c) {
								return d3.min(c[key], function(v) { return v[1]; });
						});
					});

          return {data: values, axis: axis};

        }


        function filterCountryValues(indicator, countryCode) {
          var values = [];
              if(indicator.geographies.length) {
                var geography = $filter('filter')(indicator.geographies, {code: countryCode}, true);
                if(geography.length) {
                  values = createValueArray(geography[0].values);
                }
              }
          return values;
        }

        function createValueArray(data) {
          var values = [];
          for(var i = 0; i < data.length; i++) {
            var row = data[i];
            if(row.labelType === 'date') {
              if(row.value !== '-') {
                values.push([parseInt(row.label), row.value]);
              }

            }
          }
          return values.sort(function(a,b) { return d3.ascending(a[0], b[0]); })
        }

        function getCountryValues(countryCode, indicatorCode, dimension, groups) {
          var countryValues = [];
          for(var i = 0; i < groups.length; i++) {
            var group = groups[i];
            if(group.dimension === dimension) {
              var indicators = $filter('filter')(group.indicators, {code: indicatorCode}, true);
              if(indicators.length) {
                countryValues = filterCountryValues(indicators[0], countryCode);
              }

            }

          }

          return countryValues;
        }

        return hydrator;
    }]);
