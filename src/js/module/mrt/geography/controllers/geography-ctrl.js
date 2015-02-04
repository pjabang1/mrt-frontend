angular.module('MRT').controller('GeographyCtrl', ['$scope', '$filter', 'ngTableParams', 'geographyService', function($scope, $filter, ngTableParams, geographyService) {

        $scope.data = {};
        $scope.data.geographies = [];
        $scope.data.tableData = [];


        geographyService.getGeographies($scope.data.params).success(function(data) {

            $scope.data.geographies = data.geographies;


        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;

        });

    }]);