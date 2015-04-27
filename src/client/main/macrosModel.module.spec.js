/* jshint -W117, -W030 */
'use strict';

describe('macros model', function()
{
  var factory;

  beforeEach(function()
  {
    module('main.macrosModel');
  });

  beforeEach(function()
  {
     inject(function(macrosModel)
      {
        factory = macrosModel;
      });
  });

  it('should be defined', function()
  {
    expect(factory).to.be.defined;
  });

  it('should not be loaded by default', function()
  {
    expect(factory.loaded).to.be.false;
  });

  it('macros list should be empty', function()
  {
    expect(factory.macros).to.be.defined;
    expect(factory.macros).to.be.empty;
  });

});