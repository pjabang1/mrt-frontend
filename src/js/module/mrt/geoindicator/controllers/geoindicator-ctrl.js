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
    $scope.data.indicators = [];
    $scope.data.selectedIndicator = [];
    $scope.summary = {};
    $scope.summary.percentageCompletion = 0;
    // $scope.data.selectedDate;
    $scope.data.params = {};

    var countryTotal = 202;


    $scope.data.params.id = $stateParams.id;
    $scope.data.params.date;
    $scope.getValues = getValues;
    $scope.selectIndicator = selectIndicator;

    $scope.chartData = {
        title: {
            text: 'World Population (2015)',
            subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)'
        },
        dataRange: {
            min: 0,
            max: 1000000,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            color: ['#ffce54', '#00bff3', '#EB5367']
        },
        series: [
        {
            name: 'World Population (2010)',
            type: 'map',
            mapType: 'world',
            roam: true,
            mapLocation: {
                y: 60
            },
            itemStyle: {
                emphasis: {label: {show: true}}
            },

            data: [
            {name: 'Afghanistan', value: 28397.812},
            {name: 'Angola', value: 19549.124},
            {name: 'Albania', value: 3150.143}
            ]
        }
        ]
    };


    function getValues($item, $model) {
        // console.log($model);
        if(typeof $model !== "undefined") {
            $scope.data.params.date = $model.date;
        }
        geoIndicatorService.getGeoIndicatorValues($scope.data.params).success(function (data) {
            $scope.data.values = data[0].values;
            $scope.data.indicator = data[0].indicator;
            // console.log($scope.data.values);

            $scope.data.dates = data[0].dates;
            setChartData();

        }).error(function (error) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

    }

    function selectIndicator($item, $model) {
        if(typeof $model !== "undefined") {
            $scope.data.params.id = $model.id;
        }
        getValues();
    }

    geoIndicatorService.getGeoIndicatorTotals().success(function (data) {
        $scope.data.indicators = data.geoindicators;
        angular.forEach($scope.data.indicators, function(value, key) {
            if(parseInt(value.id) === parseInt($scope.data.params.id)) {
                $scope.data.selectedIndicator = value;
            }
        });

    }).error(function (error) {
        $scope.status = 'Unable to load customer data: ' + error.message;
    });

    function setChartData() {
        
        $scope.chartData.title.subtext = $scope.data.indicator.description;
        $scope.chartData.series[0].name = $scope.data.indicator.name;
        
        $scope.chartData.dataRange.min = 0;
        $scope.chartData.dataRange.max = 0;
        $scope.summary = {};
        $scope.summary.percentageCompletion = 0;

        var i = 0;
        angular.forEach($scope.data.values, function(value, key) {
            i++;
            value.value = Number(value.value);
            if($scope.chartData.dataRange.min == 0 || value.value < $scope.chartData.dataRange.min) {
                $scope.chartData.dataRange.min = value.value;
                $scope.summary.min = value;
            } 

            if($scope.chartData.dataRange.max == 0 || value.value > $scope.chartData.dataRange.max) {
                $scope.chartData.dataRange.max = value.value;
                $scope.summary.max = value;
            } 
        });

        if(i > 0) {
            $scope.summary.percentageCompletion = parseInt((i/countryTotal)*100);
        }
        $scope.chartData.series[0].data = $scope.data.values;
        // console.log($scope.data.values);

        $scope.chartData.title.text = $scope.data.indicator.name;
    }




    getValues();



}]);