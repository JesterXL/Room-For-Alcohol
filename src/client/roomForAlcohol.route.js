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
                template: '<rfa-macros></rfa-macros>'
            })
            .state('workout', {
                url: '/workout',
                template: '<rfa-workout></rfa-workout>'
            })
            
            .state('ships.type', {
                url: '/ships/:param',
                templateProvider: function ($timeout, $stateParams) {
                    return function()
                    {
                        return '<h1>Ships Param</h1>';
                    };
                }
            })
            .state('ships.decks', {
                url: '/ships/deckplans',
                template: '<h1>Ship Deck Plans</h1>'
            });

            // .state('ships', {
            //     url: '/ships',
            //     template: '<h1>Ships</h1>'
            // })
    }



})();