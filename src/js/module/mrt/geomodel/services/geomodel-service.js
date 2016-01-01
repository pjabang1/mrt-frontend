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
            dimensions: [
              {id: 'c-specifics', name: 'Country Specifics', selection: 'single', weighted: true},
              {id: 'm-attractiveness', name: 'Market Attractiveness', selection: 'single', weighted: true}
            ]
          },
          {
            id: '3-dimentional-bubble',
            name: '3 Dimentional Bubble',
            image: 'img/bubble.png',
            dimensions: [
              {id: 'x-axis', name: 'X-Axis', selection: 'range'},
              {id: 'y-axis', name: 'Y-Axis', selection: 'range'},
              {id: 'bubble-size', name: 'Bubble Size', selection: 'range'}
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
            return $http.put(urlBase + '/geomodel/replace', data);
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

        if(!localStorageService.get(cacheKey)) {
          dataFactory.localSave(model);
        }


        return dataFactory;
    }]);
