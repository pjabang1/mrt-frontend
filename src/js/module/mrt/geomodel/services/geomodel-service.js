angular.module('MRT')
        .factory('geoModelService', ['$http', 'env', function($http, env) {


        var urlBase = env.apiUrl;
        var dataFactory = {};

        dataFactory.list = function(params) {
            return $http.get(urlBase + '/geomodel/', {
                params: params
            });
        };

        dataFactory.getValues = function(params) {
            return $http.get(urlBase + '/geomodel/values', {
                params: params
            });
        };

        dataFactory.new = function(params) {
            return $http.get(urlBase + '/geomodel/new', {
                params: params
            });
        };
        
        dataFactory.replace = function(data) {
            return $http.put(urlBase + '/geomodel/replace', data);
        };

        dataFactory.getIndicators = function(params) {
            return $http.get(urlBase + '/geomodel/indicators', {
                params: params
            });
        };

        

        return dataFactory;
    }]);