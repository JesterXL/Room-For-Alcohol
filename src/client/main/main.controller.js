(function () {

	angular.module("main")
		.controller("jxlMainController", jxlMainController);

	/* @ngInject */
    function jxlMainController($state, $rootScope, $location, $http)
    {
        var vm = this;
        vm.macrosEnabled = false;
        vm.workoutEnabled = false;
        vm.macrosTab = '';
        vm.workoutTab = '';
        vm.username = '';
        vm.password = '';

        vm.toggleState = function(toState)
        {
        	if(toState === 'macros')
        	{
        		vm.macrosEnabled = true;
        		vm.macrosTab = 'tab';
        		vm.workoutEnabled = false;
        		vm.workoutTab = '';
        	}
        	else if(toState === 'workout')
        	{
        		vm.macrosEnabled = false;
        		vm.macrosTab = '';
        		vm.workoutEnabled = true;
        		vm.workoutTab = 'tab';
        	}
            else
            {
                vm.macrosEnabled = false;
                vm.macrosTab = '';
                vm.workoutEnabled = false;
                vm.workoutTab = '';
            }
        };

        vm.doStuff = function()
        {
            $http.post('http://'+window.location.hostname+':2146/api/login',
                {username: vm.username,
                    password: vm.password})
            .then(function(response)
            {
                console.log("response:", response.data);
            });
        };
        

        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams)
        {
        	vm.toggleState(toState.name);
        });
        vm.toggleState($state.current.name);

    }
})();
