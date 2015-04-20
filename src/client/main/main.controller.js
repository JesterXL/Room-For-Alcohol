(function () {

	angular.module("main")
		.controller("rfaMainController", rfaMainController);

	/* @ngInject */
    function rfaMainController($state, $rootScope)
    {
        var vm = this;
        vm.macrosEnabled = false;
        vm.workoutEnabled = false;
        vm.macrosTab = '';
        vm.workoutTab = '';

        vm.toggleState = function(toState)
        {
        	if(toState == 'macros')
        	{
        		vm.macrosEnabled = true;
        		vm.macrosTab = 'tab';
        		vm.workoutEnabled = false;
        		vm.workoutTab = '';
        	}
        	else
        	{
        		vm.macrosEnabled = false;
        		vm.macrosTab = '';
        		vm.workoutEnabled = true;
        		vm.workoutTab = 'tab';
        	}
        };

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
        {
        	vm.toggleState(toState.name);
        });
        vm.toggleState($state.current.name);

    }
})();
