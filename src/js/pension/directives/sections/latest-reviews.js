angular.module('Pension').directive('latestReviews', latestReviews);
function latestReviews() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/latest-reviews.html'
    };
    return directive;
}
;