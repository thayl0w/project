document.addEventListener("DOMContentLoaded", function () {
    const bmiForm = document.getElementById("bmi-form");
    const heightInputContainer = document.getElementById("height-input-container");
    const heightUnit = document.getElementById("height-unit");
    const weightUnit = document.getElementById("weight-unit");
    const resultDiv = document.getElementById("result");
    const pastRecordsDiv = document.getElementById("past-records");

    // Update height input dynamically based on unit selection
    heightUnit.addEventListener("change", function () {
        heightInputContainer.innerHTML = heightUnit.value === "cm"
            ? '<input type="number" step="0.01" id="height" placeholder="Enter height in cm" required>'
            : `
            <input type="number" step="0.01" id="height-feet" placeholder="Feet" required>
            <input type="number" step="0.01" id="height-inches" placeholder="Inches" required>
        `;
    });

    // Handle BMI calculation
    bmiForm.addEventListener("submit", function (e) {
        e.preventDefault();

        let height, weight, bmi;

        // Convert height to cm if needed
        if (heightUnit.value === "cm") {
            height = parseFloat(document.getElementById("height").value);
        } else {
            const heightFeet = parseFloat(document.getElementById("height-feet").value) || 0;
            const heightInches = parseFloat(document.getElementById("height-inches").value) || 0;
            height = (heightFeet * 30.48) + (heightInches * 2.54); // Convert to cm
        }

        // Convert weight to kg if needed
        weight = parseFloat(document.getElementById("weight").value);
        if (weightUnit.value === "lbs") {
            weight *= 0.453592; // Convert to kg
        }

        // Calculate BMI
        bmi = weight / ((height / 100) ** 2);

        // Display result
        displayBMIResult(bmi);

        // Save and display past records
        saveBMIRecord(bmi);
        loadPastRecords();
    });

    // Function to display BMI result
    function displayBMIResult(bmi) {
        let category = "";
        if (bmi < 18.5) {
            category = "Underweight";
        } else if (bmi < 24.9) {
            category = "Normal weight";
        } else if (bmi < 29.9) {
            category = "Overweight";
        } else {
            category = "Obese";
        }

        resultDiv.innerHTML = `
            <h3>Your BMI:</h3>
            <p>${bmi.toFixed(2)} (${category})</p>
        `;
    }

    // Function to save BMI record to localStorage
    function saveBMIRecord(bmi) {
        const bmiRecord = { date: new Date().toLocaleString(), bmi: bmi.toFixed(2) };
        const pastRecords = JSON.parse(localStorage.getItem("bmiRecords")) || [];
        pastRecords.push(bmiRecord);
        localStorage.setItem("bmiRecords", JSON.stringify(pastRecords));
    }

    // Function to load and display past BMI records
    function loadPastRecords() {
        const pastRecords = JSON.parse(localStorage.getItem("bmiRecords")) || [];
        pastRecordsDiv.innerHTML = "";

        pastRecords.forEach((record, index) => {
            const recordDiv = document.createElement("div");
            recordDiv.classList.add("bmi-record");
            recordDiv.innerHTML = `
                <p><strong>Date:</strong> ${record.date}</p>
                <p><strong>BMI:</strong> ${record.bmi}</p>
                <button class="remove-record" data-index="${index}">Remove</button>
            `;
            pastRecordsDiv.appendChild(recordDiv);

            // Add event listener to remove a specific record
            recordDiv.querySelector(".remove-record").addEventListener("click", function () {
                removeBMIRecord(index);
            });
        });
    }

    // Function to remove a specific BMI record
    function removeBMIRecord(index) {
        const pastRecords = JSON.parse(localStorage.getItem("bmiRecords")) || [];
        pastRecords.splice(index, 1);
        localStorage.setItem("bmiRecords", JSON.stringify(pastRecords));
        loadPastRecords();
    }

    // Load past records on page load
    loadPastRecords();
});
