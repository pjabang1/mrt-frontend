/**
 * 
 * 
 */
angular.module('Pension').directive('lineChart', lineChart);

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
