(function() {
    'use strict';

    angular
        .module('main.macros.foodList')
        .directive('jxlFoodList', jxlFoodList);

    /* @ngInject */
    function jxlFoodList($timeout, $rootScope, currentDateModel, macrosModel)
    {

        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/foodList/foodList.directive.html',
            controller: 'jxlFoodListController',
            controllerAs: 'vm'
        };
    }

    

})();
