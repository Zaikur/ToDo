/*
 * Quinton Nelson
 * 1/14/2024
 * This file sends the selected events to the server for processing and adding to the calendar
 */


// Handle mapping of selected events
function submitSelectedEvents() {
    const selectedEvents = eventObjects.filter(obj => obj.selected); //Map selected events to an array
    const rawEvents = selectedEvents.map(obj => obj.eventRaw);

    sendEventsToServer(rawEvents, false);
}


//This method sends data to the server
function sendEventsToServer(events, forceUpdate) {
    // Check if no events are selected
    if (events.length === 0) {
        alert("Please select at least one event to submit.");
        return; // Stop the function execution here
    }

    fetch('/Calendar/UploadEvents', { //Async HTTP Post request at the /Calendar/UploadEvents endpoint containing events in JSON format
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: events, forceUpdate: forceUpdate })
    })
        .then(response => response.json())      //Parse the JSON response from the server
        .then(data => {                         //Handle the response
            if (data.actionRequired === "confirmUpdate") {
                if (confirm("Event with this ID already exists. Do you want to update it?")) {
                    sendEventsToServer(events, true); // Resend with forceUpdate set to true
                }
            } else {
                handleResponse(data);
            }
        })
        .catch(handleError);
}


function handleResponse(data) {
    if (data.success) {
        alert("Success: " + (data.message || "Operation completed successfully"));
        window.location.href = "/"; // Redirect to the homepage
    } else {
        alert("Error: " + (data.message || "Unknown error occurred"));
    }
}


function handleError(error) {
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
