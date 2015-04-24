(function() {
    'use strict';

    angular
        .module('roomForAlcohol', [
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
