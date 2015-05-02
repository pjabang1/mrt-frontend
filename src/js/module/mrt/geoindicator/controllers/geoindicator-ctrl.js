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


}]).controller('GeoIndicatorViewCtrl', ['$scope', '$cacheFactory', '$filter', '$stateParams', '$interval', 'ngTableParams', 'geoIndicatorService', function ($scope, $cacheFactory, $filter, $stateParams, $interval, ngTableParams, geoIndicatorService) {
    $scope.data = {};
    $scope.data.values = [];
    $scope.data.dates = [];
    $scope.data.indicator = {};
    $scope.data.indicators = [];
    $scope.data.selectedIndicator = [];
    $scope.summary = {};
    $scope.summary.percentageCompletion = 0;
    
    $scope.data.params = {};

    $scope.data.playing = false;

    var countryTotal = 202;


    $scope.data.params.id = $stateParams.id;
    $scope.data.params.date;
    $scope.getValues = getValues;
    $scope.selectIndicator = selectIndicator;

    $scope.lineChartData_ = {
        color : [
        'rgba(255, 69, 0, 0.5)',
        'rgba(255, 150, 0, 0.5)',
        'rgba(255, 200, 0, 0.5)',
        'rgba(155, 200, 50, 0.5)',
        'rgba(55, 200, 100, 0.5)'
        ],
        title : {
            text: '商业BI类图表',
            subtext: '纯属虚构'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}%"
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        legend: {
            data : ['展现','点击','访问','咨询','订单']
        },
        series : [
        {
            name:'业务指标',
            type:'gauge',
            center: ['25%','55%'],
            splitNumber: 10,       // 分割段数，默认为5
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, '#228b22'],[0.8, '#48b'],[1, '#ff4500']], 
                    width: 8
                }
            },
            axisTick: {            // 坐标轴小标记
                splitNumber: 10,   // 每份split细分多少段
                length :12,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto'
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto'
                }
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                length :30,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: 'auto'
                }
            },
            pointer : {
                width : 5
            },
            title : {
                show : true,
                offsetCenter: [0, '-40%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder'
                }
            },
            detail : {
                formatter:'{value}%',
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontWeight: 'bolder'
                }
            },
            data:[{value: 50, name: '完成率'}]
        },
        {
            name:'预期',
            type:'funnel',
            x: '45%',
            width: '45%',
            itemStyle: {
                normal: {
                    label: {
                        formatter: '{b}预期'
                    },
                    labelLine: {
                        show : false
                    }
                },
                emphasis: {
                    label: {
                        position:'inside',
                        formatter: '{b}预期 : {c}%'
                    }
                }
            },
            data:[
            {value:60, name:'访问'},
            {value:40, name:'咨询'},
            {value:20, name:'订单'},
            {value:80, name:'点击'},
            {value:100, name:'展现'}
            ]
        },
        {
            name:'实际',
            type:'funnel',
            x: '45%',
            width: '45%',
            maxSize: '80%',
            itemStyle: {
                normal: {
                    borderColor: '#fff',
                    borderWidth: 2,
                    label: {
                        position: 'inside',
                        formatter: '{c}%',
                        textStyle: {
                            color: '#fff'
                        }
                    }
                },
                emphasis: {
                    label: {
                        position:'inside',
                        formatter: '{b}实际 : {c}%'
                    }
                }
            },
            data:[
            {value:30, name:'访问'},
            {value:10, name:'咨询'},
            {value:5, name:'订单'},
            {value:50, name:'点击'},
            {value:80, name:'展现'}
            ]
        }
        ]
    };


    $scope.lineChartData = {
                // color: ['rgb(8,48,107)', 'rgb(8,81,156)', 'rgb(66,146,198)', 'rgb(158,202,225)'],
                color: ['#E09100', '#9BC215', '#00BFF3'],
                legend: {// legend configuration 
                    padding: 0, // The inner padding of the legend, in px, defaults to 5. Can be set as array - [top, right, bottom, left].
                    //itemGap: 10, // The pixel gap between each item in the legend. It is horizontal in a legend with horizontal layout, and vertical in a legend with vertical layout. 
                    data: ['Minimum', 'Average', 'Maximum'],
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333',
                        fontFamily: 'Montserrat',
                    }

                },
                tooltip: {// tooltip configuration
                    trigger: 'axis', // trigger type. Defaults to data trigger. Can also be: 'axis'
                },
                textStyle: {
                    fontFamily: 'Montserrat',
                },
                toolbox: {
                    show: true,
                    orient: 'vertical',
                    x: 'right',
                    y: 'center',
                    feature: {
                        restore: {
                            show: true,
                            title: 'Restore',
                        },
                        saveAsImage: {
                            show: true,
                            title: 'Save As Image',
                            type: 'png',
                            lang: ['Language']
                        }
                    }
                },
                axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel

                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333',
                    fontFamily: 'Montserrat',
                }
            },
                xAxis: [// The horizontal axis in Cartesian coordinates
                {
                        type: 'category', // Axis type. xAxis is category axis by default. As for value axis, please refer to the 'yAxis' chapter.
                        data: []
                    }
                    ],
                yAxis: [// The vertical axis in Cartesian coordinates
                {
                        type: 'value', // Axis type. yAxis is value axis by default. As for category axis, please refer to the 'xAxis' chapter.
                        //boundaryGap: [0.1, 0.1], // Blank border on each side of the coordinate axis. Value in the array represents percentage. 
                        splitNumber: 4                      // Applicable to value axis. The number of segments. Defaults to 5. 
                    }
                    ],
                    series: [
                    {
                        name: 'Minimum', // series name
                        type: 'line', // chart type, line, scatter, bar, pie, radar
                        data: []
                    },
                    {
                        name: 'Average', // series name 
                        type: 'line', // chart type, line, scatter, bar, pie, radar
                        // itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: []
                    },
                    {
                        name: 'Maximum', // series name
                        type: 'line', // chart type, line, scatter, bar, pie, radar
                        data: []
                    }
                    ]
                };


                $scope.chartData = {
                    title: {
                        text: 'World Population (2015)',
                        subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333',
                            fontFamily: 'Montserrat',
                        }
                    },
                    nameMap: {
                        'Gambia': 'Gambia, The',
                        'Gambia, The': 'Gambia'
                    },
                    textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                        color: '#333',
                        fontFamily: 'Montserrat',
                    },
                    dataRange: {
                        min: 0,
                        max: 1000000,
                        text: ['High', 'Low'],
                        realtime: false,
                        calculable: true,
                        // color: ['#ffce54', '#00bff3', '#EB5367']
                        color: ['rgb(8,48,107)', 'rgb(8,81,156)', 'rgb(33,113,181)', 'rgb(66,146,198)', 'rgb(107,174,214)', 'rgb(158,202,225)']
                    },
                    series: [
                    {
                        name: 'World Population (2010)',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333',
                            fontFamily: 'Montserrat',
                        },
                        type: 'map',
                        mapType: 'world',
                        roam: true,
                        mapLocation: {
                            y: 60
                        },
                        itemStyle: {
                            emphasis: {label: {show: true}}
                        },
                        geoCoord: {
                            'Gambia': [-16.56666666, 13.46666666]
                        },
                        data: [
                        {name: 'Afghanistan', value: 28397.812},
                        {name: 'Angola', value: 19549.124},
                        {name: 'Albania', value: 3150.143}
                        ]
                    }
                    ]
                };



                $scope.dataCompletionChartData = {
                    tooltip : {
                        formatter: "{b} : {c}%"
                    },
                    toolbox: {
                        show : false,
                        feature : {
                            mark : {show: true},
                            restore : {show: true},
                            saveAsImage : {show: true}
                        }
                    },
                    series : [
                    {
                        name:'Data Completion',
                        textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            color: '#333',
                            fontFamily: 'Montserrat',
                        },
                        type:'gauge',
                        center : ['50%', '50%'],   
                        radius : [0, '75%'],
                        startAngle: 140,
                        endAngle : -140,
                        min: 0,                     
                        max: 100,                   
                        precision: 0,               
                        splitNumber: 10,             
                        axisLine: {            
                            show: true,        
                            lineStyle: {       
                                // color: [[0.2, 'lightgreen'],[0.4, 'orange'],[0.8, 'skyblue'],[1, '#ff4500']], 
                                color: [[0.2, 'rgb(158,202,225)'],[0.4, 'rgb(66,146,198)'],[0.8, 'rgb(8,81,156)'],[1, 'rgb(8,48,107)']],
                                // color: ['rgb(8,48,107)', 'rgb(8,81,156)', 'rgb(66,146,198)', 'rgb(158,202,225)'], 
                                width: 30
                            }
                        },
                    axisTick: {            // 坐标轴小标记
                show: true,        // 属性show控制显示与否，默认不显示
                splitNumber: 5,    // 每份split细分多少段
                length :8,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: '#eee',
                    width: 1,
                    type: 'solid'
                }
            },
            axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
                show: true,
                formatter: function(v){
                    switch (v+''){
                        case '10': return '';
                        case '30': return '';
                        case '60': return '';
                        case '90': return '';
                        default: return '';
                    }
                },
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333',
                    fontFamily: 'Montserrat',
                }
            },
            splitLine: {           // 分隔线
                show: true,        // 默认显示，属性show控制显示与否
                length :30,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    color: '#eee',
                    width: 2,
                    type: 'solid'
                }
            },
            pointer : {
                length : '80%',
                width : 8,
                color : 'auto'
            },
            title : {
                show : true,
                offsetCenter: ['-65%', -10],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: '#333',
                    fontSize : 15
                }
            },
            detail : {
                show : true,
                backgroundColor: 'rgba(0,0,0,0)',
                borderWidth: 0,
                borderColor: '#ccc',
                width: 100,
                height: 40,
                offsetCenter: ['-60%', -10],       // x, y，单位px
                formatter:'{value}%',
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    color: 'auto',
                    fontSize : 30,
                    fontFamily: 'Montserrat'
                }
            },
            data:[{value: 50, name: ''}]
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

    var loopIndex = null;

    function playGetValues() {
        if($scope.data.playing !== true) {
            return false;
        }
        console.log('plaging');
        // console.log('playGetValues');
        if(loopIndex < 0 || loopIndex === null){
            loopIndex = $scope.data.dates.length-1;
        }


        if(typeof $scope.data.dates[loopIndex] !== 'undefined') {
            $scope.data.selectedDate = $scope.data.dates[loopIndex];
            $scope.data.params.date = $scope.data.dates[loopIndex].date;
            getValues();
            loopIndex--;

        }
        
    }

    $scope.startPlay = function() {
        $scope.data.playing = true;
    }

    $scope.stopPlay = function() {
        $scope.data.playing =  false;
    }

    var play = $interval(playGetValues, 3000);

    getAverages();

    function selectIndicator($item, $model) {
        if(typeof $model !== "undefined") {
            $scope.data.params.id = $model.id;
        }
        getValues();
        getAverages();
    }

    

    function getAverageSeries(data, min, max) {
        var dates = [];
        var series = {};
        series.average = [];
        series.minimum = [];
        series.maximum = [];
        for(var i = parseInt(min); i <= max; i++) {
            var date = String(i);
            dates.push(date);
            var line = $filter('filter')(data, {date: date}, true);

            if(line.length) {

                series.average.push(Number(line[0].average));
                series.minimum.push(Number(line[0].min));
                series.maximum.push(Number(line[0].max));
            } else {
                series.average.push('-');
                series.minimum.push('-');
                series.maximum.push('-');
            }
        }

        $scope.lineChartData.xAxis[0].data = dates;
        $scope.lineChartData.series[0].data = series.minimum;
        $scope.lineChartData.series[1].data = series.average;
        $scope.lineChartData.series[2].data = series.maximum;
        $scope.lineChartData.updatedAt = new Date().toString();
        console.log(dates);
        console.log($scope.lineChartData);
    }

    function getAverages() {
        geoIndicatorService.getGeoIndicatorAverages($scope.data.params).success(function (data) {
            $scope.data.averages = data.geoindicators;
            var min = null;
            var max = null;
            angular.forEach($scope.data.averages, function(value, key) {
                if(min === null) {
                    min = value.date;
                }
                if(max === null) {
                    max = value.date;
                }

                if(parseInt(max) < parseInt(value.date)) {
                    max = value.date;
                }

                if(parseInt(min) > parseInt(value.date)) {
                    min = value.date;
                }


            });

            getAverageSeries($scope.data.averages, min, max);

        }).error(function (error) {
            $scope.status = 'Unable to load customer data: ' + error.message;
        });
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
            value.id = value.code_3;
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
        updateDataCompletion();
    }

    function updateDataCompletion() {
        $scope.dataCompletionChartData.series[0].data[0].value = Number($scope.summary.percentageCompletion);
        $scope.dataCompletionChartData.updatedAt = new Date().toString();

    }



    getValues();



}]).controller('GeoIndicatorAddCtrl', ['$scope', '$cacheFactory', '$filter', '$stateParams', '$interval', 'geographyService', 'geoIndicatorService', function ($scope, $cacheFactory, $filter, $stateParams, $interval, geographyService, geoIndicatorService) {
    var products = [
    {
        "description": "Big Mac",
        "options": [
        {"description": "Big Mac", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"description": "Big Mac & Co", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"description": "McRoyal", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"description": "Hamburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"description": "Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null},
        {"description": "Double Cheeseburger", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/hamburger.png", Pick$: null}
        ]
    },
                    /**
                    {
                        "description": "Fried Potatoes",
                        "options": [
                            {"description": "Fried Potatoes", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null},
                            {"description": "Fried Onions", "image": "//a248.e.akamai.net/assets.github.com/images/icons/emoji/fries.png", Pick$: null}
                        ]
                    }**/
                    ];
                    var countries = [];
                    var firstNames = ["Ted", "John", "Macy", "Rob", "Gwen", "Fiona", "Mario", "Ben", "Kate", "Kevin", "Thomas", "Frank"];
                    var lastNames = ["Tired", "Johnson", "Moore", "Rocket", "Goodman", "Farewell", "Manson", "Bentley", "Kowalski", "Schmidt", "Tucker", "Fancy"];
                    var address = ["Turkey", "Japan", "Michigan", "Russia", "Greece", "France", "USA", "Germany", "Sweden", "Denmark", "Poland", "Belgium"];

                    $scope.minSpareRows = 1;
                    $scope.colHeaders = true;

                    geographyService.getGeographies({}).success(function(data) {
                        countries = data.geographies;
                        loadData();

                    }).error(function(error) {
                        $scope.status = 'Unable to load customer data: ' + error.message;

                    });

                    $scope.db = {};
                    $scope.db.items = [];
                    function loadData() {
                        $scope.db.items = [];
                        for (var i = 0; i < 20; i++) {
                            // countries[i].options = countries;
                            $scope.db.items.push(
                            {
                                id: i + 1,
                                name: {
                                    first: firstNames[Math.floor(Math.random() * firstNames.length)],
                                    last: lastNames[Math.floor(Math.random() * lastNames.length)]
                                },
                                address: Math.floor(Math.random() * 100000) + ' ' + address[Math.floor(Math.random() * address.length)],
                                '2010': Math.floor(Math.random() * 100000) / 100,
                                '2011': Math.floor(Math.random() * 100000) / 100,
                                '2012': Math.floor(Math.random() * 100000) / 100,
                                '2013': Math.floor(Math.random() * 100000) / 100,
                                '2014': Math.floor(Math.random() * 100000) / 100,
                                isActive: Math.floor(Math.random() * products.length) / 2 == 0 ? 'Yes' : 'No',
                                country: countries[i]
                            }
                            );
}
// $scope.$apply();

}


$scope.db.dynamicColumns = [
                   /** {
                        data: 'id',
                        title: 'ID'},
                    {
                        data: 'name.first',
                        title: 'First Name',
                        readOnly: true
                    },
                    {
                        data: 'name.last',
                        title: 'Last Name',
                        readOnly: true
                    },**/
                    // {data: 'address', title: 'Address', width: 150},
                    {data: 'country.name', type: 'autocomplete', title: 'Country', width: 150, source: 'name in countries'},
                    // {data: 'country.name', title: 'Country', },
                    {data: '2010', title:'2010', type: 'numeric', width: 80, format: '$ 0,0.00'},
                    {data: '2011', title:'2011', type: 'numeric', width: 80, format: '$ 0,0.00'},
                    {data: '2012', title:'2012', type: 'numeric', width: 80, format: '$ 0,0.00'},
                    {data: '2013', title:'2013', type: 'numeric', width: 80, format: '$ 0,0.00'},
                    {data: '2014', title:'2014', type: 'numeric', width: 80, format: '$ 0,0.00'},
                    {data: 'isActive', type: 'checkbox', title: 'Is active', checkedTemplate: 'Yes', uncheckedTemplate: 'No', width:65}
                    ];

/**
                setInterval(function () {
                    if( $scope.db.dynamicColumns[0].title == 'ID') {
                        $scope.db.dynamicColumns[3].readOnly = true;
                        $scope.db.dynamicColumns.shift();
                        $scope.afterChange = function () {
//                          console.log('afterChange: ','when ID column has been removed');
                        };

                    } else {
                        $scope.db.dynamicColumns[2].readOnly = false;
                        $scope.db.dynamicColumns.unshift({data: 'id', title: 'ID'});
                        $scope.afterChange = function () {
//                          console.log('afterChange: ','when ID column has been added');
                        };
                    }
                    // $scope.$apply();
                }, 3000);**/

}]);