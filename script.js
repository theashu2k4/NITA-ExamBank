// 2. DOM Elements Selection

const branchSelect = document.getElementById("branchSelect");
const semesterSelect = document.getElementById("semesterSelect");
const subjectSelect = document.getElementById("subjectSelect");
const tableContainer = document.getElementById("tableContainer");

// 3. Event Listeners

// Listen for changes on Branch and Semester dropdowns
branchSelect.addEventListener("change", function() {
    // Reset semester and subject when branch changes
    semesterSelect.value = "";
    subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
    tableContainer.innerHTML = "";
});
semesterSelect.addEventListener("change", handleSelectionChange);

// Listen for changes on Subject dropdown
subjectSelect.addEventListener("change", generateTable);

// 4. Functions

/**
 * Handles changes in Branch or Semester.
 * It checks if both are selected, then populates the Subject dropdown.
 */
function handleSelectionChange() {
    // 1. Reset the Subject dropdown and Table
    subjectSelect.innerHTML = '<option value="">-- Select Subject --</option>';
    tableContainer.innerHTML = ""; 

    const selectedBranch = branchSelect.value;
    const selectedSemester = semesterSelect.value;

    // 2. Only proceed if BOTH branch and semester are chosen
    if (selectedBranch && selectedSemester) {
        
        // --- LOGIC START ---
        // Default to the user's selected branch (e.g., "CSE")
        let lookupBranch = selectedBranch;

        // If Semester is 1 or 2, OVERRIDE the branch to "Common"
        // (Make sure your notesData object actually has a "Common" key!)
        if (selectedSemester == "1" || selectedSemester == "2") {
            lookupBranch = "Common";
        }
        // --- LOGIC END ---

        // 3. Check if data exists using our 'lookupBranch' variable
        if (notesData[lookupBranch] && notesData[lookupBranch][selectedSemester]) {
            
            const subjects = Object.keys(notesData[lookupBranch][selectedSemester]);

            // 4. Create an option for each subject
            subjects.forEach(function(subjectName) {
                const option = document.createElement("option");
                option.value = subjectName;
                
                // (Includes the spacing fix we discussed)
                option.textContent = subjectName + "\u00A0\u00A0\u00A0"; 
                
                subjectSelect.appendChild(option);
            });
        } 
    }
}
/**
 * Generates the table of papers when a Subject is selected.
 */
function generateTable() {
    // 1. Clear any existing table
    tableContainer.innerHTML = "";

    const selectedBranch = branchSelect.value;
    const selectedSemester = semesterSelect.value;
    const selectedSubject = subjectSelect.value;

    // If no subject is selected (user reset to default), stop here.
    if (!selectedSubject) return;
    let lookupBranch = selectedBranch;
    
    if (selectedSemester == "1" || selectedSemester == "2") {
        lookupBranch = "Common";
    }
    // 2. Retrieve the year-wise data for the specific subject
    const subjectData = notesData[lookupBranch][selectedSemester][selectedSubject];
    
    // Get all years (keys) and sort them (newest first)
    const years = Object.keys(subjectData).sort().reverse();

    // 3. Create the Table Elements
    const table = document.createElement("table");
    table.className = "notes-table"; // Adds the CSS class we defined in style.css

    // Create Table Header
    const thead = document.createElement("thead");
    thead.innerHTML = `
        <tr>
            <th>Year</th>
            <th>Mid Term Papers</th>
            <th>End Term Papers</th>
        </tr>
    `;
    table.appendChild(thead);

    // Create Table Body
    const tbody = document.createElement("tbody");

    // 4. Loop through each year and create a row
    years.forEach(function(year) {
        const row = document.createElement("tr");
        const yearData = subjectData[year]; // Access data for that year

        // Helper function to create download buttons
        // It returns a button HTML string or "Not Available"
        const createButton = (link, text) => {
            if (link && link !== "#") {
                return `<a href="${link}" target="_blank" class="download-btn">${text}</a>`;
            } else {
                return `<span class="not-available">Not Available</span>`;
            }
        };

        // Populate row cells
        row.innerHTML = `
            <td>${year}</td>
            <td>${createButton(yearData["Mid Term"], "Download Mid Term")}</td>
            <td>${createButton(yearData["End Term"], "Download End Term")}</td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    tableContainer.appendChild(table);
}