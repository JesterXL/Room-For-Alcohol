(function () {

	angular.module("main.macros")
		.controller("jxlMacrosController", jxlMacrosController);

	/* @ngInject */
    function jxlMacrosController($scope, $http, macrosModel, localStorageService)
    {
        console.log("macrosModel.loaded:", macrosModel.loaded);
        
    	$http.get('http://'+window.location.hostname+':2146/api/calories')
            .then(function(response)
            {
                // console.log("api/calories::response:", response);
                localStorageService.set('macros', response.data.macros);
                macrosModel.macros = response.data.macros;
                macrosModel.loaded = true;
            });
    }
})();
