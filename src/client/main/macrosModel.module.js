(function() {
    'use strict';

    angular
        .module('main.macrosModel', [
            ])
        .factory('macrosModel', macrosModel);

    /* @ngInject */
    function macrosModel($rootScope)
    {
        var _macros = [];

    	function updateRemaining(macroTarget)
    	{
            console.log("macrosModel::updateRemaining, macroTarget:", macroTarget);
            macroTarget.remaining = macroTarget.goal - macroTarget.food + macroTarget.exercise;
        }

        /*
        days: [0, 2, 4, 6],
        protein: 0.45,
        carbs: 0.08,
        fat: 0.42,
        adjustment: 0.35,
        goal: 2000,
        foods: 0,
        exercise: 300,
        proteinCurrent: 0,
        fatCurrent: 0,
        carbsCurrent: 0,
        foods: []
         */
        function getMacroTarget(macroTargetDTO)
        {
            var _goal = macroTargetDTO.goal;
            var _food = macroTargetDTO.food;
            var _exercise = macroTargetDTO.exercise;

            function updateTotalFoodCaloriesAndMacros(target)
            {
                _food = 0;
                target.proteinCurrent = 0;
                target.carbsCurrent = 0;
                target.fatCurrent = 0;
                var totalProtein = 0;
                var totalCarbs = 0;
                var totalFat = 0;
                _.forEach(target.foods, function(food)
                {
                    _food += food.calories * food.amount;
                    totalProtein += food.protein * food.amount;
                    totalCarbs += food.carbs * food.amount;
                    totalFat += food.fat * food.amount;
                });
                var totalCalories = (totalProtein * 4) + (totalCarbs * 4) + (totalFat * 9);
                target.proteinCurrent = (totalProtein * 4) / totalCalories;
                target.carbsCurrent = (totalCarbs * 4) / totalCalories;
                target.fatCurrent = (totalFat * 4) / totalCalories;
                $rootScope.$broadcast('macrosChanged');
            }

            var target = {
                
                remaining: 0,

                days: macroTargetDTO.days,
                protein: macroTargetDTO.protein,
                carbs: macroTargetDTO.carbs,
                fat: macroTargetDTO.fat,
                adjustment: macroTargetDTO.adjustment,
                proteinCurrent: macroTargetDTO.proteinCurrent,
                carbsCurrent: macroTargetDTO.carbsCurrent,
                fatCurrent: macroTargetDTO.fatCurrent,
                foods: macroTargetDTO.foods,

                get goal()
                {
                    return _goal;
                },

                set goal(value)
                {
                    _goal = value;
                    updateRemaining(target);
                },

                get food()
                {
                    return _food;
                },

                set food(value)
                {
                    _food = value;
                    updateRemaining(target);
                },

                get exercise()
                {
                    return _exercise;
                },

                set exercise(value)
                {
                    _exercise = value;
                    updateRemaining(target);
                },

                addFood: function(food)
                {
                    target.foods.push(food);
                    updateTotalFoodCaloriesAndMacros(target);
                },

                removeFood: function(food)
                {
                    target.foods.splice(target.foods.indexOf(food), 1);
                    updateTotalFoodCaloriesAndMacros(target);
                },

                changeAmountForFood: function(food, newAmount)
                {
                    food.amount = newAmount;
                    updateTotalFoodCaloriesAndMacros(target);
                }

            };

            updateRemaining(target);

            return target;
        }

        var model = {

            loaded: false,
            foods: [],

            get macros()
            {
                return _macros;
            },

            set macros(newMacros)
            {
                _macros    = [];
                // take our Data Transfer Objects, cover to Value Objects
                if(newMacros && newMacros.length > 0)
                {
                    _.forEach(newMacros, function(dto)
                    {
                        _macros.push(getMacroTarget(dto));
                    });
                }
                $rootScope.$broadcast('macrosChanged');
            },

            getMacroTargetForDate: function(date)
            {
                return _.find(_macros, function(macroTarget)
                {
                    return _.includes(macroTarget.days, date.getDay());
                });
            }
        };
        
        return model;
    }



})();
