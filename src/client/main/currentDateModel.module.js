/* global moment */
(function() {
    'use strict';

    angular
        .module('main.currentDateModel', [
            ])
        .factory('currentDateModel', currentDateModel);

    /* @ngInject */
    function currentDateModel($rootScope)
    {
        var _currentDate = new Date();

        var model = {
            get currentDate()
            {
                return _currentDate;
            },

            set currentDate(newDate)
            {
                _currentDate = newDate;
                $rootScope.$broadcast('currentDateChanged');
            }
        };

        model.nextDate = function()
        {
            if(model.currentDate == null)
            {
                return;
            }
            var ourDate = model.currentDate;
            var newDate = new Date(ourDate.valueOf());
            newDate.setDate(ourDate.getDate() + 1);
            model.currentDate = newDate;
        };
        model.previousDate = function()
        {
            if(model.currentDate == null)
            {
                return;
            }
            var ourDate = model.currentDate;
            var newDate = new Date(ourDate.valueOf());
            newDate.setDate(ourDate.getDate() - 1);
            model.currentDate = newDate;
            model.currentDateString = moment(model.currentDate).format('dddd');
        };
        return model;
    }

})();
