'use strict';

(function() {

    angular
        .module('app')
        .filter('emptyFilter', emptyFilter);    
	
    function emptyFilter() {
        return function (arr) {
            var newArray = new Array();
            for(var i = 0; i<arr.length; i++){
                if (arr[i]){
                    newArray.push(arr[i]);
                }
            }
            return newArray;
        };
    }

})();
    