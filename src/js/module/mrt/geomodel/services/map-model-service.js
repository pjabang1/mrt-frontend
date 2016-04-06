angular.module('MRT')
        .factory('mapModelService', ['$http', '$filter', 'env', 'localStorageService', function($http, $filter, env, localStorageService) {

        var service = {};
        service.model = {};
        service.setModel = setModel;
        service.getClusterData = getClusterData;
        service.getClusterResults = getClusterResults;
        service.getGeoColors = getGeoColors;
        service.getClusterColors = getClusterColors;
        service.getCentroids = getCentroids;
        service.getColorList = getColorList;
        service.setThemeColor = setThemeColor;
        var themeColor;


        var kmeans = new clusterio.KMeans();



        function getMaxDate() {

        }

        function setModel(model) {
          service.model = model;
        }

        function getModel() {
          return service.model;
        }

        function exists(code, codes) {
          if(typeof codes === "undefined") {
            return true;
          }
          codes = Array.isArray(codes) ? codes : [codes];
          var i = codes.length;
    while (i--) {
       if (codes[i] === code) {
           return true;
       }
    }
    return false;
        }

        function filterIndicators(indicators, codes) {
          var result = [];
          for(var i = 0; i < indicators.length; i++) {
            var indicator = indicators[i];
            if(exists(indicator.code, codes)) {
              result.push(indicator);
            }
          }
          return result;
        }

        function filterGeographies(geographies, label) {
          var result = [];
          for (var j = 0; j < geographies.length; j++) {
            var geography = geographies[j];
            if(geography.code_3 === "") {
              continue;
            }
            if(hasLabelValue(geography.values, label)) {
              result.push(geography);
            }

          }
          return result;
        }

        function getClusterData(label, codes) {
          var cache = {};
          var indicatorsCache = [];
          var model = service.model;
          if(typeof model.indicators !== "undefined") {
            var indicators = filterIndicators(model.indicators[0].indicators, codes);
            //console.log(indicators);
            for(var i = 0; i < indicators.length; i++) {

              var indicator = indicators[i];

              indicatorsCache[i] = {};
              indicatorsCache[i].id = indicator.id;
              indicatorsCache[i].code = indicator.code;
              indicatorsCache[i].name = indicator.name;
              var geographies = filterGeographies(indicator.geographies, label);

              for (var j = 0; j < geographies.length; j++) {
                var geography = geographies[j];
                if(geography.code_3 === "") {
                  continue;
                }
                if(typeof cache[geography.code_3] === "undefined") {
                  cache[geography.code_3] = [];
                }
                cache[geography.code_3][i] = getLabelValue(geography.values, label);
                cache[geography.code_3][i].code_3 = geography.code_3;
                cache[geography.code_3][i].code = geography.code;
                cache[geography.code_3][i].name = geography.name;
              }

            }
          }
          return {indicators: indicatorsCache, data: cache}
        }

        function getLabelValue(values, label) {
          for(var i = 0; i < values.length; i++) {
            var value = values[i];
            if(value.label === label) {
              return value;
            }
          }
          return null;
        }

        function hasLabelValue(values, label) {
          for(var i = 0; i < values.length; i++) {
            var value = values[i];
            if(value.label === label && value.value != "-") {
              return true;
            }
          }
          return false;
        }


        function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

        function getClusterResults(label, k, codes) {

          var data = getClusterData(label, codes);
          var clusterData = prepareClusterData(data.data);
          var clusters = kmeans.cluster(clusterData, k);
        //  console.log("clusters");
          // console.log(clusterData);
          kmeans.fromJSON(JSON.stringify(kmeans.centroids.sort(sortFunction)));
          // var clusters = kmeans.cluster(clusterData, k);
          var clustersByGeography = labelClustersByGeography(data.data, clusters);
          console.log("by geography");
          console.log(clustersByGeography);
          // console.log(kmeans.toJSON());
          return clustersByGeography;
        }

        function labelClustersByGeography(data, clusters) {
          var result = [];

          // console.log(clusters);
          angular.forEach(data, function(value, key) {
            var index = getClusterIndex(getClusterRecord(value), clusters);
            // console.log(getClusterRecord(value));
            if(index != null) {
              if(typeof result[index] === "undefined") {
                result[index] = [];
              }
              var line = {code: value[0].code_3,  name: value[0].name, values:value};
              result[index].push(line);
            }
          });

          return result;
        }

        function getIndicator() {

        }


        function getClusterIndex(value, clusters) {
          return kmeans.classify(value);
          for(var i = 0; i < clusters.length; i++) {
            var cluster = clusters[i];
            for(var j = 0; j < cluster.length; j++) {
              if(JSON.stringify(value) == JSON.stringify(cluster[j])) {
                return i;
              }
            }
          }
          return null;
        }

        function prepareClusterData(data) {
          var result = [];
          angular.forEach(data, function(value, key) {
            result.push(getClusterRecord(value));
          });
          return result;
        }

        function getClusterRecord(value) {
          var result = [];
          // console.log(value);
          var lastValue = null;
          for(var i = 0; i < value.length; i++) {
            if(typeof value[i] == "undefined") {
              result.push(null);
            } else if(value[i].value == "-") {
              result.push(null);
            } else {
              result.push(value[i].value);
              lastValue = value[i].value;
            }
          }
          // return lastValue;
          return result;
        }

        function getColorList() {
          var result = [];
          var colors = chroma.bezier(["lightyellow", "orange", "deeppink", "darkred"]);
          var cs = chroma.scale(colors).mode('lab').correctLightness(true);
          result.push({name: "Default", scale: cs});
          console.log("l");
        //  console.log(chroma.brewer);
          angular.forEach(chroma.brewer, function(value, key) {
  result.push({name: key, scale: chroma.scale(key)});
});

          // result.push({name: "Default", scale: cs});
          //var cs = chroma.scale("Accent");
        //  var cs = chroma.scale("RdBu");
          // var cs = chroma.scale("Spectral");
          console.log(result);
          return result;
        }

        var scale = d3.scale.linear();
        function getColorScale(steps) {
          // var colorScale = d3.scale.linear().domain(d3.range(0, steps)).range(["#27ae60", "lightgreen", "#e74c3c", "#c0392b"]);
          var domain = d3.range(0, steps);
          console.log(chroma.brewer);
          // var scale = d3.scale.linear().domain(domain);
          var colors = chroma.bezier(["lightyellow", "orange", "deeppink", "darkred"]);
          var cs = chroma.scale(colors).mode('lab').correctLightness(true);
          var cs = chroma.scale("Accent");
        //  var cs = chroma.scale("RdBu");
          var cs = chroma.scale("Spectral");
      // var cs = chroma.scale("BuGn");
      var cs = themeColor.scale;
          return chroma_scale(domain, cs);
        }

        function chroma_scale(domain, chroma_scale) {
   var colors = [];
   scale.domain([0, domain.length])
   var color_scale = chroma.scale();

   for (var i = 0; i < domain.length; i++) {
      var val = scale(i);
      // console.log(val);

      colors.push(chroma_scale(val).darken(0.2).desaturate(0.2));
   }

   return colors;
}


        function getGeoColors(clusterResults) {

          var colorScale = getColorScale(clusterResults.length);
          var result = {};
          var cluster;
          var country;
          //  console.log(colorScale);
          for(var i = 0; i < clusterResults.length; i++) {
            cluster = clusterResults[i];
            for(var j = 0; j < cluster.length; j++) {
              country = cluster[j];
              result[country.code] = colorScale[i].hex();
            }
          }
          return result;
        }

        function getClusterColors(clusterResults) {
          var colorScale = getColorScale(clusterResults.length);
          var result = [];
          for(var i = 0; i < clusterResults.length; i++) {
            result.push(colorScale[i].hex());
          }
          return result;
        }

        function getCentroids() {
          return kmeans.centroids;
        }

        function setThemeColor(c) {
          themeColor = c;
        }

        themeColor = getColorList()[0];








        return service;
    }]);
