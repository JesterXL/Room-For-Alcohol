(function () {

angular.module("main.macros.foodList")
	.controller("rfaFoodListController", rfaFoodListController);

	/* @ngInject */
	function rfaFoodListController($rootScope, macrosModel, currentDateModel, $http, $scope, localStorageService)
	{
		var vm       = this;
		vm.hasSearchResults = false;
		vm.foodSearch = "";
		vm.foodList = null;
		vm.foodSearchMatches = null;
		vm.macrosTarget = null;
		vm.editAmount = false;
		vm.lastSelectedFood = null;

		// function updateValues()
		// {
		// 	vm.macroTarget = macrosModel.getMacroTargetForDate(currentDateModel.currentDate);
		// }
		 
		vm._updateValues = function()
		{
			vm.macroTarget = macrosModel.getMacroTargetForDate(currentDateModel.currentDate);
		};

        $rootScope.$on('macrosChanged', function()
        {
            console.log("rfaCalorieCounterController::macrosChanged event");
            vm._updateValues();
        });

        $rootScope.$on('currentDateChanged', function()
        {
        	console.log("rfaCalorieCounterController::currentDateChanged event");
        	vm._updateValues();
        });

        vm._updateValues();

		function searchFood()
		{
			$scope.$apply(function()
			{
				if(vm.foodList == null || vm.foodSearch == "" || vm.foodSearch == null)
				{
					vm.foodSearchMatches = null;
					vm.hasSearchResults = false;
					return;
				}
				var lowerCaseFoodSearch = vm.foodSearch;
				var matches = vm.foodList.filter(function(food)
				{
					return food.name.toLowerCase().indexOf(vm.foodSearch.toLowerCase()) > -1;
				})
				.sort(function(foodA, foodB)
				{
					var aStart = _.startsWith(foodA.name.toLowerCase(), lowerCaseFoodSearch);
					var bStart = _.startsWith(foodB.name.toLowerCase(), lowerCaseFoodSearch);
					if(aStart === true && bStart === true)
					{
						return 0;
					}
					else if(aStart === true)
					{
						return -1;
					}
					else if(bStart === true)
					{
						return 1;
					}
					else
					{
						return 0;
					}
				});
				vm.foodSearchMatches = matches.slice(0, (Math.min(6, matches.length)));
				vm.hasSearchResults = vm.foodSearchMatches.length > 0;
			});
		}

		vm.onFoodSearch = _.debounce(searchFood, 300, {leading: true});

		vm.onDeleteFood = function(food)
		{
			vm.macroTarget.removeFood(food);
		};

		vm.onChooseFood = function(food)
		{
			vm.macroTarget.addFood(food);
			vm.hasSearchResults = false;
		};

		vm.onChangeFoodAmount = function(food)
		{
			vm.macroTarget.changeAmountForFood(food, food.amount);
		};

		function init()
		{
			// TODO/FIXME: need a global cache manager
			var cachedFoodList = localStorageService.get('foodList');
			var cachedFoodList = null;
			if(cachedFoodList == null)
			{
				$http.get('http://'+window.location.hostname+':2146/api/foods')
				.then(function(response)
				{
					// console.log("api/foods::response:", response);
					localStorageService.set('foodList', response.data);
					vm.foodList = response.data;
				});
			}
			else
			{
				vm.foodList = cachedFoodList;
			}
		}

		init();
	}

})();
