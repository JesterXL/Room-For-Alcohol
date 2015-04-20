(function() {
    'use strict';

    angular
        .module('main.currentDateModel', [
            ])
        .factory('currentDateModel', currentDateModel);

    /* @ngInject */
    function currentDateModel($state, $rootScope)
    {
        var _currentDate = new Date();

        var currentDateModel = {
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

        currentDateModel.nextDate = function()
        {
            console.log("currentDateModel::nextDate");
            if(currentDateModel.currentDate == null)
            {
                return;
            }
            var ourDate = currentDateModel.currentDate;
            var newDate = new Date(ourDate.valueOf());
            newDate.setDate(ourDate.getDate() + 1);
            currentDateModel.currentDate = newDate;
        };
        currentDateModel.previousDate = function()
        {
            console.log("currentDateModel::previousDate");
            if(currentDateModel.currentDate == null)
            {
                return;
            }
            var ourDate = currentDateModel.currentDate;
            var newDate = new Date(ourDate.valueOf());
            newDate.setDate(ourDate.getDate() - 1);
            currentDateModel.currentDate = newDate;
            currentDateModel.currentDateString = moment(currentDateModel.currentDate).format('dddd');
        };
        return currentDateModel;
    }

})();
