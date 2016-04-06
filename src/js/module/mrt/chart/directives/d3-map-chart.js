/**
 *
 *
 */
angular.module('MRT').directive('d3MapChart', d3MapChart);

function d3MapChart($parse, $timeout) {
	var directive = {
		restrict: 'AE',
		// templateUrl: 'pension/tpls/term/term-search-pageview.html',
		replace: true,
		//our data source would be an array
		//passed thru chart-data attribute
		scope: {options: '=options', clickEvent: '='},
		link: function(scope, element, attrs) {

			var centered;
			var width = element[0].offsetWidth;
			var height = 500;
			var options = scope.options;
			//console.log(options);

			var map = new Datamap({
				responsive: true,
				element: element[0],
				scope: 'world',
				/**geographyConfig: {
            dataUrl: 'maps/africa-topo.json'
        },
        scope: 'africa',
        projection: 'mercator',
				setProjection: function(element) {
    var projection = d3.geo.equirectangular()
      .center([23, -3])
      .rotate([4.4, 0])
      .scale(400)
      .translate([element.offsetWidth / 2, element.offsetHeight / 1.8]);
    var path = d3.geo.path()
      .projection(projection);

    return {path: path, projection: projection};
  },**/
        height: 500,
        fills: {
          defaultFill: '#dadbdd',
          selectedFill: '#7ed6e0',
          gt50: '#7ed6e0'
        },
        data: {},
				done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
							//scope.$apply(function(self) {
    						scope.$apply(scope.clickEvent(geography.id));
  						//});
							// scope.clickEvent(geography.id);
							// console.log(scope.clickEvent);
                // alert(geography.properties.name);
							//	clicked(geography, datamap.svg);
							// console.log(geography);
            });
        }
      });

			function clicked(d, g) {
				// console.log(d);
  var x, y, k;

  if (d && centered !== d) {
    var centroid = map.path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("datamap", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}


      //sample of the arc plugin
      /**map.arc([
       {
        origin: {
            latitude: 40.639722,
            longitude: 73.778889
        },
        destination: {
            latitude: 37.618889,
            longitude: -122.375
        }
      },
      {
          origin: {
              latitude: 30.194444,
              longitude: -97.67
          },
          destination: {
              latitude: 25.793333,
              longitude: -0.290556
          }
      }
      ], {strokeWidth: 2});**/


       //bubbles, custom popup on hover template
			 /**
     map.bubbles([
       {name: 'Hot', latitude: 21.32, longitude: 5.32, radius: 10, fillKey: 'gt50'},
       {name: 'Chilly', latitude: -25.32, longitude: 120.32, radius: 18, fillKey: 'lt50'},
       {name: 'Hot again', latitude: 21.32, longitude: -84.32, radius: 8, fillKey: 'gt50'},

     ], {
       popupTemplate: function(geo, data) {
         return "<div class='hoverinfo'>It is " + data.name + "</div>";
       }
     });**/




		 scope.$watch('options.data', function() {

						 $timeout(function() {
						// console.log("changed");
						//	 console.log(options.data);
							map.updateChoropleth(options.data, {reset: true});


					}, 250); // delay 250 ms

		 });

		 scope.$watch('options.updated', function() {

						 $timeout(function() {
						// console.log("changed");
						//	 console.log(options.data);
							map.updateChoropleth(options.data);


					}, 250); // delay 250 ms

		 });

		}
	};

	return directive;
}
;
