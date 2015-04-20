(function () {

	angular.module("main.macros.macroTargets")
		.controller("rfaMacroTargetsController", rfaMacroTargetsController);

	/* @ngInject */
    function rfaMacroTargetsController($rootScope, macrosModel, currentDateModel)
    {
        var vm       = this;
        vm.macrosModel = macrosModel;
        vm.currentDateModel = currentDateModel;

        vm.macroTarget = null;

		function updateValues()
		{
			vm.macroTarget = macrosModel.getMacroTargetForDate(currentDateModel.currentDate);
		}

        $rootScope.$on('macrosChanged', function()
        {
            console.log("rfaCalorieCounterController::macrosChanged event");
            updateValues();
        });

        $rootScope.$on('currentDateChanged', function()
        {
        	console.log("rfaCalorieCounterController::currentDateChanged event");
        	updateValues();
        });

        updateValues();
    }
})();

