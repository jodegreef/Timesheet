'use strict';

(function() {

    angular
        .module('app')
        .filter('inputFormatToHumanreadableFilter', inputFormatToHumanReadableFilter);    

    function inputFormatToHumanReadableFilter(timeFormatterService) {
        return function (val) {
            if (val == null) {
                return "";
            }
            return timeFormatterService.minutesToHumanReadableFormat(val);
        };
    };

})();