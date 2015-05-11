(function() {
    'use strict';

    angular
        .module('roomForAlcohol')
        .config(configureRoutes);

    /* @ngInject */
    function configureRoutes($stateProvider)
    {
        $stateProvider
            .state('loading', {
                url: '/loading',
                template: '<h2>Loading...</h2>'
            })
            .state('macros', {
                url: '/macros',
                template: '<jxl-macros></jxl-macros>'
            })
            .state('workout', {
                url: '/workout',
                template: '<jxl-workout></jxl-workout>'
            });
    }

})();