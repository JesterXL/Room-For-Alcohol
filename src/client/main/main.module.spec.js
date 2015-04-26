/* jshint -W117, -W030 */
'use strict';

describe('main module', function()
{

  it('should have a basic unit test', function()
  {
    expect(true).to.be.true;
  });

  it('should exist', function() {
     module('main');
     var scope;
     inject(function($rootScope) {
         scope = $rootScope.$new();
     });
     expect(scope).to.be.ok;
  });
});