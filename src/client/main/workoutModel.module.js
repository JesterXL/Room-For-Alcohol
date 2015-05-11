/* global _ */
(function() {
    'use strict';

    angular
        .module('main.workoutModel', [])
        .factory('workoutModel', workoutModel);

    /* @ngInject */
    function workoutModel($rootScope)
    {
        var _workouts = [];

        /*
        days: [1, 3, 5],
        notes: null,
        exercises: [
            {
                name: 'Squat',
                sets: [
                    {
                        reps: 5,
                        weight: 295,
                        actualReps: 5
                    },
                    {
                        reps: 5,
                        weight: 295,
                        actualReps: 5
                    },
                    {
                        reps: 5,
                        weight: 295,
                        actualReps: 5
                    }
                ]
            },
         */
        
        var model = {

            get workouts()
            {
                return _workouts;
            },

            set workouts(newWorkouts)
            {
                _workouts    = newWorkouts;
                $rootScope.$broadcast('workoutsChanged');
            },

            getWorkoutForDate: function(date)
            {
                return _.find(_workouts, function(workout)
                {
                    return _.includes(workout.days, date.getDay());
                });
            }
        };
        
        return model;
    }

})();
