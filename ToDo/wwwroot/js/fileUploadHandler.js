/*
 * Quinton Nelson
 * 1/14/2024
 * This file handles file input and file parsing for .ics calendar files
 */

document.getElementById('drop_zone').addEventListener('dragover', handleDragOver, false);
document.getElementById('drop_zone').addEventListener('drop', handleFileSelect, false);
document.getElementById('file_input').addEventListener('change', handleFileSelect, false);

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // show this is a copy.
}

function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    hideDropZone();

    var files = evt.target.files || evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects, use only the first one
    var file = files[0];

    // Check if the file is an .ics file
    if (file && isICSFile(file)) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseICS(contents);
            hideDropZone();
        };

        reader.readAsText(file);
    } else {
        alert("Please upload a valid .ics file.");
    }
}

//This method handles fetching the ics file from a given url
function fetchICSFromUrl() {
    var url = document.getElementById('ics_url').value;

    if (!isValidLink(url)) {
        alert("Please enter a valid link.");
        return;
    }
    hideDropZone();

    if (url) {
        fetch(`/Calendar/fetchICSFile?fileUrl=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                parseICS(data);
                hideDropZone();
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert("Failed to fetch the file. Please check the URL.");
            });
    } else {
        alert("Please enter a URL.");
    }
}

//This method checks if the link given is as expected
function isValidLink(url) {
    const regexPattern = /^https:\/\/my\.southeasttech\.edu\/ICS\/api\/ical\/[a-zA-Z0-9-]+$/;
    return regexPattern.test(url);
}

//This method checks that file type is .ics
function isICSFile(file) {
    var fileName = file.name;
    var fileExtension = fileName.split('.').pop().toLowerCase();
    return fileExtension === 'ics';
}

//This method hides the dropZone after a successful upload
function hideDropZone() {
    var dropZone = document.getElementById('drop_zone');
    var eventsDisplay = document.getElementById('eventsDisplay');

    if (dropZone && eventsDisplay) {
        // Remove the drop zone
        dropZone.parentNode.removeChild(dropZone);

        // Create the new containers and buttons
        var classSessionContainer = document.createElement("div");
        classSessionContainer.id = "classSessionContainer";
        classSessionContainer.className = "event-group col-md-6";
        classSessionContainer.innerHTML = '<h2>Class Sessions</h2>';

        var toggleClassSessionsButton = document.createElement("button");
        toggleClassSessionsButton.className = "btn btn-primary";
        toggleClassSessionsButton.id = "ToggleAllClassSessions";
        toggleClassSessionsButton.textContent = "Toggle Class Sessions";
        classSessionContainer.appendChild(toggleClassSessionsButton);

        var assignmentContainer = document.createElement("div");
        assignmentContainer.id = "assignmentContainer";
        assignmentContainer.className = "event-group col-md-6";
        assignmentContainer.innerHTML = '<h2>Assignments</h2>';

        var toggleAssignmentsButton = document.createElement("button");
        toggleAssignmentsButton.className = "btn btn-primary";
        toggleAssignmentsButton.id = "ToggleAllAssignments";
        toggleAssignmentsButton.textContent = "Toggle Assignments";
        assignmentContainer.appendChild(toggleAssignmentsButton);

        var unknownContainer = document.createElement("div");
        unknownContainer.id = "unknownContainer";
        unknownContainer.className = "event-group";

        // Append the new containers to the eventsDisplay div
        eventsDisplay.appendChild(classSessionContainer);
        eventsDisplay.appendChild(assignmentContainer);
        eventsDisplay.appendChild(unknownContainer);
    }
}


