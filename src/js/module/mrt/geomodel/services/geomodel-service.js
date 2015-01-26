angular.module('MRT')
        .factory('geoModelService', ['$http', function($http) {


        var urlBase = 'http://10.51.130.212/mrt/web/app_dev.php/api';
        var dataFactory = {};

        dataFactory.getValues = function(id) {
            return $http.get(urlBase + '/geomodel/values', {
                params: {id: id}
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