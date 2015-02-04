angular.module('MRT').controller('GeoIndicatorCtrl', ['$scope', '$filter', 'ngTableParams', 'geoIndicatorService', function($scope, $filter, ngTableParams, geoIndicatorService) {

        $scope.data = {};
        $scope.data.geoindicators = [];
        $scope.data.response = [];
        var data = [];


        geoIndicatorService.getGeoIndicators().success(function(data) {

            $scope.data.geoindicators = data.geoindicators;

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });


    }]);