/**
 * 
 * 
 */
angular.module('Pension').directive('sparkLine', sparkLine);

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
