angular.module('MRT')
        .factory('geoGroupService', ['$http', 'env', function($http, env) {

        var urlBase = env.apiUrl;
        
        var dataFactory = {};

        dataFactory.list = function(params) {
            return $http.get(urlBase + '/geogroup/', {
                params: params
            });
        };



        return dataFactory;
    }]);