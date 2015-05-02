(function () {

	angular.module("main.macros.calorieCounter")
		.controller("rfaCalorieCounterController", rfaCalorieCounterController);

	/* @ngInject */
    function rfaCalorieCounterController($rootScope, macrosModel, currentDateModel)
    {
        var vm       = this;
		vm.macroTarget = null;

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

        // date can change quickly, debounce it
        $rootScope.$on('currentDateChanged', function()
        {
        	console.log("rfaCalorieCounterController::currentDateChanged event");
        	vm._updateValues();
        });

        vm._updateValues();
    }
})();
