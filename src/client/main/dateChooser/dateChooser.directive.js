(function() {
    'use strict';

    angular
        .module('main.dateChooser')
        .directive('jxlDateChooser', jxlDateChooser);

    function jxlDateChooser()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/dateChooser/dateChooser.directive.html',
            controller: 'jxlDateChooserController',
            controllerAs: 'vm'
        };
    }

})();
