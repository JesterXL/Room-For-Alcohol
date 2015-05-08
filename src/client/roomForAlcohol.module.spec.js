/* jshint -W117, -W030 */
'use strict';

describe('Main app module:', function() {
    describe('roomForAlcohol', function() {
        var scope;
        beforeEach(function() {

        });
        it('should have a basic unit test', function()
        {
          expect(true).to.be.true;
        });
        

        it('should exist', function() {
           module('roomForAlcohol');
           inject(function($rootScope) {
               scope = $rootScope.$new();
           });
           expect(scope).to.be.ok;
        });

        it('strings are the same but different vars', function()
        {
          var uuid1 = 'a';
          var uuid2 = 'a';
          expect(uuid1).to.be.equal(uuid2);
        });

        it('strings are different and different vars', function()
        {
          var uuid1 = 'a';
          var uuid2 = 'b';
          expect(uuid1).to.not.be.equal(uuid2);
        });

    });
});