/* jshint -W117, -W030 */
'use strict';
describe('Main app module:', function() {
    describe('roomForAlcohol', function() {
        var scope;
        beforeEach(function() {

        });
        it('should exist', function() {
           module('roomForAlcohol');
           inject(function($rootScope) {
               scope = $rootScope.$new();
           });
           expect(scope).to.be.ok;

           
           
        });
    });
});