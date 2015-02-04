angular.module('MRT')
        .factory('geoIndicatorGroupService', ['$http', 'env', function($http, env) {

        var urlBase = env.apiUrl;

        var dataFactory = {
            data: {
                geoindicatorgroups: []
            }
        };


        dataFactory.list = function(params) {
            return $http.get(urlBase + '/geoindicatorgroup/', {
                params: params
            });
        };

        dataFactory.getIndicators = function(params) {
            return $http.get(urlBase + '/geoindicatorgroup/indicators', {
                params: params
            });
        };
        
        dataFactory.replace = function(data) {
            return $http.put(urlBase + '/geoindicatorgroup/indicators/replace', data);
        };



        return dataFactory;
    }]);