(function() {
    'use strict';

    angular
        .module('main.macros.foodList')
        .directive('rfaFoodList', rfaFoodList);

    /* @ngInject */
    function rfaFoodList($timeout, $rootScope, currentDateModel, macrosModel)
    {

        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/foodList/foodList.directive.html',
            controller: 'rfaFoodListController',
            controllerAs: 'vm'
        };
    }

    

})();
