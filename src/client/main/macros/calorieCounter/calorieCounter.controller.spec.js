/* jshint -W117, -W030 */
'use strict';

describe('macros model', function()
{
  var controller, scope;

  beforeEach(function()
  {
    module('main.macros.calorieCounter');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_)
      {
        scope = _$rootScope_.$new();
        controller = _$controller_('rfaCalorieCounterController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be defined', function()
  {
    expect(controller).to.be.defined;
  });

  it('macroTarget is not null', function()
  {
    expect(controller.macroTarget).to.be.defined;
  });

  
 

});