'use strict';

(function() {

    angular
        .module('app')
        .filter('monthNumberToName', function() {
            var months = ['??', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            return function (input) {
            return months[input];
            };
    })
    
})();
