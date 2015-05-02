(function() {
    'use strict';

    angular
        .module('main.macros.macroTargets')
        .directive('jxlMacroTargets', jxlMacroTargets);

    /* @ngInject */
    function jxlMacroTargets($timeout, $rootScope, currentDateModel, macrosModel)
    {
        /* @ngInject */
        function link(scope, element, attrs)
        {
            _.defer(function()
            {


                console.log("macroTargets::link");
                // console.log("scope:", scope);
                // console.log("element:", element);
                // console.log("attrs:", attrs);
                // Get the context of the canvas element we want to select
                var obj = document.getElementById("currentChart");
                var currentChart = document.getElementById("currentChart").getContext("2d");
                var targetChart = document.getElementById("targetChart").getContext("2d");
                var data = [
                    {
                        value: 0,
                        color:"#F7464A",
                        highlight: "#FF5A5E",
                        label: "Protein"
                    },
                    {
                        value: 0,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: "Carbs"
                    },
                    {
                        value: 0,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: "Fat"
                    }
                ];
                var options = {
                    //Boolean - Whether we should show a stroke on each segment
                    segmentShowStroke : true,

                    //String - The colour of each segment stroke
                    segmentStrokeColor : "#fff",

                    //Number - The width of each segment stroke
                    segmentStrokeWidth : 2,

                    //Number - The percentage of the chart that we cut out of the middle
                    percentageInnerCutout : 50, // This is 0 for Pie charts

                    //Number - Amount of animation steps
                    animationSteps : 40,

                    //String - Animation easing effect
                    animationEasing : "easeInOut",

                    //Boolean - Whether we animate the rotation of the Doughnut
                    animateRotate : true,

                    //Boolean - Whether we animate scaling the Doughnut from the centre
                    animateScale : false,

                    //String - A legend template
                    legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"

                };
                var currentPieChart = new Chart(currentChart).Pie(data, options);
                var targetPieChart = new Chart(targetChart).Pie(data, options);

                function redrawDataForChart()
                {
                    console.log("macroTargets::redrawDataForChart");
                    var protein     = 0;
                    var carbs       = 1;
                    var fat         = 2;
                    var macrosForToday = macrosModel.getMacroTargetForDate(currentDateModel.currentDate);
                    console.log("macrosForToday:", macrosForToday);
                    if(macrosForToday)
                    {
                        console.log("macrosForToday.proteinCurrent:", macrosForToday.proteinCurrent);
                        var pCurrent = macrosForToday.proteinCurrent * 100;
                        var cCurrent = macrosForToday.carbsCurrent * 100;
                        var fCurrent = macrosForToday.fatCurrent * 100;
                        console.log("pCurrent:", pCurrent);
                        console.log("cCurrent:", cCurrent);
                        console.log("fCurrent:", fCurrent);
                        if(pCurrent <= 0)
                        {
                            pCurrent = 0.1;
                        }
                        else
                        {
                            pCurrent = Math.round(pCurrent);
                        }
                        if(cCurrent <= 0)
                        {
                            cCurrent = 0.1;
                        }
                        else
                        {
                            cCurrent = Math.round(cCurrent);
                        }
                        if(fCurrent <= 0)
                        {
                            fCurrent = 0.1;
                        }
                        else
                        {
                            fCurrent = Math.round(fCurrent);
                        }
                        
                        currentPieChart.segments[protein].value = pCurrent;
                        currentPieChart.segments[carbs].value = cCurrent;
                        currentPieChart.segments[fat].value = fCurrent;
                        currentPieChart.update();

                        targetPieChart.segments[protein].value = macrosForToday.protein * 100;
                        targetPieChart.segments[carbs].value = macrosForToday.carbs * 100;
                        targetPieChart.segments[fat].value = macrosForToday.fat * 100;
                        targetPieChart.update();
                    }
                }

                $rootScope.$on('macrosChanged', function()
                {
                    console.log("macroTargets::macrosChanged event");
                    redrawDataForChart();
                });

                // date can change quickly, debounce it
                $rootScope.$on('currentDateChanged', _.debounce(redrawDataForChart, 300));

                redrawDataForChart();
            });
        }

        return {
            restrict: 'E',
            scope: {},
            transclude: false,
            templateUrl: 'main/macros/macroTargets/macroTargets.directive.html',
            controller: 'jxlMacroTargetsController',
            controllerAs: 'vm',
            link: link
        };
    }

    

})();
