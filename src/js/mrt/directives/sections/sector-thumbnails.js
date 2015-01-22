angular.module('MRT').directive('sectorThumbnails', sectorThumbnails);
function sectorThumbnails() {
    var directive = {
        restrict: 'AE',
        replace: true,
        templateUrl: 'pension/tpls/section/sector-thumbnails.html'
    };
    return directive;
}
;