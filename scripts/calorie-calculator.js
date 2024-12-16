document.addEventListener('DOMContentLoaded', () => {
    const calorieForm = document.getElementById('calorie-form');
    const ageInput = document.getElementById('age');
    const genderInput = document.getElementById('gender');
    const activityLevelInput = document.getElementById('activity-level');
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calorieTargetInput = document.getElementById('calories');
    const calorieResultDiv = document.getElementById('calorie-result');
    const calorieInsightDiv = document.getElementById('calorie-insight');
    const pastCaloriesDiv = document.getElementById('past-calories');

    const loadCalories = () => {
        const calorieRecords = JSON.parse(localStorage.getItem('calorieRecords')) || [];
        pastCaloriesDiv.innerHTML = '';

        calorieRecords.forEach((record, index) => {
            const recordDiv = document.createElement('div');
            recordDiv.classList.add('calorie-record');
            recordDiv.innerHTML = `
                <p><strong>Date:</strong> ${record.date}</p>
                <p><strong>Age:</strong> ${record.age}</p>
                <p><strong>Gender:</strong> ${record.gender}</p>
                <p><strong>Activity Level:</strong> ${record.activityLevel}</p>
                <p><strong>Height:</strong> ${record.height} cm</p>
                <p><strong>Weight:</strong> ${record.weight} kg</p>
                <p><strong>Target Calories:</strong> ${record.targetCalories} kcal</p>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            pastCaloriesDiv.appendChild(recordDiv);
        });

        document.querySelectorAll('.remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                removeCalorieRecord(index);
            });
        });
    };

    const saveCalories = (records) => {
        localStorage.setItem('calorieRecords', JSON.stringify(records));
    };

    const calculateInsight = (age, gender, activityLevel, height, weight, targetCalories) => {
        // Basic Metabolic Rate (BMR) calculation
        let bmr;
        if (gender === 'male') {
            bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Adjust BMR based on activity level
        let activityFactor;
        switch (activityLevel) {
            case 'sedentary':
                activityFactor = 1.2;
                break;
            case 'light':
                activityFactor = 1.375;
                break;
            case 'moderate':
                activityFactor = 1.55;
                break;
            case 'active':
                activityFactor = 1.725;
                break;
            case 'very-active':
                activityFactor = 1.9;
                break;
            default:
                activityFactor = 1.2;
        }

        const maintenanceCalories = bmr * activityFactor;
        let insightMessage;

        if (targetCalories < maintenanceCalories) {
            insightMessage = `<strong>Under your maintenance calories:</strong> You are consuming fewer calories than needed to maintain your current weight. Adjust your intake if needed.`;
        } else if (targetCalories > maintenanceCalories) {
            insightMessage = `<strong>Over your maintenance calories:</strong> You are consuming more calories than needed to maintain your current weight. Consider reducing your intake.`;
        } else {
            insightMessage = `You are consuming the right amount of calories to maintain your current weight. Keep it up!`;
        }

        return insightMessage;
    };

    calorieForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const age = parseInt(ageInput.value);
        const gender = genderInput.value;
        const activityLevel = activityLevelInput.value;
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);
        const targetCalories = parseFloat(calorieTargetInput.value);

        if (isNaN(age) || isNaN(height) || isNaN(weight) || isNaN(targetCalories)) {
            alert('Please enter valid numeric values for all inputs.');
            return;
        }

        const insightMessage = calculateInsight(age, gender, activityLevel, height, weight, targetCalories);

        const newRecord = {
            date: new Date().toLocaleDateString(),
            age,
            gender,
            activityLevel,
            height,
            weight,
            targetCalories,
            insight: insightMessage
        };

        const calorieRecords = JSON.parse(localStorage.getItem('calorieRecords')) || [];
        calorieRecords.push(newRecord);
        saveCalories(calorieRecords);

        ageInput.value = '';
        heightInput.value = '';
        weightInput.value = '';
        calorieTargetInput.value = '';
        calorieResultDiv.innerHTML = `
            <p><strong>Target Calories:</strong> ${targetCalories} kcal</p>
        `;
        calorieInsightDiv.innerHTML = `<p>${insightMessage}</p>`;

        loadCalories();
    });

    const removeCalorieRecord = (index) => {
        const calorieRecords = JSON.parse(localStorage.getItem('calorieRecords')) || [];
        calorieRecords.splice(index, 1);
        saveCalories(calorieRecords);
        loadCalories();
    };

    loadCalories();
});
