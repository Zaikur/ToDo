/*
 * Quinton Nelson
 * 1/14/2024
 * This file sends the selected events to the server for processing and adding to the calendar
 */


// Handle sending selected events to the server for processing
function submitSelectedEvents() {
    const selectedEvents = [];
    document.querySelectorAll('input[name="event"]:checked').forEach(checkbox => {
        const eventId = checkbox.closest('.event').dataset.eventId;
        const eventElement = document.querySelector(`.event[data-event-id="${eventId}"]`);

        //Copy html from description so the <a> tag including link is also sent
        const descriptionHtml = eventElement.querySelector('p:nth-of-type(7)').innerHTML;

        const eventDetails = {
            summary: eventElement.querySelector('h4').textContent,
            startDate: eventElement.querySelector('p:nth-of-type(1)').textContent.replace('Start: ', ''),
            endDate: eventElement.querySelector('p:nth-of-type(2)').textContent.replace('End: ', ''),
            created: eventElement.querySelector('p:nth-of-type(3)').textContent.replace('Created: ', ''),
            lastModified: eventElement.querySelector('p:nth-of-type(4)').textContent.replace('Last Modified: ', ''),
            uId: eventId,
            eventType: eventElement.querySelector('p:nth-of-type(6)').textContent.replace('Type: ', ''),
            description: descriptionHtml
        };
        selectedEvents.push(eventDetails);
    });
    // Prepare data to be sent to the server
    const data = JSON.stringify({ events: selectedEvents });


    // AJAX request to send data to the server
    fetch('/Calendar/UploadEvents', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: data
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Handle success - maybe display a success message or redirect
        })
        .catch((error) => {
            console.error('Error:', error);
            // Handle errors here, such as displaying an error message
        });
}