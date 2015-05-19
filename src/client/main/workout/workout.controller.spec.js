/* jshint -W117, -W030 */
'use strict';
describe('Workout', function()
{
    describe('Controller', function()
    {
        var scope, controller, $httpBackend, workoutModel;

        beforeEach(function()
        {
            module('main.workout');
        });

        beforeEach(function()
        {
          inject(function($rootScope, $controller, _$httpBackend_, _workoutModel_)
          {
            $httpBackend = _$httpBackend_;
            workoutModel = _workoutModel_;
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
            controller = $controller('jxlWorkoutController', {
              $scope: scope
            });
            $rootScope.$apply();
          });
        });
        
        it('should be created successfully', function()
        {
            expect(controller).to.be.defined;
        });

        it('Avinash should be a pimp', function()
        {
            var Avinash = true;
            Avinash.should.be.true;
        });

        it('workouts are null by default', function()
        {
            expect(controller.workouts).to.not.exist;
        });

        it('should have workouts if you flush immediately or cached', function()
        {
            $httpBackend.flush();
            expect(workoutModel.workouts).to.exist;
            expect(workoutModel.workouts).to.not.be.empty;
            expect(workoutModel.workouts).to.have.length.above(0);
        });
    });
});