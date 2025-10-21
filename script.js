// ===== GET DOM ELEMENTS =====
// These variables store references to HTML elements we need to manipulate
const scheduleSelect = document.getElementById('scheduleSelect'); // The dropdown menu
const scheduleContainer = document.getElementById('scheduleContainer'); // Where schedule cards appear
const statusDiv = document.getElementById('status'); // For loading/error messages

// ===== ASYNC FUNCTION TO LOAD SCHEDULE =====
// This function loads a JSON file and displays the schedule
// Parameter: fileName - the name of the JSON file to load (e.g., "JosephSchedule.json")
async function loadSchedule(fileName) {
    
    // Show loading message while fetching data
    statusDiv.innerHTML = `<div class="alert alert-info">Loading schedule...</div>`;
    scheduleContainer.innerHTML = ""; // Clear old schedule
    
    try {
        // ===== FETCH THE JSON FILE =====
        // Template literal constructs the path: ./json/JosephSchedule.json
        const response = await fetch(`./json/${fileName}`);
        
        // Check if the file was found (response.ok is true if status is 200-299)
        if (!response.ok) {
            throw new Error('File not found');
        }
        
        // ===== CONVERT RESPONSE TO JSON =====
        // Parse the JSON data into a JavaScript array
        const classes = await response.json();
        
        // ===== SORT CLASSES BY PERIOD =====
        // This arranges classes in order: period 1, 2, 3, etc.
        classes.sort((a, b) => a.period - b.period);
        
        // Clear loading message once data is ready
        statusDiv.innerHTML = "";
        
        // ===== BUILD THE SCHEDULE CARDS =====
        // Loop through each class in the array
        classes.forEach((classItem, index) => {
            
            // Create the HTML for one class card
            const cardHTML = `
                <div class="class-item" style="animation-delay: ${index * 0.1}s">
                    <div class="period-marker">
                        ${classItem.period}
                    </div>
                    <div class="class-content">
                        <h3 class="class-name">${classItem.className}</h3>
                        <div class="class-details">
                            <div class="detail-row">
                                <span class="detail-label">Teacher</span>
                                <span class="detail-value">${classItem.teacher}</span>
                            </div>
                            <div class="detail-row">
                                <span class="detail-label">Room</span>
                                <span class="detail-value">${classItem.roomNumber}</span>
                            </div>
                        </div>
                        <span class="subject-badge subject-${classItem.subjectArea.replace(/\s+/g, '-')}">${classItem.subjectArea}</span>
                    </div>
                </div>
            `;
            
            // ===== INSERT THE CARD INTO THE PAGE =====
            // 'beforeend' adds it at the end of scheduleContainer
            scheduleContainer.insertAdjacentHTML('beforeend', cardHTML);
        });
        
    } catch (error) {
        // ===== DISPLAY ERROR MESSAGE IF SOMETHING FAILS =====
        statusDiv.innerHTML = `
            <div class="alert alert-danger">
                <strong>Oops!</strong> Unable to load the schedule. Please check that the file exists in the json folder.
            </div>
        `;
        console.error('Error:', error); // Log error to console for debugging
    }
}

// ===== EVENT LISTENER FOR DROPDOWN (NON-BUTTON EVENT) =====
// This listens for the 'change' event when user selects a different student
scheduleSelect.addEventListener('change', function(event) {
    // Get the selected file name from the dropdown's value
    const selectedFile = event.target.value;
    
    // Load the schedule for the selected student
    loadSchedule(selectedFile);
});

// ===== LOAD DEFAULT SCHEDULE ON PAGE LOAD =====
// This runs automatically when the page opens
// It loads Joseph's schedule (your schedule)
loadSchedule('JosephSchedule.json');