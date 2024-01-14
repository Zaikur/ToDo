/*
 * Quinton Nelson
 * 1/14/2024
 * This file parses the contents of the file and sorts them by category
 * 
 * TODO: Style events for display
 *       Add Button to submit to calendar
 *       Add functions to make data readable for the user
 *       If a file has already been loaded in - add warning that file has already been loaded and ask to confirm
 *       
 */



function parseICS(contents) {
    const events = contents.split('BEGIN:VEVE');
    let displayHtml = '<div class="events">';
    let classSessionHtml = '<div class="event-group"><h2>Class Sessions</h2>';
    let assignmentHtml = '<div class="event-group"><h2>Assignments</h2>';
    let unknownHtml = '<div class="event-group"><h2>Unknown Events<h2>';


    events.forEach(event => {
        if (event) {
            events.forEach(event => {
                if (event) {
                    // Use a flexible regex to handle different line endings
                    const summaryMatch = event.match(/SUMMARY:(.*?)(\r\n|\n|\r)/);
                    const summary = summaryMatch ? summaryMatch[1] : "No summary";

                    const startDateMatch = event.match(/DTSTART:(.*?)(\r\n|\n|\r)/);
                    const startDate = startDateMatch ? startDateMatch[1] : "No start date";

                    const endDateMatch = event.match(/DTEND:(.*?)(\r\n|\n|\r)/);
                    const endDate = endDateMatch ? endDateMatch[1] : "No end date";

                    const createdMatch = event.match(/CREATED:(.*?)(\r\n|\n|\r)/);
                    const created = createdMatch ? createdMatch[1] : "No created date";

                    const lastModifiedMatch = event.match(/LAST-MODIFIED:(.*?)(\r\n|\n|\r)/);
                    const lastModified = lastModifiedMatch ? lastModifiedMatch[1] : "No history";

                    const uIdMatch = event.match(/UID:(.*?)(\r\n|\n|\r)/);
                    const uId = uIdMatch ? uIdMatch[1] : "No UID";

                    const descriptionMatch = event.match(/DESCRIPTION:([\s\S]*?)(?=\b[A-Z]+:)/);
                    let description = descriptionMatch ? descriptionMatch[1].trim() : "No description";

                    // Replace newline characters and backslashes
                    description = description.replace(/\\n|\\/g, '');

                    // Replace line breaks in the middle of words with an empty string
                    description = description.replace(/(\r\n|\n|\r)\s*/g, '');

                    // Remove all HTML tags except <a> tags
                    description = description.replace(/<(?!a\s*\/?|\/a\s*)[^>]+>/gi, '');

                    // Add a space before <a> tags
                    description = description.replace(/(<a\s)/gi, ' $1');

                    // Replace HTML entities like &nbsp;
                    description = description.replace(/&nbsp;/gi, ' ');





                    // Determine the type of event
                    let eventType = 'Unknown';
                    if (summary.startsWith('Class Session')) {
                        eventType = 'Class-Session';
                    } else if (summary.trim().match(/^[A-Z]{3}\s+\d{3}/)) {
                        eventType = 'Assignment';
                    }

                    // Separate each event into their own section for mass selection of types
                    let eventHtml = `<div class="event ${eventType.toLowerCase()}">
                            <label>
                                <input type="checkbox" name="event" value="${summary}" class="event-checkbox ${eventType.toLowerCase()}-checkbox">
                                <p>Start: ${startDate}</p>
                                <p>End: ${endDate}</p>
                                <p>Created: ${created}</p>
                                <p>Last Modified: ${lastModified}</p>
                                <p>UID: ${uId}</p>
                                <p>Type: ${eventType}</p>
                                <p>Description: ${description}</p>
                            </label>
                        </div>`;

                    if (eventType === 'Class-Session') {
                        classSessionHtml += eventHtml;
                    } else if (eventType === 'Assignment') {
                        assignmentHtml += eventHtml;
                    } else if (eventType === 'Unknown') {
                        unknownHtml += eventHtml;
                    }
                }
            })
        }
    });
    //Add button to submit calendar events to the calendar
    displayHtml += '<button id="submitEvents">Add Selected Events to Calendar</button>'
    classSessionHtml += '</div>';
    assignmentHtml += '</div>';
    unknownHtml += '</div>';

    document.getElementById('eventsDisplay').innerHTML =
        '<button id="selectAllClassSessions">Select All Class Sessions</button>' +
        '<button id="deselectAllClassSessions">Deselect All Class Sessions</button>' +
        classSessionHtml +
        '<button id="selectAllAssignments">Select All Assignments</button>' +
        '<button id="deselectAllAssignments">Deselect All Assignments</button>' +
        assignmentHtml;

    addListenersToEventButtons();
}



// Functions to select/deselect all of a specific type
function selectAll(eventType) {
    document.querySelectorAll(`.${eventType}-checkbox`).forEach(checkbox => {
        checkbox.checked = true;
    });
}

function deselectAll(eventType) {
    document.querySelectorAll(`.${eventType}-checkbox`).forEach(checkbox => {
        checkbox.checked = false;
    });
}


function addListenersToEventButtons() {
    // Event listeners for select/deselect buttons or links
    document.getElementById('selectAllClassSessions').addEventListener('click', () => selectAll('class-session'));
    document.getElementById('deselectAllClassSessions').addEventListener('click', () => deselectAll('class-session'));
    document.getElementById('selectAllAssignments').addEventListener('click', () => selectAll('assignment'));
    document.getElementById('deselectAllAssignments').addEventListener('click', () => deselectAll('assignment'));
    document.getElementById('selectAllUnknown').addEventListener('click', () => selectAll('unknown'));
    document.getElementById('deselectAllUnknown').addEventListener('click', () => deselectAll('unknown'));
    document.getElementById('submitEvents').addEventListener('click', submitSelectedEvents);
}


