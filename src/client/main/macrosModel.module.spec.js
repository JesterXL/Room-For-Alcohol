/* jshint -W117, -W030 */
'use strict';

describe('macros model', function()
{
  var factory;
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

  var macroDTO = {
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

    };

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
    expect(factory.macros).to.be.empty;
  });


  it('setting array from server decorates and parses macros', function()
  {
    factory.macros = dailyMacros;
    expect(factory.macros).to.be.defined;
    expect(factory.macros).to.not.be.empty;
    expect(factory.macros.length).to.be.above(0);
  });

  it('by default no macros should be returned by date', function()
  {
    expect(factory.getMacroTargetForDate(new Date())).should.not.be.defined;
  });

  describe('parsing of DTOs', function()
  {
    var vo;
    beforeEach(function()
    {
      vo = factory._parseMacroTargetFromDTO(macroDTO);
    });

    afterEach(function()
    {
      vo = null;
    });

     it('successfully parses a DTO', function()
      {
        expect(vo).to.be.defined;
      });

      it('parsed DTO with same values: days', function()
      {
          expect(vo.days).to.be.not.empty;
          expect(vo.days[0]).to.equal(0);
          expect(vo.days[1]).to.equal(2);
      });

      it('parsed DTO with same values: protein', function()
      {
          expect(vo.protein).to.equal(0.45);
      });

      it('parsed DTO with same values: carbs', function()
      {
          expect(vo.carbs).to.equal(0.08);
      });

      it('parsed DTO with same values: fat', function()
      {
          expect(vo.fat).to.equal(0.42);
      });

      it('parsed DTO with same values: adjustment', function()
      {
          expect(vo.adjustment).to.equal(0.35);
      });

      it('parsed DTO with same values: goal', function()
      {
          expect(vo.goal).to.equal(2000);
      });

      it('parsed DTO with same values: food', function()
      {
          expect(vo.food).to.equal(0);
      });

      it('parsed DTO with same values: exercise', function()
      {
          expect(vo.exercise).to.equal(300);
      });

      it('parsed DTO with same values: proteinCurrent', function()
      {
          expect(vo.proteinCurrent).to.equal(0);
      });

      it('parsed DTO with same values: fatCurrent', function()
      {
          expect(vo.fatCurrent).to.equal(0);
      });

      it('parsed DTO with same values: carbsCurrent', function()
      {
          expect(vo.carbsCurrent).to.equal(0);
      });

      it('parsed DTO with same values: foods', function()
      {
          expect(vo.foods.length).to.equal(0);
      });

  });

  function setDay(date, targetDay)
  {
    while(date.getDay() != targetDay)
    {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }

  describe('getting macros for dates', function()
  {
    beforeEach(function()
    {
      factory.macros = dailyMacros;
    });

    afterEach(function()
    {
      factory.macros = [];
    });

    it('carb day Sunday', function()
    {
      var sunday = new Date();
      setDay(sunday, 0);
      var macroTarget = factory.getMacroTargetForDate(sunday);
      expect(macroTarget.goal).to.equal(2000);
    });

    it('fat day Saturday', function()
    {
      var saturday = new Date();
      setDay(saturday, 6);
      var macroTarget = factory.getMacroTargetForDate(saturday);
      expect(macroTarget.goal).to.equal(1650);
    });

    it('eight days still gives you results', function()
    {
      var sunday = new Date();
      setDay(sunday, 0);
      var days = 9;
      var macroTarget;
      for(var i=0; i<days; i++)
      {
        sunday.setDate(sunday.getDate() + 1);
        macroTarget = factory.getMacroTargetForDate(sunday);
        expect(macroTarget).to.be.defined;
      }
      expect(true).to.be.true;  
    });

    it('a fubared date gives you nuffing', function()
    {
      var macroTarget;
      var callback = function()
      {
        macroTarget = factory.getMacroTargetForDate();
      };
      expect(callback).to.throw(Error);
    });

    it('an undefined date gives you nuffing', function()
    {
      var macroTarget;
      var callback = function()
      {
        macroTarget = factory.getMacroTargetForDate(undefined);
      };
      expect(callback).to.throw(Error);
    });

    it('a null date gives you nuffing', function()
    {
      var macroTarget;
      var callback = function()
      {
        macroTarget = factory.getMacroTargetForDate(null);
      };
      expect(callback).to.throw(Error);
    });

  });

 

});