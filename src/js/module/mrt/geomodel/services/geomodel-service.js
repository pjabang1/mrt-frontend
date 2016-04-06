angular.module('MRT')
        .factory('geoModelService', ['$http', 'env', 'localStorageService', function($http, env, localStorageService) {


        var urlBase = env.apiUrl;
        var dataFactory = {};
        var cacheKey = 'model_creation';
        var modelTypes = [
          {
            id: 'ge-mckinsey',
            name: 'GE MCKinsey Matrix',
            image: 'img/matrix.png',
            description: "The GE matrix / McKinsey matrix (MKM) is a model to perform a business portfolio analysis on the Strategic Business Units of a corporation. A business portfolio is the collection of Strategic Business Units that make up a corporation.",
            dimensions: [
              {id: 'c-specifics', name: 'Country Specifics', selection: 'single', weighted: true},
              {id: 'm-attractiveness', name: 'Market Attractiveness', selection: 'single', weighted: true}
            ]
          },
          {
            id: '3-dimentional-bubble',
            name: '3 Dimentional Bubble',
            image: 'img/bubble.png',
            description: "A motion chart is a dynamic bubble chart which allows efficient and interactive exploration and visualization of longitudinal multivariate Data.",
            dimensions: [
              {id: 'x-axis', name: 'X-Axis', selection: 'range'},
              {id: 'y-axis', name: 'Y-Axis', selection: 'range'},
              {id: 'bubble-size', name: 'Bubble Size', selection: 'range'}
            ]
          },
          {
            id: 'map',
            name: 'map',
            image: 'img/map.png',
            description: "Map",
            dimensions: [
              {id: 'indicator', name: 'Indicator(s)', selection: 'range'}
            ]
          },
          {
            id: 'weighted-table',
            name: 'Weighted Table',
            image: 'img/charts/graph-5.png',
            description: "Weighted table description",
            dimensions: [
              {id: 'headers', name: 'Headers', selection: 'range', weighted: true},
            ]
          },
          {
            id: 'stack-chart',
            name: 'Stack Chart',
            image: 'img/charts/graph-24.png',
            description: "Stack chart description",
            dimensions: [
              {id: 'x-axis', name: 'X-Axis', selection: 'range'},
            ]
          },
          {
            id: 'line-chart',
            name: 'Line Chart',
            image: 'img/charts/graph-33.png',
            description: "Line chart description",
            dimensions: [
              {id: 'x-axis', name: 'X-Axis', selection: 'range'},
            ]
          },
          {
            id: 'bar-chart',
            name: 'Bar Chart',
            image: 'img/charts/graph-1.png',
            description: "Bar chart description",
            dimensions: [
              {id: 'x-axis', name: 'X-Axis', selection: 'range'},
            ]
          },
          {
            id: 'donut-chart',
            name: 'Donut Chart',
            image: 'img/charts/graph-2.png',
            description: "Donut chart description",
            dimensions: [
              {id: 'donut', name: 'Donut', selection: 'range', weighted: true},
            ]
          }
        ];

        var model = {
          model: '',
          name: '',
          description: '',
          from: '',
          to: '',
          geographies: [],
          indicators: [],
          data: []
        };



        // localStorageService.remove(cacheKey);

        dataFactory.list = function(params) {
            return $http.get(urlBase + '/geomodel/', {
                params: params
            });
        };

        dataFactory.get = function(params) {
            return $http.get(urlBase + '/geomodel/' + params.id);
        };

        function getPostModel(model) {
          var m = {};
          m.name = model.name;
          if(typeof model.id !== 'undefined' && model.id) {
            m.id = model.id;
          }
          m.algorithm_code = model.modelType.name;
          m.description = model.description;
          m.content = JSON.stringify(model);
          return m;
        }

        dataFactory.localSave = function(model) {
          localStorageService.set(cacheKey, model);
        }

        dataFactory.getLocalModel = function() {
          return localStorageService.get(cacheKey);
        }

        dataFactory.getValues = function(params) {
            return $http.get(urlBase + '/geomodel/values', {
                params: params
            });
        };

        dataFactory.new = function(params) {
            return $http.get(urlBase + '/geomodel/new', {
                params: params
            });
        };

        dataFactory.replace = function(data) {
            var m = getPostModel(data);
            return $http.put(urlBase + '/geomodel/replace', m);
        };

        dataFactory.getIndicators = function(params) {
            return $http.get(urlBase + '/geomodel/indicators', {
                params: params
            });
        };

        dataFactory.addCountry = function(country) {

        }

        dataFactory.addIndicatior = function(indicator) {

        }

        dataFactory.getModelTypes = function() {
          return modelTypes;
        }

        dataFactory.start = function() {
          dataFactory.localSave(model);
        }


        if(!localStorageService.get(cacheKey)) {
          dataFactory.localSave(model);
        }

        return dataFactory;
    }]);
