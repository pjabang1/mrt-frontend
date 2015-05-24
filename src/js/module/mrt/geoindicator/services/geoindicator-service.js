angular.module('MRT')
.factory('geoIndicatorService', ['$http', 'env', 'localStorageService', 'CacheFactory', function($http, env, localStorageService, CacheFactory) {


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


	return dataFactory;
}]);