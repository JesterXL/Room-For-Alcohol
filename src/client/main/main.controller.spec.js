/* jshint -W117, -W030 */
'use strict';

describe('main controller', function()
{
  var controller, scope, state;

  beforeEach(function()
  {
    module('main');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, _$state_)
      {
        scope = _$rootScope_.$new();
        state = _$state_;
        controller = _$controller_('rfaMainController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be created successfully', function()
  {
      expect(controller).to.be.defined;
  });

  it('macrosEnabled should be false', function()
  {
      expect(controller.macrosEnabled).to.be.false;
  });

  it('workoutEnabled should be false', function()
  {
      expect(controller.workoutEnabled).to.be.false;
  });

  it('macrosTab should be empty', function()
  {
      expect(controller.macrosTab).to.equal('');
  });

  it('workoutTab should be empty', function()
  {
      expect(controller.workoutTab).to.equal('');
  });

  it('state injection worked', function()
  {
      expect(state).to.be.defined;
  });

  it('macrosEnabled is true when you toggle state to macros', function()
  {
      controller.toggleState('macros');
      expect(controller.macrosEnabled).to.be.true;
      expect(controller.workoutEnabled).to.be.false;
  });

  it('workoutEnabled is true when you toggle state to workout', function()
  {
      controller.toggleState('workout');
      expect(controller.macrosEnabled).to.be.false;
      expect(controller.workoutEnabled).to.be.true;
  });

  // TODO: test route resolving with state change success
  // it('macrosEnabled is true when you toggle state to workout via state change event', function()
  // {
  //     state.go('macros');
  //     expect(controller.macrosEnabled).to.be.true;
  //     expect(controller.workoutEnabled).to.be.false;
  // });

      // expect(controller.workouts).to.not.be.empty;
      // expect(controller.workouts).to.have.length.above(0);

});