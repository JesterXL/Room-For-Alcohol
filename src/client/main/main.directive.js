(function() {
    'use strict';

    angular
        .module('main')
        .directive('jxlMain', jxlMain);

    function jxlMain()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: true,
            templateUrl: 'main/main.directive.html',
            controller: 'jxlMainController',
            controllerAs: 'vm'
        };
    }

})();
