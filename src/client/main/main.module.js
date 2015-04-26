(function() {
    'use strict';

    angular
        .module('main', [
            'ui.router',
            'main.dateChooser',
            'main.macros',
            'main.workout'
            ])
        .run(init);

        function init()
        {
        	console.log('main::module');
        }
        
})();
