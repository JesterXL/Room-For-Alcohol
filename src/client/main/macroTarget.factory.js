(function() {
    'use strict';

    angular
        .module('main.macrosModel')
        .factory('macroTarget', macroTargetFactory);
    
    function macroTargetFactory($rootScope)
    {
        function macroTarget()
        {
            var _goal     = 0;
            var _food     = 0;
            var _exercise = 0;

            var target = {
                
                remaining: 0,
                
                days: [],
                protein: 0,
                carbs: 0,
                fat: 0,
                adjustment: 0,
                proteinCurrent: 0,
                carbsCurrent: 0,
                fatCurrent: 0,
                foods: [],

                get goal()
                {
                    return _goal;
                },

                set goal(value)
                {
                    _goal = value;
                    target._updateRemaining(target);
                },

                get food()
                {
                    return _food;
                },

                set food(value)
                {
                    _food = value;
                    target._updateRemaining(target);
                },

                get exercise()
                {
                    return _exercise;
                },

                set exercise(value)
                {
                    _exercise = value;
                    target._updateRemaining(target);
                },

                init: function(goal, food, exercise)
                {
                    if(typeof(goal) == "number")
                    {
                        _goal     = goal;
                        _food     = food;
                        _exercise = exercise;
                    }
                    else if(typeof(goal) == "object")
                    {
                        var dto               = goal;
                        target.remaining      = dto.remaining;
                        target.days           = dto.days;
                        target.protein        = dto.protein;
                        target.carbs          = dto.carbs;
                        target.fat            = dto.fat;
                        target.adjustment     = dto.adjustment;
                        target.proteinCurrent = dto.proteinCurrent;
                        target.carbsCurrent   = dto.carbsCurrent;
                        target.fatCurrent     = dto.fatCurrent;
                        target.foods          = dto.foods;
                        _goal                 = dto.goal;
                        _food                 = dto.food;
                        _exercise             = dto.exercise;
                        target._updateRemaining(target);
                    }
                    return target;
                },

                addFood: function(food)
                {
                    // console.log("*** addFood");
                    // throw new Error("where");
                    target.foods.push(food);
                    target._updateTotalFoodCaloriesAndMacros(target);
                },

                removeFood: function(food)
                {
                    target.foods.splice(target.foods.indexOf(food), 1);
                    target._updateTotalFoodCaloriesAndMacros(target);
                },

                changeAmountForFood: function(food, newAmount)
                {
                    if(newAmount < 0)
                    {
                        newAmount = 0;
                    }
                    food.amount = newAmount;
                    target._updateTotalFoodCaloriesAndMacros(target);
                },

                clearFoods: function()
                {
                    target.foods = [];
                    target._updateTotalFoodCaloriesAndMacros(target);
                },

                _updateRemaining: function(macroTarget)
                {
                    macroTarget.remaining = macroTarget.goal - macroTarget.food + macroTarget.exercise;
                },
                
                _updateTotalFoodCaloriesAndMacros: function(macroTarget)
                {
                    _food                      = 0;
                    macroTarget.proteinCurrent = 0;
                    macroTarget.carbsCurrent   = 0;
                    macroTarget.fatCurrent     = 0;
                    var totalProtein           = 0;
                    var totalCarbs             = 0;
                    var totalFat               = 0;

                    _.forEach(macroTarget.foods, function(food)
                    {
                        _food        += food.calories * food.amount;
                        totalProtein += food.protein * food.amount;
                        totalCarbs   += food.carbs * food.amount;
                        totalFat     += food.fat * food.amount;
                    });

                    var totalCalories          = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
                    macroTarget.proteinCurrent = (totalProtein * 4) / totalCalories;
                    macroTarget.carbsCurrent   = (totalCarbs * 4) / totalCalories;
                    macroTarget.fatCurrent     = (totalFat * 9) / totalCalories;
                    $rootScope.$broadcast('macrosChanged');
                }
            };
            target._updateRemaining(target);
            return target;
        }
        return macroTarget;
    }

})();
