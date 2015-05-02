/* jshint -W117, -W030 */
'use strict';
describe('Workout List', function()
{
    describe('Workout List Controller', function()
    {
        var scope, controller, $httpBackend;

        beforeEach(function()
        {
            module('main.workout.workoutList');
        });

        beforeEach(function()
        {
          inject(function($rootScope, $controller, _$httpBackend_)
          {
            $httpBackend = _$httpBackend_;
            var WORKOUT_URL = 'http://'+window.location.hostname+':2146/api/workouts';
            $httpBackend.expectGET(WORKOUT_URL);
            $httpBackend.whenGET(WORKOUT_URL).respond([
        {
            days: [1, 3, 5],
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
        },
        
        {
            days: [0, 2, 4, 6],
            notes: null,
            exercises: []
        }
    ]);
            scope = $rootScope.$new();
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

        it('workouts are null by default', function()
        {
            expect(controller.workouts).to.not.exist;
        });

        it('should have workouts if you flush immediately or cached', function()
        {
            $httpBackend.flush();
            expect(controller.workouts).to.exist;
            expect(controller.workouts).to.not.be.empty;
            expect(controller.workouts).to.have.length.above(0);
        });
    });
});