/* jshint -W117, -W030 */
(function() {
    'use strict';
    describe('macros directive:', function() {
        var scope;

        beforeEach(function() {
            module('main', 'main.macros.macroTargets',
                    'main/macros/macroTargets/macroTargets.directive.html');
        });

        // var mockPercentFilter;

        // beforeEach(function()
        // {
        //   module(function($provide) {
        //     $provide.value('precentFilter', mockPercentFilter);
        //   });

        //   mockPercentFilter = function(value) {
        //     return value;
        //   };
        // });

        beforeEach(function()
        {
            var dailyMacros = [{
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

            inject(function(macrosModel)
            {
                macrosModel.macros = dailyMacros;
            });

        });

        it('is a directive that exists where compile works', function() {
            inject(function($rootScope, $compile, $httpBackend)
            {
                var newScope = $rootScope.$new();
                var element = '<jxl-macro-targets></jxl-macro-targets>';
                element = $compile(element)(newScope);
                angular.element(document.body).append(element);
                newScope.$digest();
                expect(element.find('h2').length).to.equal(1);
            });
        });

    });

}());
