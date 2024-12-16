document.addEventListener('DOMContentLoaded', () => {
    const activityForm = document.getElementById('activity-form');
    const activeHoursInput = document.getElementById('active-hours');
    const nonActiveHoursInput = document.getElementById('non-active-hours');
    const workoutHoursInput = document.getElementById('workout-hours');
    const resultContainer = document.getElementById('result'); // To display result messages
    const ctx = document.getElementById('activityChart').getContext('2d');

    // Function to populate dropdowns with hour options
    function populateHourOptions(selectElement) {
        for (let i = 0; i <= 24; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            selectElement.appendChild(option);
        }
    }

    // Populate all hour dropdowns
    populateHourOptions(activeHoursInput);
    populateHourOptions(nonActiveHoursInput);
    populateHourOptions(workoutHoursInput);

    // Initial chart setup
    let activityChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Active Hours', 'Non-Active Hours', 'Workout Hours'],
            datasets: [
                {
                    backgroundColor: ['#4CAF50', '#FF6347', '#2196F3'], // Colors for the segments
                    data: [0, 0, 0] // Initial data
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Daily Activity Breakdown'
            }
        }
    });

    // Handle form submission
    activityForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get values from form inputs
        const activeHours = parseInt(activeHoursInput.value, 10);
        const nonActiveHours = parseInt(nonActiveHoursInput.value, 10);
        const workoutHours = parseInt(workoutHoursInput.value, 10);

        // Validate inputs
        if (
            isNaN(activeHours) ||
            isNaN(nonActiveHours) ||
            isNaN(workoutHours) ||
            activeHours < 0 ||
            nonActiveHours < 0 ||
            workoutHours < 0 ||
            activeHours + nonActiveHours + workoutHours > 24
        ) {
            alert('Please enter valid hours. Total hours cannot exceed 24.');
            return;
        }

        // Update chart data
        activityChart.data.datasets[0].data = [activeHours, nonActiveHours, workoutHours];
        activityChart.update();

        // Determine the predominant activity and display a message
        let message = '';
        if (activeHours > nonActiveHours && activeHours > workoutHours) {
            message = `<p>You spent most of your time being active. Great job staying on the move!</p>`;
        } else if (nonActiveHours > activeHours && nonActiveHours > workoutHours) {
            message = `<p>You spent most of your time inactive. Consider adding more physical activity to your day!</p>`;
        } else if (workoutHours > activeHours && workoutHours > nonActiveHours) {
            message = `<p>You spent most of your time working out. Excellent dedication to fitness!</p>`;
        } else {
            message = `<p>Your activities are well-balanced. Keep up the good work!</p>`;
        }

        // Display the message
        resultContainer.innerHTML = message;

        // Clear form inputs after submitting
        activeHoursInput.value = '';
        nonActiveHoursInput.value = '';
        workoutHoursInput.value = '';
    });
});
