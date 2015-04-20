(function() {
    'use strict';

    angular
        .module('main.workout')
        .directive('rfaWorkout', rfaWorkout);

    function rfaWorkout()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/workout/workout.directive.html',
            controller: 'rfaWorkoutController',
            controllerAs: 'vm'
        };
    }

})();
