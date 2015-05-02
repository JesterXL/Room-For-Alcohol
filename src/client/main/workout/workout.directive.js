(function() {
    'use strict';

    angular
        .module('main.workout')
        .directive('jxlWorkout', jxlWorkout);

    function jxlWorkout()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/workout/workout.directive.html',
            controller: 'jxlWorkoutController',
            controllerAs: 'vm'
        };
    }

})();
