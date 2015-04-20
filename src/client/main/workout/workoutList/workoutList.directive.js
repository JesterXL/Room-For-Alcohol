(function() {
    'use strict';

    angular
        .module('main.workout.workoutList')
        .directive('rfaWorkoutList', rfaWorkoutList);

    function rfaWorkoutList()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/workout/workoutList/workoutList.directive.html',
            controller: 'rfaWorkoutListController',
            controllerAs: 'vm'
        };
    }

})();
