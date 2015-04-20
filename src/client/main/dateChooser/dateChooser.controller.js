(function () {

	angular.module("main.dateChooser")
		.controller("rfaDateChooserController", rfaDateChooserController);

	/* @ngInject */
    function rfaDateChooserController($scope, currentDateModel)
    {
        var vm = this;
        vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        vm.nextDate = function()
        {
        	console.log("rfaDateChooserController::nextDate");
            currentDateModel.nextDate();
            vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        };
        vm.previousDate = function()
        {
        	console.log("rfaDateChooserController::previousDate");
            currentDateModel.previousDate();
            vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        };
    }
})();
