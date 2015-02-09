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

        dataFactory.getIndicators = function(params) {
            return $http.get(urlBase + '/geomodel/indicators', {
                params: params
            });
        };

        dataFactory.getFundSectors = function(fund) {
            return $http.get(urlBase + '/fund/sectors', {
                params: {fund: fund}
            });
        };

        dataFactory.getFundCountries = function(fund) {
            return $http.get(urlBase + '/fund/countries', {
                params: {fund: fund}
            });
        };

        dataFactory.getFunds = function() {
            return $http.get(urlBase + '/fund/funds');
        };



        dataFactory.listCountries = function() {
            return $http.get(urlBase);
        };

        dataFactory.listSectors = function() {
            return $http.get(urlBase);
        };

        dataFactory.listFundTypes = function() {
            return $http.get(urlBase);
        };

        dataFactory.listFundcategories = function() {
            return $http.get(urlBase);
        };


        return dataFactory;
    }]);