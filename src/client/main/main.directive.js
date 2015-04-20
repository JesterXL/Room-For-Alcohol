(function() {
    'use strict';

    angular
        .module('main')
        .directive('rfaMain', rfaMain);

    function rfaMain()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            templateUrl: 'main/main.directive.html',
            controller: 'rfaMainController',
            controllerAs: 'vm'
        };
    }

})();
