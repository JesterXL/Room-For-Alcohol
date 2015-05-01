(function() {
    'use strict';

    angular
        .module('main.macrosModel', [])
        .factory('macrosModel', macrosModel);

    /* @ngInject */
    function macrosModel($rootScope, macroTarget)
    {
        var _macros = [];

        /*
        days: [0, 2, 4, 6],
        protein: 0.45,
        carbs: 0.08,
        fat: 0.42,
        adjustment: 0.35,
        goal: 2000,
        foods: 0,
        exercise: 300,
        proteinCurrent: 0,
        fatCurrent: 0,
        carbsCurrent: 0,
        foods: []
         */
        
        var model = {

            loaded: false,

            get macros()
            {
                return _macros;
            },

            set macros(newMacros)
            {
                _macros    = [];
                // take our Data Transfer Objects, cover to Value Objects
                if(newMacros && newMacros.length > 0)
                {
                    _.forEach(newMacros, function(dto)
                    {
                        _macros.push(model._parseMacroTargetFromDTO(dto));
                    });
                }
                $rootScope.$broadcast('macrosChanged');
            },

            getMacroTargetForDate: function(date)
            {
                var result = _.find(_macros, function(macroTarget)
                {
                    var dayResult = _.includes(macroTarget.days, date.getDay());
                    return dayResult;
                });
                return result;
            },

            _parseMacroTargetFromDTO: function(macroTargetDTO)
            {
                return new macroTarget().init(macroTargetDTO);
            }
        };
        
        return model;
    }

})();
