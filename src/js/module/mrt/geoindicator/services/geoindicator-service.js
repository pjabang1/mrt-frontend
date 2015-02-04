angular.module('MRT')
        .factory('geoIndicatorService', ['$http', 'env', function($http, env) {


        var urlBase = env.apiUrl;
        var dataFactory = {};

        dataFactory.getGeoIndicators = function(params) {
            return $http.get(urlBase + '/geoindicator/', {
                params: params
            });
        };


        return dataFactory;
    }]);