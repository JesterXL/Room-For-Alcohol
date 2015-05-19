var should = require('chai').should();
var expect = require('chai').expect;
var MacroTarget = require('./macroTarget');

describe('MacroTarget', function()
{

  it('exists', function()
  {
    expect(MacroTarget).to.exist;
  });

  it('is a function', function()
  {
    expect(typeof(MacroTarget)).to.equal('function');
  });

  it('returns a MacroTarget instance', function()
  {
    expect(new MacroTarget()).to.exist;
  });

  it('returns a unique MacroTarget instance', function()
  {
    var a = new MacroTarget();
    var b = new MacroTarget();
    expect(a).to.not.equal(b);
  });

  it('has a default days list with all days', function()
  {
    var days = new MacroTarget().days;
    expect(days).to.exist;
    expect(days.length).to.be.above(0);
    expect(days).to.contain(0);
  });

  it('protein is a number and 0', function()
  {
    expect(new MacroTarget().protein).to.equal(0.0);
  });

  it('foods are empty', function()
  {
    var foods = new MacroTarget().foods;
    expect(foods).to.exist;
    expect(foods.length).to.equal(0);
  });
});


