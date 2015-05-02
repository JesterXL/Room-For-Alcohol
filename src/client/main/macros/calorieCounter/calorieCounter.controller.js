(function () {

	angular.module("main.macros.calorieCounter")
		.controller("jxlCalorieCounterController", jxlCalorieCounterController);

	/* @ngInject */
    function jxlCalorieCounterController($rootScope, macrosModel, currentDateModel)
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
            console.log("jxlCalorieCounterController::macrosChanged event");
            vm._updateValues();
        });

        // date can change quickly, debounce it
        $rootScope.$on('currentDateChanged', function()
        {
        	console.log("jxlCalorieCounterController::currentDateChanged event");
        	vm._updateValues();
        });

        vm._updateValues();
    }
})();
