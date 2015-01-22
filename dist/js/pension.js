angular.module('MRT', ['ui.bootstrap', 'ui.router', 'ngCookies', 'ngTable', 'ngAnimate', 'ui.slider']);
'use strict';

/**
 * Route configuration for the Dashboard module.
 */
angular.module('MRT').config(['$stateProvider', '$urlRouterProvider', 
    function($stateProvider, $urlRouterProvider) {

    // For unmatched routes
    $urlRouterProvider.otherwise('/');

    // Application routes
    $stateProvider
        .state('index', {
            url: '/',
            templateUrl: 'tpls/mrt/tpls/index.html'
        })
        .state('list-funds', {
            url: '/list-funds',
            controller: 'ListFundsCtrl',
            templateUrl: 'tpls/mrt/tpls/list-funds.html'
        })
         .state('view-fund', {
            url: '/view-fund/:phoneId',
            controller: 'ViewFundCtrl',
            templateUrl: 'tpls/mrt/tpls/tpls/view-fund.html'
        })
        .state('tables', {
            url: '/tables', 
            templateUrl: 'tables.html'
        });
}]);

// I act a repository for the remote friend collection.
angular.module('MRT').service(
        "termService", ['$http', '$q',
    function($http, $q) {
        // var $url = "http://10.51.130.212/pension/web/app.php";
        var $url = "http://lai02.yellgroup.com";

        this.data = {
            searchPageMetrics: null,
            keywordInterpreterMetrics: null,
            synonymMetrics: null,
        };

        this.setSearchPageMetrics = function(searchPageMetrics) {
            this.data.searchPageMetrics = searchPageMetrics;
        };
        // Return public API.
        this.getSearchPageViewMetrics = function(term) {
            var request = $http({
                method: "get",
                url: $url + "/om5/term/count",
                params: {
                    term: term
                }
            });
            var self = this;
            return (request.then(handleSuccess, handleError)).then(
                    function(response) {
                        self.data.searchPageMetrics = response;
                        return response;
                        ;
                    });
        };

        this.getSynonymMetrics = function(term) {
            var request = $http({
                method: "get",
                url: $url + "/om5/term/synonym",
                params: {
                    term: term
                }
            });
            var self = this;
            return (request.then(handleSuccess, handleError)).then(
                    function(response) {
                        self.data.synonymMetrics = response;
                        return response;
                        ;
                    });
        };



        this.getKeywordInterpreterMetrics = function(keyword) {
            var request = $http({
                method: "get",
                url: $url + "/om5/term/keywordinterpreter",
                params: {
                    keyword: keyword
                }
            });
            var self = this;
            return (request.then(handleSuccess, handleError)).then(
                    function(response) {
                        self.data.keywordInterpreterMetrics = response;
                        return response;
                        ;
                    });
        };



        // ---
        // PUBLIC METHODS.
        // ---


        // I add a friend with the given name to the remote collection.
        function addFriend(name) {

            var request = $http({
                method: "post",
                url: "api/index.cfm",
                params: {
                    action: "add"
                },
                data: {
                    name: name
                }
            });

            return(request.then(handleSuccess, handleError));

        }


        // I get all of the friends in the remote collection.



        // I remove the friend with the given ID from the remote collection.
        function removeFriend(id) {

            var request = $http({
                method: "delete",
                url: "api/index.cfm",
                params: {
                    action: "delete"
                },
                data: {
                    id: id
                }
            });

            return(request.then(handleSuccess, handleError));

        }


        // ---
        // PRIVATE METHODS.
        // ---


        // I transform the error response, unwrapping the application dta from
        // the API response payload.
        function handleError(response) {

            // The API response from the server should be returned in a
            // nomralized format. However, if the request was not handled by the
            // server (or what not handles properly - ex. server error), then we
            // may have to normalize it on our end, as best we can.
            if (
                    !angular.isObject(response.data) ||
                    !response.data.message
                    ) {

                return($q.reject("An unknown error occurred."));

            }

            // Otherwise, use expected error message.
            return($q.reject(response.data.message));

        }


        // I transform the successful response, unwrapping the application data
        // from the API response payload.
        function handleSuccess(response) {

            return(response.data);

        }

    }
]);
/**
 * Master Controller
 */
