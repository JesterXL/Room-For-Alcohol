/* jshint -W117, -W030 */
'use strict';

describe('foodList controller', function()
{
  var controller, scope, macrosModelTesting, currentDateModelTesting, $httpBackend, $q, $timeout;
  var dailyMacros;
  var foodSmall; // she's actually big, so at the very bottom

  beforeEach(function()
  {
    module('main.macros.foodList');
  });

  beforeEach(function()
  {
     inject(function(_$rootScope_, _$controller_, macrosModel, currentDateModel, _$httpBackend_, _$q_, _$timeout_)
      {
        scope = _$rootScope_.$new();
        macrosModelTesting = macrosModel;
        currentDateModelTesting = currentDateModel;
        macrosModelTesting.macros = dailyMacros;
        $timeout = _$timeout_;
        $q = _$q_;
        $httpBackend = _$httpBackend_;
        var APIURL = 'http://'+window.location.hostname+':2146/api/foods';
        $httpBackend.expectGET(APIURL);
        $httpBackend.whenGET(APIURL).respond(foodSmall);
        controller = _$controller_('jxlFoodListController', {
          $scope: scope
        });
        _$rootScope_.$apply();
      });

     dailyMacros = [{
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
  });

  it('should be defined', function()
  {
    expect(controller).to.be.exist;
  });

  it('starts with no searchResults', function()
  {
    expect(controller.hasSearchResults).to.be.false;
  });

  it('food search is empty by default', function()
  {
    expect(controller.foodSearch).to.be.emtpy;
  });

  it('foodList does not exist', function()
  {
    expect(controller.foodList).to.not.exist;
  });

  it('foodSearchMatches does not exist', function()
  {
    expect(controller.foodSearchMatches).to.not.exist;
  });

  it('editAmount starts to false', function()
  {
    expect(controller.editAmount).to.be.false;
  });

  it('lastSelectedFood does not exist', function()
  {
    expect(controller.lastSelectedFood).to.not.exist;
  });

  describe('handling events', function()
  {
    beforeEach(function()
    {
      sinon.spy(controller, "_updateValues");
    });

    afterEach(function()
    {
      controller._updateValues.restore();
    });

    it('should called updateChanged based on changing currentDate', function()
    {
      scope.$emit("currentDateChanged");
      expect(controller._updateValues.called).to.be.true;
    });

    it('should called updateChanged based on changing macros', function()
    {
      scope.$emit("macrosChanged");
      expect(controller._updateValues.called).to.be.true;
    });

    it('should not have a macroTarget if we have macros today', function()
    {
      macrosModelTesting.macros = [];
      expect(controller.macroTarget).to.not.exist;
    });
  });

  describe('food APIs', function()
  {
    it('foodSmall to work', function()
    {
      expect(foodSmall).to.exist;
    });

    it('macroTarget has no foods by default', function()
    {
      expect(controller.macroTarget.foods).to.be.empty;
    });

    it('macroTarget has food added when you use API', function()
    {
      expect(controller.macroTarget.foods).to.be.empty;
      controller.onChooseFood(foodSmall[0]);
      expect(controller.macroTarget.foods).to.not.be.empty;
    });

    it('removing food ensures array is empty', function()
    {
      expect(controller.macroTarget.foods).to.be.empty;
      var food = foodSmall[0];
      controller.onChooseFood(food);
      expect(controller.macroTarget.foods).to.not.be.empty;
      controller.onDeleteFood(food);
      expect(controller.macroTarget.foods).to.be.empty;
    });

    it('changing food amount does not affect array size', function()
    {
      expect(controller.macroTarget.foods).to.be.empty;
      var food = foodSmall[0];
      controller.onChooseFood(food);
      expect(controller.macroTarget.foods).to.not.be.below(2);
      controller.onChangeFoodAmount(food);
      expect(controller.macroTarget.foods).to.not.be.below(2);
    });

    afterEach(function()
    {
      controller.foodSearch = '';
    });

    it("searching for a food works", function()
    {
      var len = foodSmall.length;
      for(var i=0; i<len; i++)
      {
        var oldFood = foodSmall[i];
        var newFood = {
            name: oldFood.description,
            amount: 1,
            portions: oldFood.portions,
            protein: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Protein";
            }).value,

            carbs: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Carbohydrate, by difference";
            }).value,

            fat: _.find(oldFood.nutrients, function(nutrient)
            {
                return nutrient.description == "Total lipid (fat)";
            }).value
        };

        if(newFood.name.length > 42)
        {
            newFood.shortName = oldFood.description.substr(0, 42) + "...";
        }
        else
        {
            newFood.shortName = newFood.name;
        }
        newFood.calories = (newFood.protein * 4) + (newFood.carbs * 4) + (newFood.fat * 9);
        foodSmall[i] = newFood;
      }

      $httpBackend.flush();
      expect(controller.foodSearchMatches).to.not.exist;
      expect(controller.hasSearchResults).to.be.false;
      controller.foodSearch = "c";
      controller.onFoodSearch();
      expect(controller.foodSearchMatches.length).to.be.above(0);
      expect(controller.hasSearchResults).to.be.true;
  });

});
  








  foodSmall = [
  {
    "id": 1008,
    "description": "Cheese, caraway",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "oz",
        "grams": 28.35
      }
    ],
    "nutrients": [
      {
        "value": 25.18,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 29.2,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.06,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.28,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 376.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.28,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1573.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 673.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.64,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 22.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 490.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 690.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.94,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.024,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.021,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1054.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 262.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 271.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.45,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.27,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 18.584,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.275,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.83,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.324,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.896,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.563,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.412,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.095,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.659,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.326,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.216,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.682,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.952,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.884,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.711,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.618,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.16,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.439,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.838,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.472,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 25.18,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 29.2,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.06,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.28,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 376.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.28,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1573.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 673.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.64,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 22.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 490.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 690.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.94,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.024,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.021,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1054.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 262.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 271.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.45,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.27,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.324,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.896,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.563,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.412,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.095,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.659,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.326,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.216,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.682,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.952,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.884,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.711,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.618,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.16,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.439,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.838,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.472,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 18.584,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.275,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.83,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 25.18,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 29.2,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.06,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.28,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 376.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.28,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1573.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 673.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.64,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 22.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 490.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 690.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.94,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.024,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.021,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1054.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 262.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 271.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.45,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.27,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.324,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.896,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.563,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.412,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.095,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.659,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.326,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.216,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.682,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.952,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.884,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.711,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.618,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.16,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.439,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.838,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.472,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 93.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 18.584,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.275,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.83,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1009,
    "description": "Cheese, cheddar",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup, diced",
        "grams": 132.0
      },
      {
        "amount": 2,
        "unit": "cup, melted",
        "grams": 244.0
      },
      {
        "amount": 3,
        "unit": "cup, shredded",
        "grams": 113.0
      },
      {
        "amount": 4,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 5,
        "unit": "cubic inch",
        "grams": 17.0
      },
      {
        "amount": 6,
        "unit": "slice (1 oz)",
        "grams": 28.0
      }
    ],
    "nutrients": [
      {
        "value": 24.9,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 33.14,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.28,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.93,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 403.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.24,
        "units": "g",
        "description": "Sucrose",
        "group": "Sugars"
      },
      {
        "value": 0.23,
        "units": "g",
        "description": "Lactose",
        "group": "Sugars"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Maltose",
        "group": "Sugars"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 36.75,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1684.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.52,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 721.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.68,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 28.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 512.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 98.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 621.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.11,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 34.9,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 13.9,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1002.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 258.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 265.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 85.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.29,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 24.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.375,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.413,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.83,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 16.5,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 21.092,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.391,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.942,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 0.32,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.886,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.546,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.385,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.072,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.652,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.125,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.311,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.202,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.663,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.941,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.874,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.703,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.6,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.092,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.806,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.456,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 24.9,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 33.14,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.28,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.93,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 403.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.24,
        "units": "g",
        "description": "Sucrose",
        "group": "Sugars"
      },
      {
        "value": 0.23,
        "units": "g",
        "description": "Lactose",
        "group": "Sugars"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Maltose",
        "group": "Sugars"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 36.75,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1684.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.52,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 721.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.68,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 28.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 512.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 98.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 621.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.11,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 34.9,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 13.9,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1002.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 258.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 265.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 85.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.29,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 24.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.375,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.413,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.83,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 16.5,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 2.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.32,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.886,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.546,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.385,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.072,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.652,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.125,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.311,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.202,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.663,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.941,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.874,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.703,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.6,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.092,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.806,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.456,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 21.092,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.391,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.942,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 24.9,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 33.14,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.28,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.93,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 403.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.24,
        "units": "g",
        "description": "Sucrose",
        "group": "Sugars"
      },
      {
        "value": 0.23,
        "units": "g",
        "description": "Lactose",
        "group": "Sugars"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Maltose",
        "group": "Sugars"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 36.75,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1684.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.52,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 721.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.68,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 28.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 512.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 98.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 621.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.11,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.031,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 34.9,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 13.9,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1002.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 258.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 265.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 85.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.29,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 24.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.6,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.375,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.413,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.83,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 16.5,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 2.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 18.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.32,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.886,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.546,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.385,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.072,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.652,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.125,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.311,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.202,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.663,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.941,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.874,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.703,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.6,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.092,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.806,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.456,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 21.092,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.391,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.942,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1018,
    "description": "Cheese, edam",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 2,
        "unit": "package (7 oz)",
        "grams": 198.0
      }
    ],
    "nutrients": [
      {
        "value": 4.22,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 24.99,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 27.8,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 4.22,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 357.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 41.56,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1492.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.44,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 536.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 188.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 965.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.75,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.036,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 825.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 242.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 243.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 11.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.24,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.389,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.082,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.281,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.076,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.54,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.572,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.125,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.665,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.352,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.308,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.57,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.66,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.721,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.255,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.434,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.457,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.81,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.964,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.034,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.764,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.747,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.15,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.486,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.251,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.547,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 24.99,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 27.8,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 357.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 41.56,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1492.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.44,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 536.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 188.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 965.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.75,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.036,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 825.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 242.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 243.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 11.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.24,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.389,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.082,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.281,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.076,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.54,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.352,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.308,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.57,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.66,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.721,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.255,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.434,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.457,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.81,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.964,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.034,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.764,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.747,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.15,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.486,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.251,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.547,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.572,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.125,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.665,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 24.99,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 27.8,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 4.22,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 357.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 41.56,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1492.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.43,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.44,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 536.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 188.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 965.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.75,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.036,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 825.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 242.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 243.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 11.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.24,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.389,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.082,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.281,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.076,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.54,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.352,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.308,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.57,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.66,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.721,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.255,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.434,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.457,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.81,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.964,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.034,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.764,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.747,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 6.15,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.486,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.251,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.547,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.572,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.125,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.665,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1019,
    "description": "Cheese, feta",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup, crumbled",
        "grams": 150.0
      },
      {
        "amount": 2,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 3,
        "unit": "cubic inch",
        "grams": 17.0
      },
      {
        "amount": 4,
        "unit": "wedge (1.33 oz)",
        "grams": 38.0
      }
    ],
    "nutrients": [
      {
        "value": 5.2,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 14.21,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.28,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 5.2,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 264.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 55.22,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1103.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 493.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.65,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 19.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 337.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 62.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1116.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.88,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.032,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.028,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 15.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 422.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.154,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.844,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.991,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.967,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.69,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 14.946,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.623,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.591,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.2,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.637,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.803,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.395,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.219,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.368,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.083,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.675,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.668,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.065,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.47,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.397,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.639,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.779,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 2.421,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.097,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 1.378,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.169,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 14.21,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.28,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 264.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 55.22,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1103.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 493.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.65,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 19.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 337.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 62.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1116.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.88,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.032,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.028,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 15.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 422.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.154,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.844,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.991,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.967,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.69,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.637,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.803,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.395,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.219,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.368,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.083,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.675,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.668,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.065,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.47,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.397,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.639,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.779,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 2.421,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.097,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 1.378,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.169,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 14.946,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.623,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.591,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 14.21,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.28,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 5.2,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 264.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 55.22,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1103.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.09,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 493.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.65,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 19.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 337.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 62.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1116.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.88,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.032,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.028,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 15.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 422.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 125.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.18,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.154,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.844,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.991,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.967,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.69,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 32.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.637,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.803,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.395,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.219,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.368,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.083,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.675,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.668,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.065,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.47,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.397,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.639,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.779,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 2.421,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.097,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 1.378,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.169,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 89.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 14.946,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.623,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.591,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1028,
    "description": "Cheese, mozzarella, part skim milk",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "oz",
        "grams": 28.35
      }
    ],
    "nutrients": [
      {
        "value": 3.27,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 24.26,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 15.92,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.77,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.27,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 254.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 53.78,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1064.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 782.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.22,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 23.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 463.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 84.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 619.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.76,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.4,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 481.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 124.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 127.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 41.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.14,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.018,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.303,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.105,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.82,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.6,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.114,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.51,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.472,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.339,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.924,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.164,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.365,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.464,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.677,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.144,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.266,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.403,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.517,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.042,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.913,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.741,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.757,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.677,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.464,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.498,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.415,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 24.26,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 15.92,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.77,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 254.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 53.78,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1064.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 782.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.22,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 23.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 463.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 84.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 619.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.76,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.4,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 481.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 124.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 127.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 41.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.14,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.018,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.303,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.105,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.82,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.6,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.339,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.924,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.164,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.365,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.464,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.677,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.144,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.266,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.403,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.517,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.042,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.913,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.741,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.757,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.677,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.464,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.498,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.415,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.114,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.51,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.472,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 24.26,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 15.92,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.77,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.27,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 254.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 53.78,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1064.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 782.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.22,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 23.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 463.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 84.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 619.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.76,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.4,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 481.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 124.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 127.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 41.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.14,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.3,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.018,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.303,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.105,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.82,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.6,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 9.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.339,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.924,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.164,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.365,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.464,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.677,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.144,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.266,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.403,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.517,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.042,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.913,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.741,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.757,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.677,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.464,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.498,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.415,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.114,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.51,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.472,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1029,
    "description": "Cheese, mozzarella, part skim milk, low moisture",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup, diced",
        "grams": 132.0
      },
      {
        "amount": 2,
        "unit": "cup, shredded",
        "grams": 113.0
      },
      {
        "amount": 3,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 4,
        "unit": "cubic inch",
        "grams": 18.0
      },
      {
        "amount": 5,
        "unit": "slice (1 oz)",
        "grams": 28.0
      }
    ],
    "nutrients": [
      {
        "value": 3.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 25.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 20.03,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.83,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 302.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 46.46,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1262.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.6,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.25,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 26.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 524.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 652.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.13,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 16.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 605.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 156.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 160.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 51.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 15.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.101,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.329,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.119,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.09,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 2.31,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 54.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.877,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.85,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.508,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.151,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.329,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.138,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.135,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.184,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.222,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.548,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.828,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.912,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.22,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.753,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.86,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 25.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 20.03,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.83,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 302.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 46.46,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1262.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.6,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.25,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 26.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 524.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 652.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.13,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 16.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 605.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 156.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 160.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 51.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 15.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.101,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.329,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.119,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.09,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 2.31,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.151,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.329,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.138,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.135,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.184,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.222,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.548,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.828,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.912,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.22,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.753,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.86,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 54.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.877,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.85,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.508,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 25.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 20.03,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.83,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 3.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 302.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 46.46,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1262.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.6,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 731.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.25,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 26.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 524.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 652.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 3.13,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.027,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.011,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 16.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 605.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 156.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 160.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 51.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 15.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.08,
        "units": "mg",
        "description": "Tocopherol, gamma",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Tocopherol, delta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.101,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.329,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.119,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.09,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.079,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 2.31,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Dihydrophylloquinone",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 10.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.151,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.329,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.138,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.13,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.135,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.184,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.222,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.548,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.828,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.912,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 5.22,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.603,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.753,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.86,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 54.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 10.877,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 4.85,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.508,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1038,
    "description": "Cheese, romano",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 2,
        "unit": "package (5 oz)",
        "grams": 142.0
      }
    ],
    "nutrients": [
      {
        "value": 31.8,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 26.94,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.63,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 387.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 30.91,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1618.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.73,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 1064.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.77,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 760.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 86.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1200.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.58,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 415.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 90.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 96.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 69.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.23,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.077,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.085,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.12,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.2,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 104.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.115,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 7.838,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.593,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.685,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 3.071,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.941,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.852,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.209,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.71,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.775,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 2.183,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.231,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.989,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 7.302,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.553,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.718,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.84,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 31.8,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 26.94,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.63,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 387.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 30.91,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1618.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.73,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 1064.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.77,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 760.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 86.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1200.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.58,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 415.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 90.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 96.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 69.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.23,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.077,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.085,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.12,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.2,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.685,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 3.071,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.941,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.852,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.209,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.71,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.775,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 2.183,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.231,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.989,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 7.302,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.553,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.718,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.84,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 104.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.115,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 7.838,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.593,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 31.8,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 26.94,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 3.63,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.72,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 387.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 30.91,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1618.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.73,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 1064.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.77,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 760.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 86.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1200.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.58,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 415.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 90.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 96.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 69.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.23,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 20.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.5,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.037,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.077,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.424,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.085,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 1.12,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 15.4,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 2.2,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.429,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.685,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 3.071,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.941,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.852,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.209,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.71,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.775,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 2.183,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 1.171,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 1.231,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.932,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.989,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 7.302,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.553,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 3.718,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.84,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 104.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 17.115,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 7.838,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.593,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1039,
    "description": "Cheese, roquefort",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 2,
        "unit": "package (3 oz)",
        "grams": 85.0
      }
    ],
    "nutrients": [
      {
        "value": 21.54,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 30.64,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.0,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.44,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 369.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.38,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1544.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 662.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.56,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 392.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 91.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1809.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.08,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.034,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1047.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 290.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 294.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.586,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.734,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 1.731,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.124,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.64,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 90.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 19.263,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.474,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 1.32,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.303,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.965,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.217,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.114,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.848,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.558,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.023,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.012,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.614,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.713,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.969,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.181,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.67,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.148,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.089,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.772,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 21.54,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 30.64,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.0,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.44,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 369.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.38,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1544.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 662.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.56,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 392.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 91.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1809.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.08,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.034,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1047.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 290.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 294.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.586,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.734,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 1.731,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.124,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.64,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.303,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.965,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.217,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.114,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.848,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.558,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.023,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.012,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.614,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.713,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.969,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.181,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.67,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.148,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.089,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.772,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 90.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 19.263,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.474,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 1.32,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 21.54,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 30.64,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 2.0,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 6.44,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 369.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 39.38,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 1544.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 662.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.56,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 30.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 392.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 91.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1809.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.08,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.034,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 14.5,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 1047.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 290.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 294.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.586,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.734,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 1.731,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.124,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.64,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 49.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.303,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.965,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 1.217,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 2.114,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.848,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.558,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.126,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 1.023,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.012,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.614,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.713,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.969,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.181,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.67,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.148,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.089,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.772,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 90.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 19.263,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 8.474,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 1.32,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1048,
    "description": "Cheese spread, pasteurized process, american, without di sodium phosphate",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup, diced",
        "grams": 140.0
      },
      {
        "amount": 2,
        "unit": "cup",
        "grams": 244.0
      },
      {
        "amount": 3,
        "unit": "oz",
        "grams": 28.35
      },
      {
        "amount": 4,
        "unit": "cubic inch",
        "grams": 18.0
      },
      {
        "amount": 5,
        "unit": "jar (5 oz)",
        "grams": 142.0
      },
      {
        "amount": 6,
        "unit": "slice",
        "grams": 34.0
      },
      {
        "amount": 7,
        "unit": "slice, thin",
        "grams": 14.0
      }
    ],
    "nutrients": [
      {
        "value": 16.41,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.23,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 8.73,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 5.98,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 290.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 47.65,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1215.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 7.32,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 562.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 29.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 712.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 242.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1345.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.59,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.033,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 35.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 11.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 653.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 168.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 173.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.048,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.431,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.131,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.686,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.117,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 36.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.327,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.219,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.624,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.239,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.628,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.833,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.78,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.507,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.538,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.105,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.931,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.89,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.366,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.545,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.509,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.103,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.475,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.311,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.32,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.037,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 16.41,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.23,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 8.73,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 5.98,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 290.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 47.65,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1215.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 7.32,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 562.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 29.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 712.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 242.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1345.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.59,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.033,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 35.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 11.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 653.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 168.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 173.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.048,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.431,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.131,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.686,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.117,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 36.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.239,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.628,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.833,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.78,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.507,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.538,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.105,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.931,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.89,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.366,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.545,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.509,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.103,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.475,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.311,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.32,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.037,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.327,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.219,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.624,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 16.41,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 21.23,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 8.73,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 5.98,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 290.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 47.65,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 1215.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 7.32,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 562.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 29.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 712.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 242.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 1345.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 2.59,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.033,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 35.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 11.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 653.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 168.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 173.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.19,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 16.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.048,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.431,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.131,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.686,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.117,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.4,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 36.2,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 7.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.239,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.628,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.833,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.78,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 1.507,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.538,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.105,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.931,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.89,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 1.366,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.545,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.509,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.602,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 1.103,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 3.475,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.311,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 2.32,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 1.037,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 55.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.327,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.219,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.624,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1049,
    "description": "Cream, fluid, half and half",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup",
        "grams": 242.0
      },
      {
        "amount": 2,
        "unit": "tbsp",
        "grams": 15.0
      },
      {
        "amount": 3,
        "unit": "fl oz",
        "grams": 30.2
      },
      {
        "amount": 4,
        "unit": "container, individual (.5 fl oz)",
        "grams": 15.0
      }
    ],
    "nutrients": [
      {
        "value": 2.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 11.5,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.3,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.67,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 130.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 80.57,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 545.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.16,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 130.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.51,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.001,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 354.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 95.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 97.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 22.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 8.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.035,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.149,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.078,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.289,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.039,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 18.7,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 37.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 7.158,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 3.321,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.427,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.134,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.179,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.29,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.235,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.074,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.027,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.198,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.107,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.102,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.225,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.62,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.063,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.287,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 2.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 11.5,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.3,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.67,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 130.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 80.57,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 545.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.16,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 130.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.51,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.001,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 354.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 95.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 97.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 22.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 8.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.035,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.149,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.078,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.289,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.039,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 18.7,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.134,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.179,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.29,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.235,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.074,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.027,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.198,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.107,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.102,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.225,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.62,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.063,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.287,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 37.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 7.158,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 3.321,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.427,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 2.96,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 11.5,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.3,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.67,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 130.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 80.57,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 545.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.16,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 105.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.07,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 95.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 130.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 41.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.51,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Fluoride, F",
        "group": "Elements"
      },
      {
        "value": 0.001,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.8,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 354.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 95.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 97.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 22.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 8.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D3 (cholecalciferol)",
        "group": "Vitamins"
      },
      {
        "value": 0.2,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.035,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.149,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.078,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.289,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.039,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 18.7,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 1.3,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.7,
        "units": "mg",
        "description": "Betaine",
        "group": "Vitamins"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.134,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.179,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.29,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.235,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.074,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.027,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.143,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.198,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.107,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.102,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.225,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.62,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.063,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.287,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 37.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 7.158,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 3.321,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.427,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1058,
    "description": "Sour dressing, non-butterfat, cultured, filled cream-type",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup",
        "grams": 235.0
      },
      {
        "amount": 2,
        "unit": "tbsp",
        "grams": 12.0
      }
    ],
    "nutrients": [
      {
        "value": 3.25,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 16.57,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.71,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 178.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 74.79,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 743.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 113.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 87.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 162.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 48.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 1.34,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.038,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.163,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.398,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.017,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.9,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 4.1,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.272,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 15.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.958,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.468,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.045,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.147,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.197,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.318,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.258,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.082,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.217,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.118,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.088,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.112,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.247,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.681,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.069,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.315,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.177,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 3.25,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 16.57,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.71,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 178.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 74.79,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 743.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 113.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 87.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 162.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 48.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 1.34,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.038,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.163,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.398,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.017,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.9,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 4.1,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.045,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.147,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.197,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.318,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.258,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.082,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.217,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.118,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.088,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.112,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.247,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.681,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.069,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.315,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.177,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.272,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 15.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.958,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.468,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 3.25,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 16.57,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.71,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 178.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Alcohol, ethyl",
        "group": "Other"
      },
      {
        "value": 74.79,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Caffeine",
        "group": "Other"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Theobromine",
        "group": "Other"
      },
      {
        "value": 743.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 4.68,
        "units": "g",
        "description": "Sugars, total",
        "group": "Composition"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 113.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 87.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 162.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 48.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.37,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.3,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 10.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 3.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Carotene, alpha",
        "group": "Vitamins"
      },
      {
        "value": 1.34,
        "units": "mg",
        "description": "Vitamin E (alpha-tocopherol)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "IU",
        "description": "Vitamin D",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin D (D2 + D3)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Cryptoxanthin, beta",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lycopene",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Lutein + zeaxanthin",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.038,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.163,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.074,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.398,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.017,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.33,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 14.9,
        "units": "mg",
        "description": "Choline, total",
        "group": "Vitamins"
      },
      {
        "value": 4.1,
        "units": "mcg",
        "description": "Vitamin K (phylloquinone)",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 12.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.045,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.147,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.197,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.318,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.258,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.082,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.157,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.217,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.118,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.088,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.112,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.247,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.681,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.069,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.315,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.177,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin E, added",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12, added",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 13.272,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 15.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.958,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.468,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1059,
    "description": "Milk, filled, fluid, with blend of hydrogenated vegetable oils",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "cup",
        "grams": 244.0
      },
      {
        "amount": 2,
        "unit": "quart",
        "grams": 976.0
      }
    ],
    "nutrients": [
      {
        "value": 3.33,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 3.46,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.74,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.8,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 63.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 87.67,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 264.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 128.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.05,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 13.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 97.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 139.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 57.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.36,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 7.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.123,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.087,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.301,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.34,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 0.768,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.783,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.75,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.047,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.201,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.326,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.264,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.084,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.223,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.121,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.09,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.115,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.253,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.697,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.07,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.323,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.181,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 3.33,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 3.46,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.74,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.8,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 63.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 87.67,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 264.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 128.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.05,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 13.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 97.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 139.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 57.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.36,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 7.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.123,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.087,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.301,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.34,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.047,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.201,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.326,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.264,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.084,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.223,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.121,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.09,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.115,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.253,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.697,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.07,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.323,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.181,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 2.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 0.768,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.783,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.75,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 3.33,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 3.46,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 4.74,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.8,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 63.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 87.67,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 264.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 128.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.05,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 13.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 97.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 139.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 57.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.36,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.01,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.002,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 7.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 2.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.9,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.123,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.087,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.301,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.34,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 5.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.047,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.15,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.201,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.326,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.264,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.084,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.161,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.223,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.121,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.09,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.115,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.253,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.697,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.07,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.323,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.181,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 2.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 0.768,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 6.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 1.783,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.75,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  },
  {
    "id": 1068,
    "description": "Cream substitute, liquid, with lauric acid oil and sodium caseinate",
    "tags": [],
    "manufacturer": "",
    "group": "Dairy and Egg Products",
    "portions": [
      {
        "amount": 1,
        "unit": "container, individual",
        "grams": 15.0
      },
      {
        "amount": 2,
        "unit": "cup",
        "grams": 120.0
      }
    ],
    "nutrients": [
      {
        "value": 1.0,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 9.97,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 11.38,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.38,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 136.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 77.27,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 571.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 191.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 79.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.1,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 89.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 4.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 9.304,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 0.106,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.003,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 0.014,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.061,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.099,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.004,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.054,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.057,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.072,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.04,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.071,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.227,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.02,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.113,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.062,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 1.0,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 9.97,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 11.38,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.38,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 136.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 77.27,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 571.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 191.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 79.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.1,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 89.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 4.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.014,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.061,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.099,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.004,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.054,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.057,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.072,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.04,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.071,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.227,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.02,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.113,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.062,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 9.304,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 0.106,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.003,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      },
      {
        "value": 1.0,
        "units": "g",
        "description": "Protein",
        "group": "Composition"
      },
      {
        "value": 9.97,
        "units": "g",
        "description": "Total lipid (fat)",
        "group": "Composition"
      },
      {
        "value": 11.38,
        "units": "g",
        "description": "Carbohydrate, by difference",
        "group": "Composition"
      },
      {
        "value": 0.38,
        "units": "g",
        "description": "Ash",
        "group": "Other"
      },
      {
        "value": 136.0,
        "units": "kcal",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 77.27,
        "units": "g",
        "description": "Water",
        "group": "Composition"
      },
      {
        "value": 571.0,
        "units": "kJ",
        "description": "Energy",
        "group": "Energy"
      },
      {
        "value": 0.0,
        "units": "g",
        "description": "Fiber, total dietary",
        "group": "Composition"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Calcium, Ca",
        "group": "Elements"
      },
      {
        "value": 0.03,
        "units": "mg",
        "description": "Iron, Fe",
        "group": "Elements"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Magnesium, Mg",
        "group": "Elements"
      },
      {
        "value": 64.0,
        "units": "mg",
        "description": "Phosphorus, P",
        "group": "Elements"
      },
      {
        "value": 191.0,
        "units": "mg",
        "description": "Potassium, K",
        "group": "Elements"
      },
      {
        "value": 79.0,
        "units": "mg",
        "description": "Sodium, Na",
        "group": "Elements"
      },
      {
        "value": 0.02,
        "units": "mg",
        "description": "Zinc, Zn",
        "group": "Elements"
      },
      {
        "value": 0.025,
        "units": "mg",
        "description": "Copper, Cu",
        "group": "Elements"
      },
      {
        "value": 0.04,
        "units": "mg",
        "description": "Manganese, Mn",
        "group": "Elements"
      },
      {
        "value": 1.1,
        "units": "mcg",
        "description": "Selenium, Se",
        "group": "Elements"
      },
      {
        "value": 89.0,
        "units": "IU",
        "description": "Vitamin A, IU",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Retinol",
        "group": "Vitamins"
      },
      {
        "value": 4.0,
        "units": "mcg_RAE",
        "description": "Vitamin A, RAE",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin C, total ascorbic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Thiamin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Riboflavin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Niacin",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Pantothenic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Vitamin B-6",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, total",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Vitamin B-12",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folic acid",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg",
        "description": "Folate, food",
        "group": "Vitamins"
      },
      {
        "value": 0.0,
        "units": "mcg_DFE",
        "description": "Folate, DFE",
        "group": "Vitamins"
      },
      {
        "value": 0.014,
        "units": "g",
        "description": "Tryptophan",
        "group": "Amino Acids"
      },
      {
        "value": 0.042,
        "units": "g",
        "description": "Threonine",
        "group": "Amino Acids"
      },
      {
        "value": 0.061,
        "units": "g",
        "description": "Isoleucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.099,
        "units": "g",
        "description": "Leucine",
        "group": "Amino Acids"
      },
      {
        "value": 0.08,
        "units": "g",
        "description": "Lysine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Methionine",
        "group": "Amino Acids"
      },
      {
        "value": 0.004,
        "units": "g",
        "description": "Cystine",
        "group": "Amino Acids"
      },
      {
        "value": 0.054,
        "units": "g",
        "description": "Phenylalanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.057,
        "units": "g",
        "description": "Tyrosine",
        "group": "Amino Acids"
      },
      {
        "value": 0.072,
        "units": "g",
        "description": "Valine",
        "group": "Amino Acids"
      },
      {
        "value": 0.04,
        "units": "g",
        "description": "Arginine",
        "group": "Amino Acids"
      },
      {
        "value": 0.03,
        "units": "g",
        "description": "Histidine",
        "group": "Amino Acids"
      },
      {
        "value": 0.031,
        "units": "g",
        "description": "Alanine",
        "group": "Amino Acids"
      },
      {
        "value": 0.071,
        "units": "g",
        "description": "Aspartic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.227,
        "units": "g",
        "description": "Glutamic acid",
        "group": "Amino Acids"
      },
      {
        "value": 0.02,
        "units": "g",
        "description": "Glycine",
        "group": "Amino Acids"
      },
      {
        "value": 0.113,
        "units": "g",
        "description": "Proline",
        "group": "Amino Acids"
      },
      {
        "value": 0.062,
        "units": "g",
        "description": "Serine",
        "group": "Amino Acids"
      },
      {
        "value": 0.0,
        "units": "mg",
        "description": "Cholesterol",
        "group": "Other"
      },
      {
        "value": 9.304,
        "units": "g",
        "description": "Fatty acids, total saturated",
        "group": "Other"
      },
      {
        "value": 9.0,
        "units": "mg",
        "description": "Phytosterols",
        "group": "Other"
      },
      {
        "value": 0.106,
        "units": "g",
        "description": "Fatty acids, total monounsaturated",
        "group": "Other"
      },
      {
        "value": 0.003,
        "units": "g",
        "description": "Fatty acids, total polyunsaturated",
        "group": "Other"
      }
    ]
  }
];
  
 

});