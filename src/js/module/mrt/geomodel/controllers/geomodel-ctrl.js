angular.module('MRT').controller('GeoModelCtrl', ['$scope', 'geoModelService', function($scope, geoModelService) {
        $scope.data = {};
        $scope.data.values = {};
        $scope.data.indicators = {};

        geoModelService.getValues(1).success(function(data) {

            $scope.data.values = data;
            // alert('call' + 1);
            // console.log($scope.data.indicators);

        }).error(function(error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
            
        });


    }]);