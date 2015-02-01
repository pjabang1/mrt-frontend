angular.module('MRT')
        .factory('geoGroupService', ['$http', 'env', function($http, env) {

        var urlBase = env.apiUrl;
        
        var dataFactory = {
			data : {
				geogroups: []
			} 
		};
		
		dataFactory.getGeoGroupsData = function() {
			return dataFactory.data.geogroups;
			
		};

        dataFactory.list = function(params) {
            return $http.get(urlBase + '/geogroup/', {
                params: params
            });
        };
		
		dataFactory.getGeographies = function(params) {
            return $http.get(urlBase + '/geogroup/geographies', {
                params: params
            });
        };



        return dataFactory;
    }]);