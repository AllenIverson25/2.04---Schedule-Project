// Get DOM elements
const scheduleSelect = document.getElementById('scheduleSelect');
const scheduleContainer = document.getElementById('scheduleContainer');
const statusDiv = document.getElementById('status');

// Async function to load schedule data from JSON file
// Parameter: fileName - the name of the JSON file to fetch
async function loadSchedule(fileName) {
    // Show loading message
    statusDiv.innerHTML = `<div class="alert alert-info">Loading schedule...</div>`;
    scheduleContainer.innerHTML = "";
    
    try {
        // Use fetch with template literal to construct the path
        const response = await fetch(`./json/${fileName}`);
        
        // Check if the fetch was successful
        if (!response.ok) {
            throw new Error('Failed to load schedule data');
        }
        
        // Convert response to JSON
        const scheduleData = await response.json();
        
        // Sort classes by period (extra credit requirement)
        scheduleData.sort((a, b) => a.period - b.period);
        
        // Clear loading message
        statusDiv.innerHTML = "";
        
        // Clear container before adding new content
        scheduleContainer.innerHTML = "";
        
        // Loop through each class and build HTML using insertAdjacentHTML
        scheduleData.forEach((classItem, index) => {
            // Determine subject category for styling
            let subjectCategory = classItem.subjectArea.replace(/\s+/g, '-');
            
            // Build HTML for each class item
            const classHTML = `
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
                        <span class="subject-badge subject-${subjectCategory}">${classItem.subjectArea}</span>
                    </div>
                </div>
            `;
            
            // Use insertAdjacentHTML to add the class card to the container
            // 'beforeend' places it at the end of the container
            scheduleContainer.insertAdjacentHTML('beforeend', classHTML);
        });
        
    } catch (error) {
        // Display user-friendly error message if loading fails
        statusDiv.innerHTML = `
            <div class="alert alert-danger" style="background: rgba(220, 53, 69, 0.2); border: 1px solid rgba(220, 53, 69, 0.5); padding: 20px; border-radius: 15px; text-align: center;">
                <strong>Oops!</strong> Unable to load the schedule. Please make sure the JSON files are in the correct folder.
            </div>
        `;
        scheduleContainer.innerHTML = "";
        console.error('Error loading schedule:', error);
    }
}

// Event listener for dropdown change event (not a button click as required)
scheduleSelect.addEventListener('change', (e) => {
    // Get the selected file name from the dropdown value
    const selectedFile = e.target.value;
    // Load the schedule with the selected file
    loadSchedule(selectedFile);
});

// Automatically load the default schedule when page loads
// This ensures your schedule (Joseph's) loads on page open
loadSchedule('JosephSchedule.json');