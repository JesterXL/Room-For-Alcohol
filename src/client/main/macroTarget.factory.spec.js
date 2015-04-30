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
      service = new macroTarget();
    });
  });

  describe('basic service plumbing', function()
  {
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
  });

  describe('default property values', function()
  {
    it('remaining defaults to 0', function()
    {
      expect(service.remaining).to.equal(0);
    });

    it('days defaults to 0', function()
    {
      expect(service.days).to.be.empty;
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
  });

  describe('remaining calorie calculations', function()
  {
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
   
    it('goal to 1 means remaining is 1', function()
    {
      service.goal = 1;
      expect(service.remaining).to.equal(1);
    });

    it('food to 1 means remaining is 1', function()
    {
      service.food = -1;
      expect(service.remaining).to.equal(1);
    });

    it('exercise to 1 means remaining is -1', function()
    {
      service.exercise = 1;
      expect(service.remaining).to.equal(1);
    });

    it('goal is 2000, food is 2000, and exercise is 500, then remaining is 500', function()
    {
      service.goal = 2000;
      service.food = 2000;
      service.exercise = 500;
      expect(service.remaining).to.equal(500);
    });

    it('goal is 1000, food is 900, and exercise is 0, then remaining is 100', function()
    {
      service.goal = 1000;
      service.food = 900;
      service.exercise = 0;
      expect(service.remaining).to.equal(100);
    });

    it('goal is 1000, food is 900, and exercise is 300, then remaining is 400', function()
    {
      service.goal = 1000;
      service.food = 900;
      service.exercise = 300;
      expect(service.remaining).to.equal(400);
    });

    it('goal is 1000, food is 1200, and exercise is 0, then remaining is -200', function()
    {
      service.goal = 1000;
      service.food = 1200;
      service.exercise = 0;
      expect(service.remaining).to.equal(-200);
    });
  });

  describe('food calculations', function()
  {
    var mockFood, mockFood2;
    beforeEach(function()
    {
      mockFood = {
        name: 'default',
        portions: ['1 cup'],
        protein: 3,
        carbs: 2,
        fat: 1,
        shortName: 'def',
        calories: 29,
        amount: 1
      };

      mockFood2 = {
        name: 'default 2',
        portions: ['1 cup'],
        protein: 1,
        carbs: 3,
        fat: 4,
        shortName: 'def 2',
        calories: 52,
        amount: 1
      };

    });

    it('macro taret has a default empty array of foods', function()
    {
      expect(service.foods).to.be.defined;
      expect(service.foods.length).to.equal(0);
    });

    // TODO: mock food
    it('adding food updates the list', function()
    {
      service.addFood(mockFood);
      expect(service.foods.length).to.equal(1);
    });

    it('removing food updates the list', function()
    {
      service.addFood(mockFood);
      expect(service.foods.length).to.equal(1);
      service.removeFood(mockFood);
      expect(service.foods.length).to.equal(0);
    });

    it('changing food amount does not affect list length', function()
    {
      service.addFood(mockFood);
      expect(service.foods.length).to.equal(1);
      service.changeAmountForFood(mockFood, 2);
      expect(service.foods.length).to.equal(1);
    });

    it('adding food updates food calorie count', function()
    {
      service.addFood(mockFood);
      expect(service.food).to.equal(29);
    });

    it('adding food does not update food calorie count if amount is 0', function()
    {
      mockFood.amount = 0;
      service.addFood(mockFood);
      expect(service.food).to.equal(0);
    });

    it('adding food does updates food calorie double the calories if amount is 2', function()
    {
      mockFood.amount = 2;
      service.addFood(mockFood);
      expect(service.food).to.equal(58);
    });

    it('adding food updates protein percentage', function()
    {
      service.addFood(mockFood);
      expect(service.proteinCurrent).to.equal(0.41379310344827586);
    });

    it('adding food updates carbs percentage', function()
    {
      service.addFood(mockFood);
      expect(service.carbsCurrent).to.equal(0.27586206896551724);
    });

    it('adding food updates fat percentage', function()
    {
      service.addFood(mockFood);
      expect(service.fatCurrent).to.equal(0.3103448275862069);
    });

    it('adding 2 foods of different types still works', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood2);
      expect(service.foods.length).to.equal(2);
    });

    it('adding 2 foods, then removing makes list equal 1', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood2);
      expect(service.foods.length).to.equal(2);
      service.removeFood(mockFood);
      expect(service.foods.length).to.equal(1);
    });

    it('adding 2 foods, then removing makes list equal 1, order does not matter', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood2);
      expect(service.foods.length).to.equal(2);
      service.removeFood(mockFood2);
      expect(service.foods.length).to.equal(1);
    });

    it('adding 2 foods equals more calories', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood2);
      expect(service.food).to.equal(81);
    });

    it('adding 2 foods, then removing the 29 equals 52', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood2);
      service.removeFood(mockFood);
      expect(service.food).to.equal(52);
    });

    it('adding 2 foods twice is ok and doubles the calories', function()
    {
      service.addFood(mockFood);
      service.addFood(mockFood);
      expect(service.food).to.equal(58);
    });

  });

});