/* jshint -W117, -W030 */
'use strict';

describe('main controller', function()
{
  var controller, scope;

  beforeEach(function()
  {
    module('main');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_)
      {
        scope = _$rootScope_.$new();
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

      // expect(controller.workouts).to.not.be.empty;
      // expect(controller.workouts).to.have.length.above(0);

});