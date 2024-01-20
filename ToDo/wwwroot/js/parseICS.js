/*
 * Quinton Nelson
 * 1/14/2024
 * This file parses the contents of the file and sorts them by category
 * 
 * TODO:style buttons
 *       sort events
 */



function parseICS(contents) {
    const events = contents.split('BEGIN:VEVE');
    let eventObjects = [];
    let classSessionHtml = '<div class="event-group col-md-6"><h2>Class Sessions</h2>' + '<button class="btn btn-primary" id="ToggleAllClassSessions">Select All Class Sessions</button>';
    let assignmentHtml = '<div class="event-group col-md-6"><h2>Assignments</h2>' + '<button class="btn btn-primary" id="ToggleAllAssignments">Select All Assignments</button>';
    let unknownHtml = '<div class="event-group"><h2>Unknown Events<h2>';

    events.forEach(eventRaw => {
        if (eventRaw) {
            //Parse event and add it to the array
            eventObjects.push(parseEvent(eventRaw));
        }
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
function selectAll(eventType) {
    document.querySelectorAll(`.${eventType}-checkbox`).forEach(checkbox => {
        var uId = checkbox.id;
        toggleEventSelection(uId);
    });
}

function deselectAll(eventType) {
    document.querySelectorAll(`.${eventType}-checkbox`).forEach(checkbox => {
        checkbox.checked = false;
    });
}


function addListenersToEventButtons() {
    // Event listeners for select/deselect buttons or links
    document.getElementById('ToggleAllClassSessions').addEventListener('click', () => selectAll('class-session'));
    document.getElementById('ToggleAllAssignments').addEventListener('click', () => selectAll('assignment'));
    document.getElementById('submitEvents').addEventListener('click', submitSelectedEvents);
}

//Show and hide event details
function toggleEventDetails(uId) {
    var details = document.getElementById(`details-${uId}`);
    details.classList.toggle("visually-hidden");
}

//Select event checkbox
function toggleEventSelection(uId) {
    //Toggle checkbox
    var checkbox = document.getElementById(`${uId}`);
    checkbox.checked = !checkbox.checked;

    //Toggle class for styling
    var currentElement = checkbox;
    while (currentElement && !currentElement.classList.contains('event')) {
        currentElement = currentElement.parentElement;
    }

    if (currentElement) {
        console.log('Event element found', currentElement); // Debug log
        if (checkbox.checked) {
            console.log('Adding active class'); // Debug log
            currentElement.classList.add('active');
        } else {
            console.log('Removing active class'); // Debug log
            currentElement.classList.remove('active');
        }
    } else {
        console.error('Event class parent not found for checkbox ID: checkboxUId-' + uId);
    }
}

function addSubmitEventsButton() {
    // Create a new button element
    var button = document.createElement("button");
    button.id = "submitEvents"; // Set the button's ID
    button.className = "btn btn-primary";
    button.innerHTML = "Add Selected Events to Calendar"; // Set the button's text

    // Optionally, add an event listener for the button
    button.addEventListener("click", function () {
        // Actions to perform when the button is clicked
        console.log("Submit Events button clicked");
    });

    // Append the button to the footer
    var footer = document.querySelector(".submitContainer"); // Use the appropriate selector for your footer
    if (footer) {
        footer.appendChild(button);
    } else {
        console.error("Footer not found");
    }
}