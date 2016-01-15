angular.module('MRT')
.factory('geoIndicatorService', ['$http', '$filter', 'env', 'localStorageService', 'CacheFactory', function($http, $filter, env, localStorageService, CacheFactory) {


	var urlBase = env.apiUrl;
	var dataFactory = {};

	if (!CacheFactory.get('geoIndicatorsCache')) {
      // or CacheFactory('bookCache', { ... });
      CacheFactory.createCache('geoIndicatorsCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 60 * 60 * 1000,
        storageMode: 'localStorage'
      });
    }

    if (!CacheFactory.get('geoIndicatorTotalCache')) {
      CacheFactory.createCache('geoIndicatorTotalCache', {
        deleteOnExpire: 'aggressive',
        recycleFreq: 60 * 60 * 1000,
        storageMode: 'localStorage'
      });
    }


	var geoIndicatorsCache = CacheFactory.get('geoIndicatorsCache');
	var geoIndicatorTotalCache = CacheFactory.get('geoIndicatorTotalCache');

	dataFactory.getGeoIndicators = function(params) {
		return $http.get(urlBase + '/geoindicator/', {
			// params: params,
			// cache: geoIndicatorsCache
		});
	};


	dataFactory.getGeoIndicatorAverages= function(params) {
		return $http.get(urlBase + '/geoindicator/average/', {
			params: params,
			cache: true
		});
	};

	dataFactory.getGeographyGeoIndicatorAverages= function(params) {
		return $http.get(urlBase + '/geoindicator/geography/average/', {
			params: params,
			cache: true
		});
	};


	dataFactory.getGeoIndicatorTotals = function(params) {
		return $http.get(urlBase + '/geoindicator/total/', {
			params: params,
			// cache: geoIndicatorTotalCache
		});
	};

	dataFactory.getGeoIndicatorValues = function(params) {
		return $http.get(urlBase + '/geoindicator/values', {
			params: params,
			cache: true
		});
	};

	dataFactory.get = function(id) {
		return $http.get(urlBase + '/geoindicator/' + id + '/show', {});
	};

	dataFactory.save = function(data) {
		return $http.post(urlBase + '/geoindicator/create', data);
	};

	dataFactory.update = function(data) {
		return $http.post(urlBase + '/geoindicator/update', data);
	};

	dataFactory.getGeoIndicatorsFromCache = function(params) {
		var key = 'geo_indicator_list';
		var $return = localStorageService.get(key);
		if (typeof $return !== "undefined" && $return.length)  {
			return $return;
		} else {
			dataFactory.getGeoIndicators(params).success(function(data) {
				localStorageService.set(key, data);
				return data;

			}).error(function(error) {
				status = 'Unable to load customer data: ' + error.message;

			});
		}
	};

	dataFactory.hydrateValues = hydrateValues;
	dataFactory.getSummary = getSummary;

	function getValue(values, geoCode, date, key) {
		var found = $filter('filter')(values, {code: geoCode, date: date}, true);
		if(found.length) {
			return Number(found[0][key]);
		}
		return '-';
	}


	function hydrateValues(values, dates, countries) {
		var cache = {};
		$return = [];
		for(var i = 0; i < countries.length; i++) {
			if(typeof cache[countries[i].code] === "undefined") {
				var cp = angular.copy(countries[i]);
				cp.values = [];
				var comp = 0;
				var min = 0;
				var max = 0;
				var exist = 0;
				var sum = 0;
				var average = 0;
				var growth = 0;
				for(var ii = 0; ii < dates.length; ii++) {
					var val = getValue(values, cp.code, dates[ii].date, 'value');
					if(val != '-') {
						// val = parseFloat(val);
						exist++;
						if(val >= max || max == 0) {
							max = val;
						}
						if(val < min || min === 0) {
							min = val;
						}
						sum += val;

					}
					append(cp.values, val, 'date', dates[ii].date);
				}
				comp = exist > 0 && dates.length > 0  ? (exist/(dates.length))*100 : 0;
				average = exist > 0 && dates.length > 0  ? (sum/(exist)) : '-';
				min = exist > 0 && dates.length > 0  ? min : '-';
				max = exist > 0 && dates.length > 0  ? max : '-';
				append(cp.values, comp, 'derived', 'completion', false);
				append(cp.values, min, 'derived', 'minimum');
				append(cp.values, max, 'derived', 'maximum');
				append(cp.values, average, 'derived', 'average');
				$return.push(cp);
				cache[countries[i].code] = true;
			}
		}
		return $return;
	}

	function append(arr, value, labelType, label, selectable) {
		var item = {value : value};
		item.labelType = labelType;
		item.label = label;
		item.type = value === '-' ? 'na' : 'number';
		item.selectable = value === '-' ? false : true;

		if(typeof selectable !== "undefined") {
			item.selectable = selectable;
		}
		if(typeof item.selected === 'undefined' && label === 'average') {
			item.selected = true;
		}
		arr.push(item);
	}

	function getSummary(data) {
		var summary = {};
		var completion = 0;
		for(var i = 0; i < data.length; i++) {
			completion += getIndicatorValue(data[i].values, 'completion');
		}
		summary.completion = completion !== 0 && data.length > 0 ? (completion/data.length) : 0;
		return summary;
	}

	function getIndicatorValue(values, label) {
		var value = 0;
		for(var i = 0; i < values.length; i++) {
			if(values[i].label === label) {
				value = values[i].value;
			}
		}
		return value;
	}


	return dataFactory;
}]);