angular.module('MRT')
    .controller('MasterCtrl', ['$scope', '$cookieStore', MasterCtrl]);

function MasterCtrl($scope, $cookieStore) {
    /**
     * Sidebar Toggle & Cookie Control
     *
     */
    
    // $scope.term = 'Hairdressers';
    
    var mobileView = 992;

    $scope.getWidth = function() { return window.innerWidth; };

    $scope.$watch($scope.getWidth, function(newValue, oldValue)
    {
        if(newValue >= mobileView)
        {
            if(angular.isDefined($cookieStore.get('toggle')))
            {
                if($cookieStore.get('toggle') == false)
                {
                    $scope.toggle = false;
                }            
                else
                {
                    $scope.toggle = true;
                }
            }
            else 
            {
                $scope.toggle = true;
            }
        }
        else
        {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() 
    {
        $scope.toggle = ! $scope.toggle;

        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() { $scope.$apply(); };
}

angular.module('MRT').controller('TabMetricCtrl', ['$scope', 'termService', function($scope, termService) {
    $scope.data = termService.data;
    $scope.$watch(function() {
        return termService.data;
    }, function(newValue) {
        $scope.data = termService.data;
    });

    
    $scope.tabs = [
        {title: 'Dynamic Title 1', content: 'Dynamic content 1'},
        {title: 'Dynamic Title 2', content: 'Dynamic content 2', disabled: true}
    ];

    $scope.alertMe = function() {
        setTimeout(function() {
            alert('You\'ve selected the alert tab!');
        });
    };
}]);
/**
 * Alerts Controller
 */
angular.module('MRT').controller('AlertsCtrl', ['$scope', AlertsCtrl]);

function AlertsCtrl($scope) {
    $scope.alerts = [
        { type: 'success', msg: 'Thanks for visiting! Feel free to create pull requests to improve the dashboard!' },
        { type: 'danger', msg: 'Found a bug? Create an issue with as many details as you can.' }
    ];

    $scope.addAlert = function() {
        $scope.alerts.push({msg: 'Another alert!'});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}
angular.module('MRT').controller("ChartLineCtrl", ['$scope', '$timeout', function($scope, $timeout) {

        $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
        $scope.series = ['Series A', 'Series B'];
        $scope.data = [
            [65, 59, 80, 81, 56, 55, 40],
            [28, 48, 40, 19, 86, 27, 90]
        ];
        $scope.onClick = function(points, evt) {
            console.log(points, evt);
        };

        // Simulate async data update
        $timeout(function() {
            $scope.data = [
                [28, 48, 40, 19, 86, 27, 90],
                [65, 59, 80, 81, 56, 55, 40]
            ];
        }, 3000);
    }]);

// console.log(Chart.defaults.global.colours);
/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('MRT').directive('rdLoading', rdLoading);

function rdLoading () {
    var directive = {
        restrict: 'AE',
        template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>'
    };
    return directive;
};
/**
 * Loading Directive
 * @see http://tobiasahlin.com/spinkit/
 */
angular.module('MRT').directive('tabMetric', tabMetric);

function tabMetric() {
    var directive = {
        restrict: 'AE',
        templateUrl: 'pension/tpls/tab-metric.html'
    };
    return directive;
}
;
angular.module('MRT').controller('TermSearchCtrl', ['$scope', '$http', '$cookieStore', 'termService', function($scope, $http, $cookieStore, termService) {
        if(!$cookieStore.get('term-search')) {
            $cookieStore.put('term-search', 'Hairdressers');
        }
        $scope.data = {term: $cookieStore.get('term-search')};
        load($scope.data.term);
        $scope.load = load;
        
        function load(term) {
             $cookieStore.put('term-search', term);
             termService.getSearchPageViewMetrics(term);
             termService.getKeywordInterpreterMetrics(term);
             termService.getSynonymMetrics(term);
             
        }
    }]);
angular.module('MRT').controller('ListFundsCtrl', ['$scope', function($scope) {
        /**   $http.get('phones/phones.json').success(function(data) {
         $scope.phones = data;
         });
         
         $scope.orderProp = 'age';**/

        $scope.funds = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Dakota', 'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];

        $scope.values = {
            min: 0,
            max: 50
        };
        
        $scope.rate = 1;
        $scope.max = 5;
        $scope.isReadonly = false;

        $scope.hoveringOver = function(value) {
            $scope.overStar = value;
            $scope.percent = 100 * (value / $scope.max);
        };

        $scope.ratingStates = [
            {stateOn: 'glyphicon-ok-sign', stateOff: 'glyphicon-ok-circle'},
            {stateOn: 'glyphicon-star', stateOff: 'glyphicon-star-empty'},
            {stateOn: 'glyphicon-heart', stateOff: 'glyphicon-ban-circle'},
            {stateOn: 'glyphicon-heart'},
            {stateOff: 'glyphicon-off'}
        ];
    }]);
angular.module('MRT').controller('ViewFundCtrl', ['$scope', function($scope) {
        $scope.phoneId = $routeParams.phoneId;
    }]);
/**
 * 
 * 
 */
angular.module('MRT').directive('termSearch', termSearch);

function termSearch($parse) {
    var directive = {
        restrict: 'AE',
        templateUrl: 'pension/tpls/term/term-search.html',
        scope: true,
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        link: function(scope, element, attrs) {
           
        }
    };
    return directive;
}
;

angular.module('MRT').controller('TermSearchPageViewCtrl', ['$scope', '$http', 'termService', function($scope, $http, termService) {
        // $scope.data = [{"key": "Searches", "values": [[1375311600000, 274227], [1377990000000, 251592], [1380582000000, 239916], [1383264000000, 225168], [1385856000000, 203817], [1388534400000, 247154], [1391212800000, 239294], [1393632000000, 247746], [1396306800000, 237578], [1398898800000, 240284], [1401577200000, 240969], [1404169200000, 0], [1406847600000, 0], [1409526000000, 0], [1412118000000, 0]]}, {"key": "Page Views", "bar": true, "values": [[1375311600000, 349814], [1377990000000, 323587], [1380582000000, 307883], [1383264000000, 291368], [1385856000000, 275744], [1388534400000, 309709], [1391212800000, 313789], [1393632000000, 321019], [1396306800000, 303999], [1398898800000, 309197], [1401577200000, 313146], [1404169200000, 0], [1406847600000, 0], [1409526000000, 0], [1412118000000, 0]]}];
        $scope.data = termService.data.searchPageMetrics;
        $scope.$watch(function() {
            return termService.data.searchPageMetrics;
        }, function(newValue) {
            $scope.data = termService.data.searchPageMetrics;
        });

    }]);
/**
 * 
 * 
 */
angular.module('MRT').directive('termSearchPageview', termSearchPageview);

function termSearchPageview($parse) {
    var directive = {
        restrict: 'AE',
        templateUrl: 'pension/tpls/term/term-search-pageview.html',
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {data: '=chartData'},
        link: function(scope, element, attrs) {
            //in D3, any selection[0] contains the group
            //selection[0][0] is the DOM node
            //but we won't need that this time
            // var selector = element[0];
            return true;
            var chart;
            //var color = d3.scale.linear().domain([0,1]).range(["#fed900","#39c"]);
            var color = ["#fed900", "#39c"];
            //var color = d3.scale.category10().range();
            // console.log(color);
            // alert(scope.data);
                nv.addGraph(function() {
                    chart = nv.models.linePlusBarChart()
                            .margin({top: 30, right: 60, bottom: 50, left: 70})
                            .x(function(d, i) {
                        return i
                    })
                            .y(function(d) {
                        return d[1]
                    })
                            .color(color);


                    chart.xAxis
                            .showMaxMin(true)
                            .tickFormat(function(d) {
                        var dx = scope.data[0].values[d] && scope.data[0].values[d][0] || 0;
                        return d3.time.format('%m/%Y')(new Date(dx))
                    });

                    chart.y1Axis
                            .tickFormat(d3.format(',f'));

                    chart.y2Axis
                            .tickFormat(function(d) {
                        return d3.format(',f')(d)
                    });

                    chart.bars.forceY([0]);
                    chart.lines.forceY([0])

                    draw();

                    nv.utils.windowResize(chart.update);
                });


            function draw() {
                d3.select(element[0])
                        .datum(scope.data)
                        .transition().duration(500).call(chart);
            }

            function transition() {
                d3.select(element[0])
                        .transition().duration(500).call(chart);
            }

            scope.$watch('data', function() {
                draw();
            });

            scope.getWidth = function() {
                return element[0].offsetWidth;
            };

            scope.$watch(function() {
                return element[0].offsetWidth;
            }, function(newValue, oldValue)
            {
               // alert(newValue);
               chart.update;
            });

        }
    };
    return directive;
}
;

function dump(obj) {
    var out = '';
    for (var i in obj) {
        out += i + ": " + obj[i] + "\n";
    }
    return out;
}
angular.module('MRT').controller('LoginSectionCtrl', ['$scope', function($scope) {
        $scope.scopes = [];
        $scope.floor = 1;
        $scope.ceiling = 10;
       $scope.precision = 1;
        $scope.step = 1; 
        $scope.buffer = 1; 
        $scope.stickiness = 3; 
        /** $scope.sliderWidth = '100%'; **/
        
        $scope.value = 5;
        $scope.values = {
            min: 0,
            max: 50
        };
        $scope.scale = function(value) {
            return Math.pow(value, 3);
        };
        $scope.inverseScale = function(value) {
            var sign = value == 0 ? 1 : (value / Math.abs(value));
            return sign * Math.pow(Math.abs(value), 1 / 3);
        };
        $scope.addScope = function() {
            $scope.scopes.push({
                values: {
                    low: 4,
                    high: 7
                },
                value: 5
            });
        };
        $scope.translate = function(value) {
            return '$' + value;
        };
        $scope.translateCombined = function(low, high) {
            return $scope.translate(low.toFixed($scope.precision)) + " *** " + $scope.translate(high.toFixed($scope.precision));
        };
        $scope.translateRange = function(low, high) {
            return $scope.translate((high - low).toFixed($scope.precision));
        };
        $scope.fireResizeEvent = function() {
            $scope.$broadcast('refreshSlider');
        };
        
        $scope.currencyFormatting = function(value) { return value.toString() + " $" }
    }]);
angular.module('MRT').directive('loginSection', searchSection);
function searchSection() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'tpls/mrt/tpls/section/login-section.html'
    };
    return directive;
}
;
angular.module('MRT').directive('latestReviews', latestReviews);
function latestReviews() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/latest-reviews.html'
    };
    return directive;
}
;
angular.module('MRT').directive('sectorThumbnails', sectorThumbnails);
function sectorThumbnails() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/sector-thumbnails.html'
    };
    return directive;
}
;
/**
 * 
 * 
 */
