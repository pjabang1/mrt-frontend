angular.module('Pension').controller('TermSearchCtrl', ['$scope', '$http', '$cookieStore', 'termService', function($scope, $http, $cookieStore, termService) {
        if(!$cookieStore.get('term-search')) {
            $cookieStore.put('term-search', 'Hairdressers');
        }
        $scope.data = {term: $cookieStore.get('term-search')};
        load($scope.data.term);
        $scope.load = load;
        
        function load(term) {
             $cookieStore.put('term-search', term);
             termService.getSearchPageViewMetrics(term);
             termService.getKeywordInterpreterMetrics(term);
             termService.getSynonymMetrics(term);
             
        }
    }]);