angular.module('MRT').controller('GeoIndicatorCtrl', ['$scope', '$filter', 'ngTableParams', 'geoIndicatorService', function ($scope, $filter, ngTableParams, geoIndicatorService) {

    $scope.data = {};
    $scope.data.geoindicators = [];
    $scope.data.response = [];
    var data = [];


    geoIndicatorService.getGeoIndicatorTotals().success(function (data) {
        $scope.data.geoindicators = data.geoindicators;

    }).error(function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
    });


}]).controller('GeoIndicatorViewCtrl', ['$scope', '$cacheFactory', '$filter', '$stateParams', 'ngTableParams', 'geoIndicatorService', function ($scope, $cacheFactory, $filter, $stateParams, ngTableParams, geoIndicatorService) {
    $scope.data = {};
    $scope.data.values = [];
    $scope.data.dates = [];
    $scope.data.indicator = {};
    // $scope.data.selectedDate;
    $scope.data.params = {};


    $scope.data.params.id = $stateParams.id;
    $scope.data.params.date;
    $scope.getValues = getValues;


    function getValues($item, $model) {
        console.log($model);
        if(typeof $model !== "undefined") {
            $scope.data.params.date = $model.date;
        }
        geoIndicatorService.getGeoIndicatorValues($scope.data.params).success(function (data) {
            $scope.data.values = data[0].values;
            $scope.data.indicator = data[0].indicator;
            $scope.data.dates = data[0].dates;
        }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

    }

    getValues();



}]);