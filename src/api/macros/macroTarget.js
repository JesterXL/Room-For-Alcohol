function MacroTarget()
{
        return {
                days: [0, 1, 2, 3, 4, 5, 6],
                protein: 0.0,
                carbs: 0.0,
                fat: 0.0,
                adjustment: 0.0,
                goal: 2000,
                food: 0,
                exercise: 0,
                proteinCurrent: 0,
                fatCurrent: 0,
                carbsCurrent: 0,
                foods: []
        };
}
module.exports = MacroTarget;