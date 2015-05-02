/* jshint -W117, -W030 */
'use strict';

describe('macroTargets controller', function()
{
  var controller, scope, macrosModelTesting, $httpBackend;

  beforeEach(function()
  {
    module('main.macros');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, macrosModel, _$httpBackend_)
      {
        scope = _$rootScope_.$new();
        macrosModelTesting = macrosModel;
        $httpBackend = _$httpBackend_;
		    var APIURL = 'http://'+window.location.hostname+':2146/api/calories';
        $httpBackend.expectGET(APIURL);
        $httpBackend.whenGET(APIURL).respond([
            {
                days: [0, 2, 4, 6],
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
                days: [1, 3, 5],
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
            }
        ]);

        controller = _$controller_('jxlMacrosController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });
  });

  it('should be defined', function()
  {
    expect(controller).to.be.exist;
  });

	it('macrosModel is empty before and ready after', function()
	{
		expect(macrosModelTesting.macros).to.be.emtpy;
		$httpBackend.flush();
		expect(macrosModelTesting.macros).to.not.be.emtpy;
	});

});