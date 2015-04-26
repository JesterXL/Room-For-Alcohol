(function() {
    'use strict';

    console.log("Here we go...");

    angular
        .module('roomForAlcohol', [
            'ui.router',
            'main',
            'main.dateChooser',
            'main.macros'
            ])
        .run(init);

       /* @ngInject */
    function init($state)
    {
        console.log('roomForAlcohol::init');
        // if($state.current.name == '')
        // {
        //     $state.go('macros');
        // }
    }

})();
