declare var angular:any;

class RoomForAlcohol
{
	constructor()
	{
		console.log("RoomForAlcohol::constructor");
		var myApp = angular
        .module('RoomForAlcohol', [
            'ui.router',
            'main',
            'main.dateChooser',
            'main.macros'
            ]);
        angular.element(document).ready(function()
        {
            console.log("document::ready");
            angular.bootstrap(document, ["RoomForAlcohol"]);
        });
	}
}

var app = new RoomForAlcohol();

export = RoomForAlcohol;

