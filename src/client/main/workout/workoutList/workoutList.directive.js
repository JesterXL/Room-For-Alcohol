(function() {
    'use strict';

    angular
        .module('main.workout.workoutList')
        .directive('jxlWorkoutList', jxlWorkoutList);

    function jxlWorkoutList()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/workout/workoutList/workoutList.directive.html',
            controller: 'jxlWorkoutListController',
            controllerAs: 'vm'
        };
    }

})();
