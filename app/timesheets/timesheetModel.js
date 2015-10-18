'use strict';

(function() {

	angular
	    .module('app')
	    .service('timesheetModel', timesheetModel);

    timesheetModel.$inject = ['timeFormatterService', 'config'];
	
	function timesheetModel(timeFormatterService, config) {
			var module = this;
			
			var Day = function (date, daynr) {
				this.date = date;
				this.daynr = daynr;
				this.start = '';
				this.end = '';
				this.billableTime = '';
				this.timeLeft = '';
				this.note = '';
				this.halfday = false;
				this.offday = false;
			};
		
			module.getEmptyTimesheet = function(month, year) {
			
				var result = [];
			
				var isWorkweekDay = function(daynumber) {
					return weekday > 0 && weekday < 6;
				}
			
				var javascriptMonth = month - 1 ; //convert to 0 based months!
				for (var dayCntr = 1; dayCntr < 32; dayCntr++) {
					var d = new Date(year, javascriptMonth, dayCntr);
					var weekday = d.getDay();
					if (d.getMonth() == javascriptMonth) {
						if (isWorkweekDay(weekday))	{
							result[dayCntr] = new Day(d, dayCntr);
						}
					}
				}
				
				return result;
			};
	
			module.onLoaded = function() {
			};
			
			module.load = function(month, year) {
	
				var result = [];
	
				var sheet = JSON.parse(localStorage.getItem(config.savenamePrefix + month+'_'+year));
				
				if (!sheet) {
					result = this.getEmptyTimesheet(month, year);
				} else {
					result = sheet.days;
				}
			
				for (var daynr = 1; daynr < result.length; daynr++) {
					if (result[daynr]) {
						result[daynr].date = new Date(year, month-1, daynr); // necessary when rehydrating, otherwise it's a plain string
						this.computeDiff(result, daynr);
					}
				}
				
				this.calculateTotalOvertime(result);
				
				// clear timeleft
				for (var daynr = 1; daynr < result.length; daynr++) {
					if (result[daynr]) {
						result[daynr].timeLeft = null;
					}
				}
			
				this.clearDirtyFlag(result);
				
				this.onLoaded();
				
				return result;
			};
			
			module.save = function(month, year, days) {
				var backup = localStorage.getItem(config.savenamePrefix + month + '_' + year);
				localStorage.setItem(config.savenamePrefix + '_backup_' + month + '_' + year, backup);
				this.clearDirtyFlag(days);
				localStorage.setItem(config.savenamePrefix + month + '_' + year, JSON.stringify({days: days}));
			};
			
			module.clearDirtyFlag = function(days) {
				for (var daynr = 1; daynr < days.length; daynr++) {
					if (days[daynr]) {
						days[daynr].isDirty = false;
					}
				}
			}
			
			module.computeDiff = function(days, daynr) {
				var start = days[daynr].start;
				var end = days[daynr].end;
	
				if (start == '' || end == '') {
					days[daynr].billableTime = 0;
					days[daynr].overtime = 0;
					return;
				}
			
				var startMinutes = timeFormatterService.getMinutesFromInputFormat(start);
				var endMinutes = timeFormatterService.getMinutesFromInputFormat(end);
				var startHours = timeFormatterService.getHoursFromInputFormat(start);
				var endHours = timeFormatterService.getHoursFromInputFormat(end);
	
				
				var totalDayTime = 8 * 60;
				var breakTimeMinutes = 30;
				if (days[daynr].halfday) {
					totalDayTime = 4 * 60;
					breakTimeMinutes = 0;
				}
	
				var billableTime = endHours*60 + endMinutes - (startHours*60 + startMinutes) - breakTimeMinutes;
				
				if (days[daynr].offday) {
					billableTime = 0 * 60;
					totalDayTime = 0;
				}
				
				days[daynr].billableTime = billableTime;
				
				days[daynr].overtime = billableTime - totalDayTime;
			};
		
			module.computeEnd = function(days, daynr) {
				var start = days[daynr].start;
				var end = days[daynr].end;
				var isHalfDay = days[daynr].halfday;
				var isOffDay = days[daynr].offday;
			
				if (end != "") {
					return;
				}
			
				var startMinutes = timeFormatterService.getMinutesFromInputFormat(start);
				var startHours = timeFormatterService.getHoursFromInputFormat(start);
				
				var totalDayTime = 30 + 8 * 60;
				if (isHalfDay) {
					totalDayTime = 4 * 60;
				}
				
				if (isOffDay) {
					totalDayTime = 0;
				}
				
				if (startHours > 0) {
					var end = startHours * 60 + startMinutes + totalDayTime;
					
					days[daynr].end = timeFormatterService.minutesToInputFormat(end);
				}
			};
		

			module.calculateTotalOvertime = function(days) {
				var totalOT = 0;

				for (var daynr = 1; daynr < days.length; daynr++) {
					if (days[daynr]) {
						if (days[daynr].billableTime != 0) {
						
							var totalDayTime = 8;
							if (days[daynr].halfday) {
								totalDayTime = 4;
								}
	
							if (days[daynr].offday) {
								totalDayTime = 0;
								}               
								
							totalOT += days[daynr].billableTime - totalDayTime * 60;
							days[daynr].totalOvertime = totalOT;
						}
						else {
							days[daynr].totalOvertime = totalOT;
						}
					}
				}
			};        			
		}		
})();