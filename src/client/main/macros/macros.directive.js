(function() {
    'use strict';

    angular
        .module('main.macros')
        .directive('rfaMacros', rfaMacros);

    function rfaMacros()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/macros.directive.html',
            controller: 'rfaMacrosController',
            controllerAs: 'vm'
        };
    }

})();