angular.module('MRT').directive('worldMap', worldMap);

function worldMap($parse) {
    var directive = {
        restrict: 'AE',
        // templateUrl: 'pension/tpls/term/term-search-pageview.html',
        replace: true,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {data: '=chartData'},
        link: function(scope, element, attrs) {
            //in D3, any selection[0] contains the group
            //selection[0][0] is the DOM node
            //but we won't need that this time
            // var selector = element[0];
            var chart;
            //var color = d3.scale.linear().domain([0,1]).range(["#fed900","#39c"]);
            var color = ["#fed900", "#39c"];

            // console.log("log");
            // var $container = "container";
            var $element = element[0];
            var $topoUrl = "../data/world-topo-min.json";
            var $dataUrl = "../data/country-capitals.csv";

            d3.select(window).on("resize", throttle);

            var zoom = d3.behavior.zoom()
                    .scaleExtent([1, 9])
                    .on("zoom", move);


            var width = $element.offsetWidth;
            var height = width / 2;
// var height = width / 4;

            var topo, projection, path, svg, g;

            var graticule = d3.geo.graticule();

            var tooltip = d3.select($element).append("div").attr("class", "tooltip hidden");

            setup(width, height);

            function setup(width, height) {
                projection = d3.geo.mercator()
                        .translate([(width / 2), (height / 2)])
                        .scale(width / 2 / Math.PI);

                path = d3.geo.path().projection(projection);

                svg = d3.select($element).append("svg")
                        .attr("width", width)
                        .attr("height", height)
                        .call(zoom)
                        .on("click", click)
                        .append("g");

                g = svg.append("g");

            }

            d3.json($topoUrl, function(error, world) {

                var countries = topojson.feature(world, world.objects.countries).features;

                topo = countries;
                draw(topo);

            });


            function getColours(r, g, b) {
                var opc = 0.1;
                var colours = [];
                while (opc <= 1) {
                    colours.push("rgba(" + r + ", " + g + ", " + b + ", " + opc + ")");
                    opc += 0.1;
                }
                return colours;
            }

// var colours = getColours(41, 125, 185);
// var colours = getColours(52, 152, 219);
            var colours = getColours(243, 156, 18);
            var colours = getColours(243, 156, 18);


            var heatmapColour = d3.scale.linear()
                    .domain(d3.range(0, 1, 1.0 / (colours.length - 1)))
                    .range(colours);

            function draw(topo) {

                svg.append("path")
                        .datum(graticule)
                        .attr("class", "graticule")
                        .attr("d", path);


                g.append("path")
                        .datum({type: "LineString", coordinates: [[-180, 0], [-90, 0], [0, 0], [90, 0], [180, 0]]})
                        .attr("class", "equator")
                        .attr("d", path);


                var country = g.selectAll(".country").data(topo);

                country.enter().insert("path")
                        .attr("class", "country")
                        .attr("d", path)
                        .attr("id", function(d, i) {
                    return d.id;
                })
                        .attr("title", function(d, i) {
                    return d.properties.name;
                })
                        .attr("country", function(d, i) {
                    return d.properties.name.toUpperCase();
                })
                        .style("fill", function(d, i) {
                    return '#ccc';
                });

                //offsets for tooltips
                var offsetL = $element.offsetLeft + 20;
                var offsetT = $element.offsetTop + 10;

                //tooltips
                country
                        .on("mousemove", function(d, i) {

                    var mouse = d3.mouse(svg.node()).map(function(d) {
                        return parseInt(d);
                    });

                    tooltip.classed("hidden", false)
                            .attr("style", "left:" + (mouse[0] + offsetL) + "px;top:" + (mouse[1] + offsetT) + "px")
                            .html(d.properties.name);

                })
                        .on("mouseout", function(d, i) {
                    tooltip.classed("hidden", true);
                });



                //EXAMPLE: adding some capitals from external CSV file
                d3.csv($dataUrl, function(err, capitals) {

                    capitals.forEach(function(i) {
                        addpoint(i.CapitalLongitude, i.CapitalLatitude, i.CapitalName);
                        var percent = i.Percent;
                        var rgb = d3.rgb('#090');
                        //console.log(i.CountryName.toUpperCase());
                        d3.select("[country='" + i.CountryName.toUpperCase() + "']").style("fill", function(d) {
                            // console.log(rgb.toString());
                            return heatmapColour(percent);
                        });
                    });

                });

            }


            function redraw() {
                width = $element.offsetWidth;
                height = width / 2;
                d3.select('svg').remove();
                setup(width, height);
                draw(topo);
            }


            function move() {

                var t = d3.event.translate;
                var s = d3.event.scale;
                zscale = s;
                var h = height / 4;


                t[0] = Math.min(
                        (width / height) * (s - 1),
                        Math.max(width * (1 - s), t[0])
                        );

                t[1] = Math.min(
                        h * (s - 1) + h * s,
                        Math.max(height * (1 - s) - h * s, t[1])
                        );

                zoom.translate(t);
                g.attr("transform", "translate(" + t + ")scale(" + s + ")");

                //adjust the country hover stroke width based on zoom level
                d3.selectAll(".country").style("stroke-width", 1.5 / s);

            }



            var throttleTimer;
            function throttle() {
                window.clearTimeout(throttleTimer);
                throttleTimer = window.setTimeout(function() {
                    redraw();
                }, 200);
            }


//geo translation on mouse click in map
            function click() {
                var latlon = projection.invert(d3.mouse(this));
                console.log(latlon);
            }


//function to add points and text to the map (used in plotting capitals)
            function addpoint(lat, lon, text) {

                var gpoint = g.append("g").attr("class", "gpoint");
                var x = projection([lat, lon])[0];
                var y = projection([lat, lon])[1];

                gpoint.append("svg:circle")
                        .attr("cx", x)
                        .attr("cy", y)
                        .attr("class", "point")
                        .attr("r", 1.5);

                //conditional in case a point has no associated text
                if (text.length > 0) {

                    gpoint.append("text")
                            .attr("x", x + 2)
                            .attr("y", y + 2)
                            .attr("class", "text")
                            .text(text);
                }

            }

        }
    };
    return directive;
}
;

