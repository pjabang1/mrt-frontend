/**
 * 
 * 
 */
angular.module('MRT').directive('pieChart', pieChart);

function pieChart($parse) {
	var directive = {
		restrict: 'AE',
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		//our data source would be an array
		//passed thru chart-data attribute
		// scope: {data: '=chartData'},
		link: function(scope, element, attrs) {

			var dataset = {
				apples: [
					{name: 'The Gambia', value: 53245},
					{name: 'Senegal', value: 28479},
					{name: 'Sierra Leone', value: 19697},
					{name: 'Nigeria', value: 24037},
					{name: 'Liberia', value: 40245}
				]
			};
			/**
			 var dataset = {
			 apples: [53245, 28479, 19697, 24037, 40245],
			 };
			 **/
			var width = 300,
					height = 300,
					radius = Math.min(width, height) / 2;

			var color = d3.scale.category20();
// console.log(color);
			var color2 = ['#3498db', '#2ecc71', '#2c3e50', '#8e44ad', '#f39c12', '#e74c3c'];
			var color2 = ['#00BFF3', '#EB5367', '#FFCE54', '#738F12', '#2A2F36']
			var hex = color2[0];
			
			var colorLighter= d3.scale.linear().domain([0,dataset.apples.length])
      .range([d3.rgb(hex), d3.rgb('#c9e9f5')]);
	  // d3.rgb(hex).brighter(1)
			var pie = d3.layout.pie()
					.value(function(d) {
						return d.value;
					})
					.sort(null);

			var piedata = pie(dataset.apples);

			var arc = d3.svg.arc()
					.innerRadius(radius - (width / 3))
					.outerRadius(radius - (width / 6));


			var svg = d3.select(element[0]).append('svg')
					.attr("width", width)
					.attr("height", height)
					.append("g")
					.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

			var path = svg.selectAll("path")
					.data(piedata)
					.enter().append("path")
					.attr("fill", function(d, i) {
						// return color2[i];
						return colorLighter(i);
					})
					.attr("d", arc);

			svg.selectAll("text").data(piedata)
					.enter()
					.append("text")
					.style("fill", "#7f8c8d")
					.attr("text-anchor", "middle")
					.attr("x", function(d) {
						// console.log(d);
						var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
						d.cx = Math.cos(a) * (radius - 75);
						return d.x = Math.cos(a) * (radius - 20);
					})
					.attr("y", function(d) {
						var a = d.startAngle + (d.endAngle - d.startAngle) / 2 - Math.PI / 2;
						d.cy = Math.sin(a) * (radius - 75);
						return d.y = Math.sin(a) * (radius - 20);
					})
					.text(function(d) {
						return d.data.name;
					})
					.each(function(d) {
						var bbox = this.getBBox();
						d.sx = d.x - bbox.width / 2 - 2;
						d.ox = d.x + bbox.width / 2 + 2;
						d.sy = d.oy = d.y + 5;
					});

			svg.append("defs").append("marker")
					.attr("id", "circ")
					.attr("markerWidth", 6)
					.attr("markerHeight", 6)
					.attr("refX", 3)
					.attr("refY", 3)
					.style("fill", "#7f8c8d")
					.append("circle")
					.attr("cx", 3)
					.attr("cy", 3)
					.attr("r", 3);

			svg.selectAll("path.pointer").data(piedata).enter()
					.append("path")
					.attr("class", "pointer")
					.style("fill", "none")
					.style("stroke", "#7f8c8d")
					.attr("marker-end", "url(#circ)")
					.attr("d", function(d) {
						if (d.cx >= d.ox) {
							return "M" + d.sx + "," + d.sy + "L" + d.ox + "," + d.oy + " " + d.cx + "," + d.cy;
						} else {
							// console.log(d);
							return "M" + d.ox + "," + d.oy + "L" + d.sx + "," + d.sy + " " + d.cx + "," + d.cy;
						}
					});

			
		}
	};
	return directive;
}
;
