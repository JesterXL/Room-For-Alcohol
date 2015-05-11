// /* jshint -W117, -W030 */
'use strict';
describe('Workout List', function()
{
    describe('Controller', function()
    {
        var scope, controller, $httpBackend, workoutModel;

        beforeEach(function()
        {
            module('main.workout.workoutList');
        });

        beforeEach(function()
        {
          inject(function($rootScope, $controller, _$httpBackend_, _workoutModel_)
          {
            scope = $rootScope.$new();
            workoutModel = _workoutModel_;
            controller = $controller('jxlWorkoutListController', {
              $scope: scope
            });
            $rootScope.$apply();
          });
        });
        
        it('should be created successfully', function()
        {
            expect(controller).to.be.defined;
        });

        it('hasWorkoutForToday is false by default', function()
        {
            expect(controller.hasWorkoutForToday).to.be.false;
        });

        it('todaysWorkout should be null by default', function()
        {
            expect(controller.todaysWorkout).to.not.exist;
        });

        describe('with preset workouts for all days', function()
        {
        	beforeEach(function()
        	{
        		workoutModel.workouts = [
	            {
	                days: [0, 1, 2, 3, 4, 5, 6],
	                notes: null,
	                exercises: [
	                    {
	                        name: 'Squat',
	                        sets: [
	                            {
	                                reps: 5,
	                                weight: 295,
	                                actualReps: 5
	                            },
	                            {
	                                reps: 5,
	                                weight: 295,
	                                actualReps: 5
	                            },
	                            {
	                                reps: 5,
	                                weight: 295,
	                                actualReps: 5
	                            }
	                        ]
	                    },

	                    {
	                        name: 'Bench Press',
	                        sets: [
	                            {
	                                reps: 5,
	                                weight: 180,
	                                actualReps: 5
	                            },
	                            {
	                                reps: 5,
	                                weight: 180,
	                                actualReps: 5
	                            }
	                        ]
	                    },

	                    {
	                        name: 'Deadlift',
	                        sets: [
	                            {
	                                reps: 5,
	                                weight: 315,
	                                actualReps: 5
	                            }
	                        ]
	                    }
	                ]
	            }
	            ];
        	});

			it('todaysWorkout should NOT be null if we have some workouts for all days setup beforehand', function()
	        {
	            expect(controller.todaysWorkout).to.exist;
	        });

			it('hasWorkoutForToday is false by default', function()
	        {
	            expect(controller.hasWorkoutForToday).to.be.true;
	        });
        });
        
    });
});