angular.module('MRT')
		.factory('geoindicatorService', ['$http', 'env', function($http, env) {


				var urlBase = env.apiUrl;
				var dataFactory = {};

				dataFactory.getGeoindicators = function(params) {
					return $http.get(urlBase + '/geoindicator/', {
						params: params
					});
				};


				return dataFactory;
			}]);