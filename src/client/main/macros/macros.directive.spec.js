/* jshint -W117, -W030 */
(function() {
    'use strict';
    describe('macros directive:', function() {
        var scope, $httpBackend;

        beforeEach(function() {
            module('main.macros');
        });

        beforeEach(function()
        {
            inject(function(_$httpBackend_)
            {
                $httpBackend = _$httpBackend_;
                var APIURL = 'http://'+window.location.hostname+':2146/api/calories';
                $httpBackend.expectGET('main/macros/macros.directive.html');
                $httpBackend.whenGET('main/macros/macros.directive.html').respond('<b>test</b>');
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
            });
        });

        

        it('is a directive that exists where compile works', function() {
            inject(function($rootScope, $compile, $httpBackend)
            {
                var newScope = $rootScope.$new();
                var element = '<jxl-macros></jxl-macros>';
                element = $compile(element)(newScope);
                newScope.$digest();
            });

        });

    });

}());
