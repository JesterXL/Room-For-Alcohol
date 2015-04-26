(function () {

	angular.module("roomForAlcohol")
		.controller("rfaController", rfaController);

	/* @ngInject */
    function rfaController($scope)
    {
        var vm = this;
        console.log("rfaController:", $scope);
    }
})();
