(function () {

	angular.module("main.workout")
		.controller("jxlWorkoutController", jxlWorkoutController);

	/* @ngInject */
    function jxlWorkoutController($scope, $http, workoutModel)
    {
    	$http.get('http://'+window.location.hostname+':2146/api/workouts')
    		.then(function(response)
    		{
    			// console.log("data:", response.data);
    			workoutModel.workouts = response.data;
    			var showList = workoutModel.workouts
    			.map(function(workout)
    			{
    				if(workout.exercises.length > 0)
    				{
    					return workout.exercises.map(function(workout)
    					{
    						return workout.name;
    					})
    					.join(', ');
    				}
    				else
    				{
    					return 'Rest Day.';
    				}
    			});
    			// console.log("jxlWorkoutController::init, todaysExercises:", showList);
    		});
    }
})();
