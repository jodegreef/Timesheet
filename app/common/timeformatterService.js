'use strict';

(function() {

    angular
        .module('app')
        .service('timeFormatterService', timeFormatterService);


    function timeFormatterService() {

        // inputFormat example: '900' instead of '9:00'
        this.getHoursFromInputFormat = function(input) {
            var hours = 0;
            if (input.length > 3) {
                hours = input.substring(0, 2);
            } else if (input.length > 2) {
                hours = input.substring(0,1);
            }
            return parseInt(hours);
        };
    
        this.getMinutesFromInputFormat = function(input) {
            var minutes = 0;
            if (input.length > 3) {
                minutes = input.substring(2, 4);
            } else if (input.length > 2) {
                minutes = input.substring(1,3);
            }
            return parseInt(minutes);
        };
            
            
        this.minutesToHumanReadableFormat = function(minutes, seconds) {
            return minutesToFormat(minutes, ":", seconds);
        }

        this.minutesToInputFormat = function(minutes) {
            return minutesToFormat(minutes, "");
        }

        var minutesToFormat = function(val, seperator, seconds) {
            if (val === "") {
                return "0:00";
            }
        
            var minutes = Math.abs(val % 60);
            if (minutes < 10 && minutes > -1) {
                minutes = "0"+minutes;
            }
            
            var hours = Math.floor(Math.abs(val/60));
            
            var sign="";
            if (val < 0) {
                sign="-";
            }
            
            var result = sign + hours + seperator + minutes;
            
            if (seconds) {
                result += seperator + seconds;
            }
                
            return result;
        }
    }

})();