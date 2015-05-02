(function () {

	angular.module("main.macros.macroTargets")
		.controller("jxlMacroTargetsController", jxlMacroTargetsController);

	/* @ngInject */
    function jxlMacroTargetsController($rootScope, macrosModel, currentDateModel)
    {
        var vm       = this;

        vm.macroTarget = null;

		vm._updateValues = function()
		{
			vm.macroTarget = macrosModel.getMacroTargetForDate(currentDateModel.currentDate);
		};

        $rootScope.$on('macrosChanged', function()
        {
            console.log("jxlCalorieCounterController::macrosChanged event");
            vm._updateValues();
        });

        $rootScope.$on('currentDateChanged', function()
        {
        	console.log("jxlCalorieCounterController::currentDateChanged event");
        	vm._updateValues();
        });

        vm._updateValues();
    }
})();

