'use strict';

(function() {

    angular
        .module('app')
        .service('countdownService', countdownService)

    countdownService.$inject = ['timeFormatterService'];
    
    function countdownService(timeFormatterService) {
        this.updateTimeLeft = function (month, year, days) {
                var today = new Date();
                
                if (month != today.getMonth()+1 || today.getFullYear() != year) {
                    return;
                }
                
                var daynr = today.getDate();
                var nowHours = today.getHours();
                var nowMinutes = today.getMinutes();

                if (!days[daynr])
                    return;

                var end = days[daynr].end;
                var endHours = timeFormatterService.getHoursFromInputFormat(end);
                var endMinutes = timeFormatterService.getMinutesFromInputFormat(end);

                var diff = endHours * 60 + endMinutes - (nowHours * 60 + nowMinutes+1);

                var seconds = 59 - today.getSeconds();

                if (diff < 0)
                {
                    diff +=1; // fixes seconds hack
                    seconds = today.getSeconds();
                    diff = -diff; //don't show negative
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                
                var left = timeFormatterService.minutesToHumanReadableFormat(diff, seconds);
                
                days[daynr].timeLeft = left;
                
                return left;
            };

        
    }

})();