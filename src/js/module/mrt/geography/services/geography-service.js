angular.module('MRT')
		.factory('geographyService', ['$http', 'env', function($http, env) {


				var urlBase = env.apiUrl;
				var dataFactory = {
					geographies: {}
				};

				dataFactory.getGeographies = function(params) {
					return $http.get(urlBase + '/geography/', {
						params: params
					});
				};





				return dataFactory;
			}]);