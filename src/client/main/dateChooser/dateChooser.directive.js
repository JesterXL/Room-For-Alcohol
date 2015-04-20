(function() {
    'use strict';

    angular
        .module('main.dateChooser')
        .directive('rfaDateChooser', rfaDateChooser);

    function rfaDateChooser()
    {
        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/dateChooser/dateChooser.directive.html',
            controller: 'rfaDateChooserController',
            controllerAs: 'vm'
        };
    }

})();
