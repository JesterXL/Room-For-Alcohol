var should = require('chai').should();
var expect = require('chai').expect;
var Food = require('./food');

describe('Food', function()
{

  it('exists', function()
  {
    expect(Food).to.exist;
  });

  it('is a function', function()
  {
    expect(typeof(Food)).to.equal('function');
  });

  it('returns a Food instance', function()
  {
    expect(new Food()).to.exist;
  });

  it('returns a unique Food instance', function()
  {
    var a = new Food();
    var b = new Food();
    expect(a).to.not.equal(b);
  });

  it('has a default name', function()
  {
    expect(new Food().name).to.equal('Default');
  });

});


