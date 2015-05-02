/* jshint -W117, -W030 */
'use strict';

describe('macros model', function()
{
  var controller, scope;

  beforeEach(function()
  {
    module('main.dateChooser');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_)
      {
        scope = _$rootScope_.$new();
        controller = _$controller_('jxlDateChooserController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be defined', function()
  {
    expect(controller).to.be.defined;
  });

  it('currentDateString change based on nextDate', function()
  {
    var now = controller.currentDateString;
    controller.nextDate();
    expect(controller.currentDateString).to.not.equal(now);
  });

  it('currentDateString change based on previousDate', function()
  {
    var now = controller.currentDateString;
    controller.previousDate();
    expect(controller.currentDateString).to.not.equal(now);
  });

  
 

});