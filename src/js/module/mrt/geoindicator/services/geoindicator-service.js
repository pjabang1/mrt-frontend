angular.module('MRT')
		.factory('geoIndicatorService', ['$http', 'env', 'localStorageService', function($http, env, localStorageService) {


				var urlBase = env.apiUrl;
				var dataFactory = {};

				dataFactory.getGeoIndicators = function(params) {
					return $http.get(urlBase + '/geoindicator/', {
						params: params,
						cache: true
					});
				};

                dataFactory.getGeoIndicatorTotals = function(params) {
                    return $http.get(urlBase + '/geoindicator/total/', {
                        params: params,
                        cache: true
                    });
                };

        dataFactory.getGeoIndicatorValues = function(params) {
            return $http.get(urlBase + '/geoindicator/values', {
                params: params,
                cache: true
            });
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