/* jshint -W117, -W030 */
'use strict';

describe('macro target', function()
{
  var service;

  beforeEach(function()
  {
    module('main.macrosModel');
  });

  beforeEach(function()
  {
    inject(function(macroTarget)
    {
      service = macroTarget;
    });
  });

  it('should be defined', function()
  {
    expect(service).to.be.defined;
  });

  it('init can use no parameters', function()
  {
    var create = function()
    {
      service.init();
    };
    expect(create).not.to.throw(Error);
  });

  it("init can use all 0's in 1 line", function()
  {
    var create = function()
    {
      service.init(0, 0, 0);
    };
    expect(create).not.to.throw(Error);
  });

  it('remaining defaults to 0', function()
  {
    expect(service.remaining).to.equal(0);
  });

  it('days defaults to 0', function()
  {
    expect(service.days).to.equal(0);
  });

  it('protein defaults to 0', function()
  {
    expect(service.protein).to.equal(0);
  });

  it('carbs defaults to 0', function()
  {
    expect(service.carbs).to.equal(0);
  });

  it('fat defaults to 0', function()
  {
    expect(service.fat).to.equal(0);
  });

  it('adjustment defaults to 0', function()
  {
    expect(service.adjustment).to.equal(0);
  });
  
  it('proteinCurrent defaults to 0', function()
  {
    expect(service.proteinCurrent).to.equal(0);
  });

  it('carbsCurrent defaults to 0', function()
  {
    expect(service.proteinCurrent).to.equal(0);
  });

  it('fatCurrent defaults to 0', function()
  {
    expect(service.proteinCurrent).to.equal(0);
  });

  it('foods defaults to empty array', function()
  {
    expect(service.foods).to.be.defined;
    expect(service.foods.length).to.be.equal(0);
  });

  it('goal defaults to 0', function()
  {
    expect(service.goal).to.equal(0);
  });

  it('food defaults to 0', function()
  {
    expect(service.food).to.equal(0);
  });

  it('exercise defaults to 0', function()
  {
    expect(service.exercise).to.equal(0);
  });

  it('goal is 1 if you init it such', function()
  {
    service.init(1, 0, 0);
    expect(service.goal).to.equal(1);
  });

  it('food is 1 if you init it such', function()
  {
    service.init(0, 1, 0);
    expect(service.food).to.equal(1);
  });

  it('exercise is 1 if you init it such', function()
  {
    service.init(0, 0, 1);
    expect(service.exercise).to.equal(1);
  });

  it('verify sinon is setup correctly', function()
  {
    var callback = sinon.spy();
    callback();
    assert(callback.called);
  });

  // NOTE: I'm aware I'm testing privates here, just want to showcase
  // a simpler, synchronous version of using Sinon
  it('setting goal updates remaining calories via callback in setter', function()
  {
    var spy = sinon.spy(service, "_updateRemaining");
    service.goal = 1;
    assert(spy.calledOnce);
  });

  it('setting food updates remaining calories via callback in setter', function()
  {
    var spy = sinon.spy(service, "_updateRemaining");
    service.food = 1;
    assert(spy.calledOnce);
  });

  it('setting exercise updates remaining calories via callback in setter', function()
  {
    var spy = sinon.spy(service, "_updateRemaining");
    service.exercise = 1;
    assert(spy.calledOnce);
  });
 



});