'use strict';

(function() {

	angular
	    .module('app')
	    .service('monthPickerModel', monthPickerModel);

	function monthPickerModel() {
			
			var vm = this;
		
			vm.getMonthsToPick = function() {
			
				var result = [];

				var today = new Date();
				// a couple of months of last year
				for (var i = 8; i < 12; i++) {
					result.push({month: i + 1, year: today.getFullYear()-1});
				}
				// full current year
				for (var i = 0; i < 12; i++) {
					result.push({month: i + 1, year: today.getFullYear()});
				}
				// a couple of months of next year
				for (var i = 0; i < 4; i++) {
					result.push({month: i + 1, year: today.getFullYear()+1});
				}

				return result;
			};
		}		
})();