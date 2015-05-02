(function () {

	angular.module("main.dateChooser")
		.controller("jxlDateChooserController", jxlDateChooserController);

	/* @ngInject */
    function jxlDateChooserController($scope, currentDateModel)
    {
        var vm = this;
        vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        vm.nextDate = function()
        {
        	console.log("jxlDateChooserController::nextDate");
            currentDateModel.nextDate();
            vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        };
        vm.previousDate = function()
        {
        	console.log("jxlDateChooserController::previousDate");
            currentDateModel.previousDate();
            vm.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        };
    }
})();
