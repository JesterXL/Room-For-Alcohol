(function () {

	angular.module("main.workout.workoutList")
		.controller("jxlWorkoutListController", jxlWorkoutListController);

	/* @ngInject */
    function jxlWorkoutListController($rootScope, workoutModel, currentDateModel)
    {
        var vm = this;
        vm.hasWorkoutForToday = false;
        vm.todaysWorkout = null;

        vm._updateWorkout = function()
        {
        	vm.todaysWorkout = workoutModel.getWorkoutForDate(currentDateModel.currentDate);
        	// console.log("jxlWorkoutListController::_updateWorkout, vm.todaysWorkout:", vm.todaysWorkout);
        	if(typeof vm.todaysWorkout === 'undefined' || vm.todaysWorkout == null)
        	{
        		vm.hasWorkoutForToday = false;
        	}
        	else
        	{
                if(vm.todaysWorkout.exercises.length > 0)
                {
        		  vm.hasWorkoutForToday = true;
                }
                else
                {
                    vm.hasWorkoutForToday = false;
                }
        	}
        };

        $rootScope.$on('workoutsChanged', function()
        {
        	vm._updateWorkout();
        });

        $rootScope.$on('currentDateChanged', function()
        {
        	vm._updateWorkout();
        });
    }
})();
