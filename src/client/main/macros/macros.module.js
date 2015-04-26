(function() {
    'use strict';

    angular
        .module('main.macros', [
            'ui.router',
            'main.currentDateModel',
            'main.macros.calorieCounter',
            'main.macros.macroTargets',
            'main.macros.foodList',
            'LocalStorageModule'
            ]);

})();
