'use strict';

(function() {

    angular
        .module('app')
        .filter('alternatingBackgroundPerWeekFilter', alternatingBackgroundPerWeekFilter);    
	
	function alternatingBackgroundPerWeekFilter() {
        function isToday(date) {
            var today = new Date();
            return (today.getDate() == date.getDate() && today.getMonth() == date.getMonth() && today.getFullYear() == date.getFullYear())
        }
        
        function getDayNr(date) {
            var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            var firstDayOfMonthDayNr = firstDayOfMonth.getDay(); // sun = 0, monday = 1, tuesday = 2, ...
        
            var res = firstDayOfMonthDayNr+date.getDate();
            return res;
        }
        
        function isOddWeek(date) {
            return (Math.floor(getDayNr(date) / 7)) % 2 == 1;
        }

        
        return function (input) {
            if (isToday(input)) {
                return "warning"; // today's date
            }
        
            if (isOddWeek(input)) {
                return ""; // alternative background 1
            } else {
                return "active"; // alternative background 2
            }
        };
    }

})();