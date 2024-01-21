/*
 * Quinton Nelson
 * 1/14/2024
 * This file parses the contents of the file and sorts them by category
 */


let eventObjects = [];


function parseICS(contents) {
    const events = contents.split('BEGIN:VEVE');
    let classSessionHtml = '<div class="event-group col-md-6"><h2>Class Sessions</h2>' + '<button class="btn btn-primary" id="ToggleAllClassSessions">Toggle Class Sessions</button>';
    let assignmentHtml = '<div class="event-group col-md-6"><h2>Assignments</h2>' + '<button class="btn btn-primary" id="ToggleAllAssignments">Toggle Assignments</button>';
    let unknownHtml = '<div class="event-group"><h2>Unknown Events<h2>';

    events.forEach(eventRaw => {
        if (eventRaw) {
            //Parse event and add it to the array
            eventObjects.push(parseEvent(eventRaw));
        }
    });

    //Only show events that are in the future
    const currentDate = new Date();

    eventObjects = eventObjects.filter(obj => {
        const eventDate = createDateObject(obj.startDate);
        return eventDate >= currentDate;
    });

    // Sort events by start date
    eventObjects.sort((a, b) => {
        return new Date(createDateObject(a.startDate)) - new Date(createDateObject(b.startDate));
    });


    eventObjects.forEach(obj => { 
        // Separate each event into their own section for mass selection of types
        let eventHtml =
            `<div class="event ${obj.eventType.toLowerCase()}" onclick="toggleEventSelection('${obj.uId}')">
                <span class="date-preview">${obj.startDate}</span>
                <label class="row">
                    <input type="checkbox" id="${obj.uId}" name="event" value="${obj.summary}" class="event-checkbox ${obj.eventType.toLowerCase()}-checkbox">
                    <h4 class="col-md-8 event-heading">${obj.summary}</h4>
                    <button class="details-toggle col-md-4" onclick="toggleEventDetails('${obj.uId}'); event.stopPropagation();">+</button>
                </label>
                <div class="event-details visually-hidden" id="details-${obj.uId}">
                    <p><b>End Date:</b> ${obj.endDate}</p>
                    <p><b>Last Modified:</b> ${obj.lastModified}</p>
                    <p><b>UID:</b> ${obj.uId}</p>
                    <p><b>Type:</b> ${obj.eventType}</p>
                    <p><b>Description:</b> ${obj.description}</p>
                </div>
            </div>`;

        if (obj.eventType === 'Class-Session') {
            classSessionHtml += eventHtml;
        } else if (obj.eventType === 'Assignment') {
            assignmentHtml += eventHtml;
        } else if (obj.eventType === 'Unknown') {
            unknownHtml += eventHtml;
        }
    });

    classSessionHtml += '</div>';
    assignmentHtml += '</div>';
    unknownHtml += '</div>';

    document.getElementById('eventsDisplay').innerHTML =
        classSessionHtml +
        assignmentHtml;

    addSubmitEventsButton();
    addListenersToEventButtons();
}


// Functions to select/deselect all of a specific type
function toggleAll(eventType) {
    document.querySelectorAll(`.${eventType}-checkbox`).forEach(checkbox => {
        var uId = checkbox.id;
        checkbox.checked = !checkbox.checked;
        toggleEventSelection(uId);
    });
}


function addListenersToEventButtons() {
    // Event listeners for select/deselect buttons or links
    document.getElementById('ToggleAllClassSessions').addEventListener('click', () => toggleAll('class-session'));
    document.getElementById('ToggleAllAssignments').addEventListener('click', () => toggleAll('assignment'));
    document.getElementById('submitEvents').addEventListener('click', submitSelectedEvents);
}

//Show and hide event details
function toggleEventDetails(uId) {
    var details = document.getElementById(`details-${uId}`);
    details.classList.toggle("visually-hidden");
}

//Select event checkbox
function toggleEventSelection(uId) {
    var checkbox = document.getElementById(`${uId}`);

    if (!checkbox) {
        console.error('Checkbox not found for UID:', uId);
        return;
    }

    // Use the checkbox's current state to set the class and the selected property
    var isChecked = checkbox.checked;

    var currentElement = checkbox;
    while (currentElement && !currentElement.classList.contains('event')) {
        currentElement = currentElement.parentElement;
    }

    if (currentElement) {
        if (isChecked) {
            currentElement.classList.add('active');
        } else {
            currentElement.classList.remove('active');
        }
    } else {
        console.error('Event class parent not found for checkbox ID:', uId);
    }

    let eventObj = eventObjects.find(obj => obj.uId === uId);
    if (eventObj) {
        eventObj.selected = isChecked;
    } else {
        console.error('Event object not found for UID:', uId);
    }
}


function addSubmitEventsButton() {
    // Create a new button element
    var button = document.createElement("button");
    button.id = "submitEvents"; // Set the button's ID
    button.className = "btn btn-primary";
    button.innerHTML = "Add Selected Events to Calendar"; // Set the button's text

    // Append the button to the floating div
    var submitContainer = document.querySelector(".submitContainer");
    if (submitContainer) {
        submitContainer.appendChild(button);
    } else {
        console.error("submitContainer not found");
    }
}