/**
 * 
 * 
 */
angular.module('MRT').directive('lineChart', lineChart);

function lineChart($parse) {
    var directive = {
        restrict: 'AE',
        // templateUrl: 'pension/tpls/term/term-search-pageview.html',
        replace: true,
        //our data source would be an array
        //passed thru chart-data attribute
       // scope: {data: '=chartData'},
        link: function(scope, element, attrs) {

            var chart;
            d3.json('../data/cumulativeLineData.json', function(data) {
                nv.addGraph(function() {
                    chart = nv.models.cumulativeLineChart()
                            .x(function(d) {
                        return d[0]
                    })
                            .y(function(d) {
                        return d[1] / 100
                    }) //adjusting, 100% is 1.00, not 100 as it is in the data
                            .color(d3.scale.category10().range())
                            .useInteractiveGuideline(true)
                            ;

                    chart.xAxis
                            .tickValues([1078030800000, 1122782400000, 1167541200000, 1251691200000])
                            .tickFormat(function(d) {
                        return d3.time.format('%x')(new Date(d))
                    });

                    chart.yAxis
                            .tickFormat(d3.format(',.1%'));

                    var svg = d3.select(element[0]).append('svg');
                    console.log(svg);
                            svg.datum(data)
                            .call(chart);

                    //TODO: Figure out a good way to do this automatically
                    nv.utils.windowResize(chart.update);

                    return chart;
                });
            });
        }
    };
    return directive;
}
;

