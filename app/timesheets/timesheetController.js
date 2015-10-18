'use strict';

(function() {

    angular
        .module('app')
        .controller('timesheetController', timesheetController);
        
    timesheetController.$inject = ['$interval', 'timesheetModel', 'monthPickerModel', 'countdownService'];
    
    function timesheetController($interval, timesheetModel, monthPickerModel, countdownService) {
        var vm = this;
        
        var today = new Date();
        vm.currentMonth = today.getMonth()+1; //javascript month is zero based, we like January to be equal to 1
        vm.currentYear = today.getFullYear();
		vm.days = [];
		vm.isLoading = false;
		vm.isDirty = false;
        vm.monthPickerList = monthPickerModel.getMonthsToPick();

        vm.startChanged = function(day) {
          updateTimesheet(day);  
        } 
        
        vm.endChanged = function(day) {
          updateTimesheet(day);  
        }
         
        vm.offdayChanged = function(day) {
            //if offday gets selected, uncheck halfday
            if (day.offday && day.halfday) {
                day.halfday = false;
            }
            updateTimesheet(day);
        }
        
        vm.halfdayChanged = function(day) {
            //if halfday gets selected, uncheck offday
            if (day.offday && day.halfday) {
                day.offday = false;
            }
            updateTimesheet(day);
        }
        
        vm.noteChanged = function(day) {
            day.isDirty = true;
            vm.isDirty = true;
        }
        
        var updateTimesheet = function(day) {
            day.isDirty = true;                       
            vm.isDirty=true;
            timesheetModel.computeEnd(vm.days, day.daynr);
            timesheetModel.computeDiff(vm.days, day.daynr);
            timesheetModel.calculateTotalOvertime(vm.days);
        }

        vm.load = function(month, year) {
            vm.currentMonth = month;
            vm.currentYear = year;
            vm.days = timesheetModel.load(month, year);
            vm.isDirty = false;            
            $.notify("Timesheet loaded", { autoHideDelay: 1000, className: 'success'});
        }
        
        vm.save = function() {
            timesheetModel.save(vm.currentMonth, vm.currentYear, vm.days);            
            vm.isDirty = false;
            $.notify("Timesheet saved", { autoHideDelay: 1000, className: 'success'});
        }
        
        vm.showJson = function() {
            alert(JSON.stringify(vm.days));
        }
        
        // immediate action
        vm.load(vm.currentMonth, vm.currentYear);
        countdownService.updateTimeLeft(vm.currentMonth, vm.currentYear, vm.days)
        $interval(function() {
            countdownService.updateTimeLeft(vm.currentMonth, vm.currentYear, vm.days)
            }, 1000
        );
    }

})();