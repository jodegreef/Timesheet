'use strict';

(function() {

    angular
        .module('app')
        .filter('toLocalDateStringFilter', toLocalDateStringFilter)    
	
    function toLocalDateStringFilter() {
        return function (input) {
            if (input) {
                return new Date(input).toLocaleDateString();
            } else {
                return "";
            }
        };
    }

})();
    