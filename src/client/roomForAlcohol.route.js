(function() {
    'use strict';

    angular
        .module('roomForAlcohol')
        .config(configureRoutes)
        .run(init);

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
            })

            // .state('ships', {
            //     url: '/ships',
            //     template: '<h1>Ships</h1>'
            // })
            ;
    }

    /* @ngInject */
    function init($rootScope, $state)
    {
        $rootScope.$on('$stateChangeStart', 
            function(event, toState, toParams, fromState, fromParams)
            {
                console.log('stateChangeStart, fromState: ' + fromState.name + ', toState: ' + toState.name);
            });

        $rootScope.$on('$stateNotFound', 
            function(event, unfoundState, fromState, fromParams)
            {
                console.warn('stateNotFound, unfoundState: ' + unfoundState.name);
            });

        $rootScope.$on('$stateChangeSuccess', 
            function(event, toState, toParams, fromState, fromParams)
            {
                console.log('stateChangeSuccess, fromState: ' + fromState.name + ', toState: ' + toState.name);
            });

        $rootScope.$on('$stateChangeError', 
            function(event, toState, toParams, fromState, fromParams, error)
            {
                console.error('stateChangeError, fromState: ' + fromState.name + ', toState: ' + toState.name + ', error:', error);
            });
    }



})();