/**
 * 
 * 
 */
angular.module('MRT').directive('sparkLine', sparkLine);

function sparkLine($parse) {
    var directive = {
        restrict: 'AE',
        // templateUrl: 'pension/tpls/term/term-search-pageview.html',
        replace: false,
        //our data source would be an array
        //passed thru chart-data attribute
        scope: {},
        link: function(scope, element, attrs) {
            //var color = d3.scale.linear().domain([0,1]).range(["#fed900","#39c"]);
            var color = ["#fed900", "#39c"];

            var width = 100;
            var height = 25;
            var x = d3.scale.linear().range([0, width - 2]);
            var y = d3.scale.linear().range([height - 4, 0]);
            var parseDate = d3.time.format("%b %d, %Y").parse;
            var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) {
                return x(d.date);
            })
                    .y(function(d) {
                return y(d.close);
            });

            function sparkline(elemId, data) {
                data.forEach(function(d) {
                    d.date = parseDate(d.Date);
                    d.close = +d.Close;
                    // d.close = +Math.floor((Math.random() * 10) + 1);
                });
                
               
                // console.log(data);
                
                x.domain(d3.extent(data, function(d) {
                    return d.date;
                }));
                y.domain(d3.extent(data, function(d) {
                    return d.close;
                }));

                var svg = d3.select(elemId)
                        .append('svg')
                         .style({height: height})
                        //.attr('width', width)
                        // .attr('height', height)
                        .append('g')
                        .attr('transform', 'translate(0, 2)');
                
                
                svg.append('path')
                        .datum(data)
                        .attr('class', 'sparkline')
                        .attr('d', line);
                svg.append('circle')
                        .attr('class', 'sparkcircle')
                        .attr('cx', x(data[0].date))
                        .attr('cy', y(data[0].close))
                        .attr('r', 1.5);
            }

            d3.csv(attrs.file, function(error, data) {
                sparkline(element[0], data);
            });
            

        }
    };
    return directive;
}
;

angular.module('MRT').directive('leadingSectors', leadingSectors);
function leadingSectors() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/leading-sectors.html'
    };
    return directive;
}
;