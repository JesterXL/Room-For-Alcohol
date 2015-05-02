(function() {
    'use strict';

    angular
        .module('main.macros')
        .directive('jxlMacros', jxlMacros);

    function jxlMacros()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/macros.directive.html',
            controller: 'jxlMacrosController',
            controllerAs: 'vm'
        };
    }

})();
