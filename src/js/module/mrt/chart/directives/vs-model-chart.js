/**
*
*
*/
angular.module('MRT').directive('vsModelChart', vsModelChart);

function vsModelChart($parse, $timeout, $interval) {
	var directive = {
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		scope: {data: '=data', playing: '=playing'},
		link: function(scope, element, attrs) {

			// Various accessors that specify the four dimensions of data to visualize.
			function x(d) { return d['x-axis']; }
			function y(d) { return d['y-axis']; }
			function radius(d) { return d['bubble-size']; }
			function color(d) { return d['name']; }
			function key(d) { return d.name; }

			// Chart dimensions.
			var svg;
			var xAxis;
			var yAxis;
			var margin;
			var width;
			var height;
			var xScale;
			var yScale;
			var radiusScale;
			var colorScale;
			var label;
			var countrylabel;
			var bisect = d3.bisector(function(d) { return d[0]; });

			var first_time = true;
			var outerWith = element[0].clientWidth-100;
			function prep(axis) {
			margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5}
			width = outerWith - margin.right;
			height = 500 - margin.top - margin.bottom;

			// Various scales. These domains make assumptions of data, naturally.
			xScale = d3.scale.log().domain([axis['x-axis'].minValue, axis['x-axis'].maxValue]).range([0, width]);
			yScale = d3.scale.linear().domain([10, axis['y-axis'].maxValue]).range([height, 0]);
			radiusScale = d3.scale.sqrt().domain([0, axis['bubble-size'].maxValue]).range([0, 40]),
			colorScale = d3.scale.category10();
			var colorScaleTheme = function() {
  		 return d3.scale.ordinal().range(['rgba(52, 152, 219,1.0)', 'rgba(142, 68, 173,1.0)', 'rgba(46, 204, 113,1.0)', 'rgba(44, 62, 80,1.0)', 'rgba(230, 126, 34,1.0)', 'rgba(41, 128, 185,1.0)', 'rgba(231, 76, 60,1.0)', 'rgba(127, 140, 141,1.0)']);
			};
			colorScale = colorScaleTheme();

			// The x & y axes.
			xAxis = d3.svg.axis().orient("bottom").scale(xScale).ticks(12, d3.format(",d")),
			yAxis = d3.svg.axis().scale(yScale).orient("left");

			// Create the SVG container and set the origin.
			svg = d3.select(element[0]).html("").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
			.attr("class", "gRoot")

			// Add the x-axis.
			svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

			// Add the y-axis.
			svg.append("g")
			.attr("class", "y axis")
			.call(yAxis);

			// Add an x-axis label.
			svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.attr("x", width)
			.attr("y", height - 6)
			.text(axis['x-axis'].name);

			// Add a y-axis label.
			svg.append("text")
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("y", 6)
			.attr("dy", ".75em")
			.attr("transform", "rotate(-90)")
			.text(axis['y-axis'].name);

			// Add the year label; the value is set on transition.
			label = svg.append("text")
			.attr("class", "year label")
			.attr("text-anchor", "end")
			.attr("y", height - 24)
			.attr("x", width)
			.text(axis.max);

			// Add the country label; the value is set on transition.
			countrylabel = svg.append("text")
			.attr("class", "country label")
			.attr("text-anchor", "start")
			.attr("y", 80)
			.attr("x", 20)
			.text(" ");


		}

			// Load the data.
			//d3.json("http://romsson.github.io/dragit/data/nations.json", function(nations) {
				// draw(nations);
			// });

			function draw(nations, axis) {



				function interpolateData(year) {
					var r = nations.map(function(d) {
						var rt = {
							year: year,
							name: d.name,
							region: d.name,
							'x-axis': interpolateValues(d['x-axis'], year),
							'bubble-size': interpolateValues(d['bubble-size'], year),
							'y-axis': interpolateValues(d['y-axis'], year)
						};
						return rt;
					});

					return r.filter(function(d) {
						return d['x-axis'] && d['y-axis'] && d['bubble-size'];
					});
				}



				// Finds (and possibly interpolates) the value for the specified year.
				function interpolateValues(values, year) {
					var i = bisect.left(values, year, 0, values.length - 1),
					a = values[i];
					if (i > 0) {
						var b = values[i - 1],
						t = (year - a[0]) / (b[0] - a[0]);
						return a[1] * (1 - t) + b[1] * t;
					}

					return a && typeof a[1] !== 'undefined' ? a[1] : null;
				}

				//console.log(nations);
				//console.log(interpolateData(2013));


				// return;
				prep(axis);
				// var nations = [];
				// A bisector since many nation's data is sparsely-defined.


				// Add a dot per nation. Initialize the data at 1800, and set the colors.
				var dot = svg.append("g")
				.attr("class", "dots")
				.selectAll(".dot")
				.data(interpolateData(axis.max))
				.enter().append("circle")
				.attr("class", "dot")
				.style("fill", function(d) { return colorScale(color(d)); })
				.call(position)
				.on("mousedow", function(d, i) {

				})
				.on("mouseup", function(d, i) {
					dot.classed("selected", false);
					d3.select(this).classed("selected", !d3.select(this).classed("selected"));
					dragit.trajectory.display(d, i, "selected");

					//TODO: test if has been dragged
					// Look at the state machine history and find a drag event in it?

				})
				.on("mouseenter", function(d, i) {
					clear_demo();
					if(dragit.statemachine.current_state == "idle") {
						dragit.trajectory.display(d, i)
						dragit.utils.animateTrajectory(dragit.trajectory.display(d, i), dragit.time.current, 1000)
						countrylabel.text(d.name);
						dot.style("opacity", .4)
						d3.select(this).style("opacity", 1)
						d3.selectAll(".selected").style("opacity", 1)
					}
				})
				.on("mouseleave", function(d, i) {

					if(dragit.statemachine.current_state == "idle") {
						countrylabel.text("");
						dot.style("opacity", 1);
					}

					dragit.trajectory.remove(d, i);
				})
				.call(dragit.object.activate)

				// Add a title.
				dot.append("title")
				.text(function(d) { return d.name; });

				// Start a transition that interpolates the data based on year.
				svg.transition()
				.duration(30000)
				.ease("linear")

				// Positions the dots based on data.
				function position(dot) {
					dot.attr("cx", function(d) {
						var r = xScale(x(d));
						//if(r === '-Infinity') {
						// console.log(d);
						//}
						return r;
					})
					.attr("cy", function(d) { return yScale(y(d)); })
					.attr("r", function(d) { return radiusScale(radius(d)); });
				}

				// Defines a sort order so that the smallest dots are drawn on top.
				function order(a, b) {
					return radius(b) - radius(a);
				}

				// Updates the display to show the specified year.
				function displayYear(year) {
					dot.data(interpolateData(year+dragit.time.min), key).call(position).sort(order);
					label.text(dragit.time.min + Math.round(year));
				}


				// Interpolates the dataset for the given (fractional) year.

				init();

				function update(v, duration) {
					dragit.time.current = v || dragit.time.current;
					displayYear(dragit.time.current)
					console.log(dragit.time.current);
					d3.select("#slider-time").property("value", dragit.time.current);
				}



				function init() {


					dragit.init(".gRoot");

					dragit.time = {min:axis.min, max: axis.max, step:1, current: axis.min}
					dragit.data = d3.range(nations.length).map(function() { return Array(); })

					for(var yy = axis.min; yy<axis.max; yy++) {

						interpolateData(yy).filter(function(d, i) {
							dragit.data[i][yy-dragit.time.min] = [xScale(x(d)), yScale(y(d))];
						});
					}

					dragit.evt.register("update", update);

					d3.select("#slider-time").property("value", dragit.time.current);

					d3.select("#slider-time")
					.on("mousemove", function() {
						update(parseInt(this.value), 500);
						clear_demo();
					})

					var end_effect = function() {
						countrylabel.text("");
						dot.style("opacity", 1)
					}

				//	dragit.evt.register("dragend", end_effect)
				}

				function clear_demo() {
					if(first_time) {
						svg.transition().duration(0);
						first_time = false;
						window.clearInterval(demo_interval);
						countrylabel.text("");
						dragit.trajectory.removeAll();
						d3.selectAll(".dot").style("opacity", 1)
					}
				}

				var demo_interval = null;

				var playing = false;

				var stopTime;
				function play() {

					var el = document.getElementById("slider-time");
					var min = parseInt(d3.select("#slider-time").attr("min"));
					var max = parseInt(scope.data.axis.max-scope.data.axis.min);

					// console.log();
					var step = parseInt(d3.select("#slider-time").attr("step"));
					stopTime = $interval(function() {
						stepFn(min, max, step, el, update);
					}, 100);

				}

				function stepFn(min, max, step, el, update) {
					if(scope.playing !== true) {
						return false;
					}
					var value = parseInt(el.value);
					// console.log("value  " + value);
					value = (value+step <= max) ? value+step : min;
					if(value === 0) {
						value = 1;
					}
					console.log("value + " + value);
					el.value = value;
					update(parseInt(value), 500);
					clear_demo();
					console.log("playing " + value);
					console.log("max " + max);
					console.log("step " + step);

				}

				play();


			}



			scope.$watch('data', function(newValue, oldValue) {
				// console.log(newValue);
				if(newValue && typeof newValue.data !== "undefined") {
					// console.log(newValue.axis);

					draw(newValue.data, newValue.axis);
				}

			}, true);
		}
	};
	return directive;
}
