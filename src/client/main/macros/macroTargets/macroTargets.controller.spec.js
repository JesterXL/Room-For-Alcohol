/* jshint -W117, -W030 */
'use strict';

describe('macroTargets controller', function()
{
  var controller, scope, macrosModelTesting;

  beforeEach(function()
  {
    module('main.macros.macroTargets');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, macrosModel)
      {
        scope = _$rootScope_.$new();
        macrosModelTesting = macrosModel;
        controller = _$controller_('jxlMacroTargetsController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be defined', function()
  {
    expect(controller).to.be.exist;
  });
  
  describe('handling events', function()
  {
    beforeEach(function()
    {
      sinon.spy(controller, "_updateValues");
    });

    afterEach(function()
    {
      controller._updateValues.restore();
    });

    it('should called updateChanged based on changing currentDate', function()
    {
      scope.$emit("currentDateChanged");
      expect(controller._updateValues.called).to.be.true;
    });

    it('should called updateChanged based on changing macros', function()
    {
      scope.$emit("macrosChanged");
      expect(controller._updateValues.called).to.be.true;
    });

    it('should have a macroTarget if we have macros today', function()
    {
      macrosModelTesting.macros = [{
        days: [0, 3, 5],
        protein: 0.45,
        carbs: 0.08,
        fat: 0.42,
        adjustment: 0.35,
        goal: 2000,
        food: 0,
        exercise: 300,
        proteinCurrent: 0,
        fatCurrent: 0,
        carbsCurrent: 0,
        foods: []

      },

      {
        days: [1, 2, 4, 6],
        protein: 0.32,
        carbs: 0.48,
        fat: 0.2,
        adjustment: 0,
        goal: 1650,
        food: 0,
        exercise: 300,
        proteinCurrent: 0,
        fatCurrent: 0,
        carbsCurrent: 0,
        foods: []
      }];

      expect(controller.macroTarget).to.exist;

    });
  });

  

  
 

});