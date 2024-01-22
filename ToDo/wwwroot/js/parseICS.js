/*
 * Quinton Nelson
 * 1/14/2024
 * This file parses the contents of the file and sorts them by category
 */


let eventObjects = [];


function parseICS(contents) {
    const events = contents.split('BEGIN:VEVE');

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


    let delay = 0;
    const delayIncrement = 25; // Milliseconds between each event's appearance

    eventObjects.forEach(obj => {
        setTimeout(() => {
            // Create a new div for each event
            let eventDiv = document.createElement("div");
            eventDiv.className = `event ${obj.eventType.toLowerCase()} fadeInUp`;
            eventDiv.setAttribute('onclick', `toggleEventSelection('${obj.uId}')`);
            eventDiv.innerHTML = `
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
        `;

            // Append the div to the corresponding event group
            if (obj.eventType === 'Class-Session') {
                document.getElementById('classSessionContainer').appendChild(eventDiv);
            } else if (obj.eventType === 'Assignment') {
                document.getElementById('assignmentContainer').appendChild(eventDiv);
            } else if (obj.eventType === 'Unknown') {
                document.getElementById('unknownContainer').appendChild(eventDiv);
            }
        }, delay);

        delay += delayIncrement;
    });

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