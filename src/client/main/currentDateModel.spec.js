/* jshint -W117, -W030 */
'use strict';

describe('currentDateModel', function()
{
  var model;

  beforeEach(function()
  {
    module('main.currentDateModel');
  });

  beforeEach(function()
  {
     inject(function(currentDateModel)
      {
        model = currentDateModel;
      });
  });

  it('should be defined', function()
  {
    expect(model).to.be.defined;
  });

  it('currentDate should not be null', function()
  {
    expect(model.currentDate).to.be.defined;
  });

  it('currentDate should default to today', function()
  {
    // expect(model.currentDate).to.equalDate(new Date());
    // TODO/FIXME: get the bloody chai-datetime working...
    // This randomly fails because datemath, heh
    expect(model.currentDate.getTime()).to.equal(new Date().getTime());
  });

  it('nextDate should be tomorrow', function()
  {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    expect(model.currentDate.getDate()).to.be.equal(today.getDate());
    model.nextDate();
    expect(model.currentDate.getDate()).to.be.equal(tomorrow.getDate());
    expect(model.currentDate.getDate()).to.not.be.equal(today.getDate());
  });

  it('previousDate should be yesterday', function()
  {
    var today = new Date();
    var yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    expect(model.currentDate.getDate()).to.be.equal(today.getDate());
    model.previousDate();
    expect(model.currentDate.getDate()).to.be.equal(yesterday.getDate());
    expect(model.currentDate.getDate()).to.not.be.equal(today.getDate());
  });


 

});