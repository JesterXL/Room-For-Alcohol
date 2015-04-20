(function() {
    'use strict';

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
        // if($state.current.name == '')
        // {
        //     $state.go('macros');
        // }
    }

    

})();
