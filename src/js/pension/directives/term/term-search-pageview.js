/**
 * 
 * 
 */
angular.module('Pension').directive('termSearchPageview', termSearchPageview);

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
