/*
 * Quinton Nelson
 * 1/14/2024
 * This file sends the selected events to the server for processing and adding to the calendar
 */


// Handle sending selected events to the server for processing
function submitSelectedEvents() {
    const selectedEvents = eventObjects.filter(obj => obj.selected);
    const rawEvents = selectedEvents.map(obj => obj.eventRaw);

    sendEventsToServer(rawEvents, false);
}

function sendEventsToServer(events, forceUpdate) {
    fetch('/Calendar/UploadEvents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: events, forceUpdate: forceUpdate })
    })
        .then(response => response.json())
        .then(data => {
            if (data.actionRequired === "confirmUpdate") {
                if (confirm("An event with this ID already exists. Do you want to update it?")) {
                    sendEventsToServer(events, true); // Resend with forceUpdate set to true
                }
            } else {
                handleResponse(data);
            }
        })
        .catch(handleError);
}


function handleResponse(data) {
    console.log('Response Data:', data); // Log the response data for debugging
    if (data.success) {
        alert("Success: " + (data.message || "Operation completed successfully"));
        window.location.href = "/"; // Redirect to the homepage
    } else {
        alert("Error: " + (data.message || "Unknown error occurred"));
    }
}


function handleError(error) {
    console.error('Error:', error);

    // Check if error object has 'message' property
    let errorMessage = "An unknown error occurred.";
    if (error && typeof error.message === 'string') {
        errorMessage = error.message;
    } else if (typeof error === 'string') {
        // If error itself is a string, use it as the message
        errorMessage = error;
    }

    alert(errorMessage);
}
