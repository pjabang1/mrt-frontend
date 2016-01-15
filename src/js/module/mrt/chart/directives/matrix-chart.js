/**
 *
 *
 */
angular.module('MRT').directive('matrixChart', matrixChart);

function matrixChart($parse) {
	var directive = {
		restrict: 'AE',
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		//our data source would be an array
		//passed thru chart-data attribute
		// scope: {data: '=chartData'},
		link: function(scope, element, attrs) {

			var colors = {
				'1_1' : '',
				'1_2' : '',
				'1_3' : '',
				'2_1' : '',
				'2_2' : '',
				'2_3' : '',
				'3_1' : '',
				'3_2' : '',
				'3_3' : ''
			};

			var width = 300,
    height = 300,
    div = d3.select(element[0]),
    svg = div.append('svg')
        .attr('width', width)
        .attr('height', height),
    rw = 95,
    rh = 95;
		var xCells = 3;
		var yCells = 3;

var data = [];
for (var k = 0; k < xCells; k++) {
    data.push(d3.range(yCells));
}

// console.log(d3.range(3));

// Create a group for each row in the data matrix and
// translate the group vertically
var grp = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .attr('transform', function(d, i) {
        return 'translate(0, ' + 100 * i + ')';
    });

// For each group, create a set of rectangles and bind
// them to the inner array (the inner array is already
// binded to the group)
grp.selectAll('rect')
    .data(function(d) { return d; })
    .enter()
    .append('rect')
        .attr('x', function(d, i) { return 100 * i; })
        .attr('width', rw)
        .attr('height', rh)
				.style('fill', 'rgb(231, 76, 60)');
		}
	};
	return directive;
}
;
