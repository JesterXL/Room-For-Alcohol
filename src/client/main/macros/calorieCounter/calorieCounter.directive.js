(function() {
    'use strict';

    angular
        .module('main.macros.calorieCounter')
        .directive('rfaCalorieCounter', rfaCalorieCounter);

    function rfaCalorieCounter()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/calorieCounter/calorieCounter.directive.html',
            controller: 'rfaCalorieCounterController',
            controllerAs: 'vm'
        };
    }

})();
