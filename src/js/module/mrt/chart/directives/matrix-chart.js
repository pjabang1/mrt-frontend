/**
 *
 * http://jsfiddle.net/pnavarrc/Sg3BY/1/
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
				'1_1' : '#E75C3D',
				'1_2' : '#E75C3D',
				'1_3' : '#FBC226',
				'2_1' : '#E75C3D',
				'2_2' : '#FBC226',
				'2_3' : '#63C954',
				'3_1' : '#FBC226',
				'3_2' : '#63C954',
				'3_3' : '#63C954',
				'yellow': '#FBC226',
				'blue': '#3598DB',
				'green': '#63C954',
				'red': '#E75C3D',
				'hoverbg': '#394855',
				'label': '#394855'
			};

			var countries = ['Gambia', 'Senegal', 'Mali', 'Egypt', 'Sierra Leone', 'Nigeria', 'Ghana', 'South Africa'];
			var options = {
				x: {
					key: "x",
					label : 'Business Unit Strength',
					cells: [
						{label: 'Low', key: "low"},
						{label: 'Medium', key: "medium"},
						{label: 'High', key: "high"}
					]
				},
				y: {
					key: "x",
					label : 'Industry Attractiveness',
					cells: [
						{label: 'Low', key: "low"},
						{label: 'Medium', key: "medium"},
						{label: 'High', key: "high"}
					]
				}
			};

		var marginLeft = 100;
		var marginTop = 100;
		var outerWidth = element[0].offsetWidth;
		var outerHeight = 600;
		var width = outerWidth-marginLeft;
		var height = outerHeight-marginTop;

		console.log(outerWidth);
		console.log(width);

    var div = d3.select(element[0]).style("fill", "#E2E2E2");

    var svg = div.append('svg')
        .attr('width', outerWidth)
        .attr('height', outerHeight);
				var xTitle = svg.append("g")
								.attr('transform', function(d, i) {
						        return 'translate(' + marginLeft +', ' + (marginTop/2)*0 + ')';
						    })
								.append("text");

				xTitle.attr("x", function() {
									return width/2;
								})
								.attr("y", function() {
									return 20;
								})
								.style("font-size", "20px")
								.style("text-anchor", "middle")
		            .attr("fill", colors['label'])
								.text("Business Unit Strength");





		var chart = svg.append("g");
				chart.attr('transform', function(d, i) {
		        return 'translate(' + marginLeft +', ' + marginTop + ')';
		    });


		var xLabels = svg.append("g")
										.attr('transform', function(d, i) {
								        return 'translate(' + marginLeft +', ' + (marginTop/2)*1 + ')';
								    });


		var xCells = options.x.cells.length;
		var yCells = options.y.cells.length;


		function shadeColor(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}



var data = [];
for (var k = 0; k < yCells; k++) {
		var row = [];
		var yId = yCells-k;
		for (var i = 0; i < xCells; i++) {
			var xId = i+1;
			var cell = {};
			cell.id = xId + '_' + yId;
			cell.data = angular.copy(countries);
			row.push(cell);
		}
    data.push(row);
}

function rotate(d, w) {
           return "rotate(-90) translate(" +
                       (-d.dy / 2) +
                       ", " +
                       (w / 2 + 5) +
       ")";
}
var x = d3.scale.ordinal().rangeRoundBands([ 0, width ], 0.009, 0);
var y = d3.scale.ordinal().rangeRoundBands([ 0, height ], 0.009, 0);
x.domain(d3.range(xCells));
y.domain(d3.range(yCells));

// Create a group for each row in the data matrix and
// translate the group vertically
var row = chart.selectAll('.row')
    .data(data)
    .enter()
    .append('g')
		.attr('class', 'row')
    .attr('transform', function(d, i) {
        return 'translate(0, ' + y(i) + ')';
    });


// For each group, create a set of rectangles and bind
// them to the inner array (the inner array is already
// binded to the group)
var cell = row.selectAll('.cell')
    .data(function(d) { return d; })
    .enter()
		.append("g")
	.attr("class", "card-group")
	.attr('transform', function(d, i) {
			return 'translate(' + x(i) + ', ' + 0 + ')';
	});


	cell.append('rect')
		.attr('class', 'cell')
     .attr('x', function(d, i) { return 0; return x(i); })
        .attr('width', x.rangeBand())
        .attr('height', y.rangeBand())
				.style('fill', function(d) {
					return colors[d.id];
				})
				;

				cell
						.append("svg:foreignObject")
						.attr('x', function(d, i) { return 0; return x(i); })
						.attr('width', x.rangeBand())
						.attr('height', y.rangeBand())
						.attr('class', 'text-group')
						.append("xhtml:div")
						    .style("font-size", "10px")
								.style('height', '100%')
								.style("background-color", "transparent")
								.style("text-anchor", "middle")
								.style("color", function(d) {
									return '#546678';
									return  colors[d.id];
								})
								.style("text-align", "center")
								.style("padding", "5%")
							//	.style("position", "relative")
								// .style("top", "50%")
								// .style("translate", "translateY(-50%)")
						    .html(function(d) {
									var html = "";
									var color = shadeColor( colors[d.id], 0.5);
									for(var c = 0; c < d.data.length; c++) {
										html = html + "<span style='border-radius: 2px; border: 5px solid " + color + ";padding: 2px; background-color: #fff; display: inline-block; margin: 2px;'>" + d.data[c] + "</span>";
									}
									return html;
								})

								;





		}
	};
	return directive;
};
