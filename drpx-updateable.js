/*
	drpxUpdateable(event: string): fn() 

		fn is a function that eventually makes a $broadcast of the event
		inside a digest loop.

	
*/
;(function(angular) {
	'use strict';

	angular
		.module('drpxUpdateable', [])
		.factory('drpxUpdateable', drpxUpdateableFactory)
		;

	drpxUpdateableFactory.$inject = ['$rootScope']
	function drpxUpdateableFactory  ( $rootScope ) {

		function drpxUpdateable(event) {
			var notifying;

			function update() {
				if (notifying) { return; }

				notifying = true;
				$rootScope.$applyAsync(function updateBroadcast() {
					notifying = false;
					$rootScope.$broadcast(event);
				});
			}

			return update;
		}

		return drpxUpdateable;
	}

})(angular);