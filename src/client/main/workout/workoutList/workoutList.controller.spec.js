/* jshint -W117, -W030 */
'use strict';
describe('Workout List', function()
{
    describe('Workout List Controller', function()
    {
        var scope;
        var controller;

        beforeEach(function()
        {
          module('main.workout.workoutList');
          inject(function($rootScope, $controller)
          {
            scope = $rootScope.$new();
            controller = $controller('rfaWorkoutListController', {
              $scope: scope
            });
            $rootScope.$apply();
          });
        });
        
        it('should be created successfully', function() {
            expect(controller).to.be.defined;
        });

        it('should have a title', function() {
            expect(controller.workouts).to.be.defined;
            expect(controller.workouts).to.not.be.empty;
            expect(controller.workouts).to.have.length.above(0);
        });
    });
});