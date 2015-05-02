(function() {
    'use strict';

    angular
        .module('main.macros.calorieCounter')
        .directive('jxlCalorieCounter', jxlCalorieCounter);

    function jxlCalorieCounter()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/calorieCounter/calorieCounter.directive.html',
            controller: 'jxlCalorieCounterController',
            controllerAs: 'vm'
        };
    }

})();
