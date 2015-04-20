(function () {

	angular.module("main.workout.workoutList")
		.controller("rfaWorkoutListController", rfaWorkoutListController);

	/* @ngInject */
    function rfaWorkoutListController($http)
    {
        var vm = this;
        vm.workouts = null;
        vm.todaysExercises = null;

        function init()
        {
        	$http.get('http://'+window.location.hostname+':2146/api/workouts')
        		.then(function(response)
        		{
        			console.log("data:", response.data);
        			vm.workouts = response.data;
        			vm.todaysExercises = vm.workouts[0].exercises;
        			console.log("vm.todaysExercises:", vm.todaysExercises);
        		});
        }

        init();
    }
})();
