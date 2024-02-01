/*
 * Quinton Nelson
 * 1/14/2024
 * This file handles file input and file parsing for .ics calendar files
 */

addListeners();
var dragCounter = 0;

function addListeners() {
    document.getElementById('file_input').addEventListener('change', handleFileSelect, false);
    document.getElementById('drop_zone').addEventListener('dragenter', handleDragEnter, false);
    document.getElementById('drop_zone').addEventListener('dragleave', handleDragLeave, false);

    // Attach event listener to drop_zone and all child elements so the drop effect triggers over the container
    // and over the children
    var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('drop', handleFileSelect, false);

    Array.from(dropZone.querySelectorAll('*')).forEach(element => {
        element.addEventListener('dragover', handleDragOver, false);
        element.addEventListener('drop', handleFileSelect, false);
    });
}

//The next two methods handle behavoir of a file being dragged into or out of the drop-zone
function handleDragEnter(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    dragCounter++;

    // Add class to highlight or change style
    // Use a counter so elements aren't rapidly changing when the mouse moves around
    if (dragCounter === 1) {
        evt.target.classList.add('drag-over');
        document.querySelector('.file-upload-container').classList.add('file-drop-position');
    }
}

function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    dragCounter--;

    // Remove class when dragging leaves the area
    if (dragCounter === 0) {
        evt.target.classList.remove('drag-over');
        document.querySelector('.file-upload-container').classList.remove('file-drop-position');
    }
}

function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // show this is a copy.
}

//This method handles selection and loading of a file from the user's computer
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    var files = evt.target.files || evt.dataTransfer.files; // FileList object.

    if (!files.length) {
        console.log("No file detected in drag.");
        return; // Exit the function if no file is detected
    }

    // files is a FileList of File objects, use only the first one
    var file = files[0];

    // Check if the file is an .ics file
    if (file && isICSFile(file)) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            if (isValidICS(contents)) {
                hideDropZone();
                parseICS(contents);
            } else {
                alert("Please upload a valid .ics file.");
                addListeners();
            }
        };
        reader.onerror = function () {
            alert("Error reading the file. Please try again.");
            resetFileInput();
        };
        reader.readAsText(file);
    } else {
        alert("Please upload a valid .ics file.");
        addListeners();
    }
}

//This method handles sending the link to the server to preform a Server-Side fetch of the file
function fetchICSFromUrl() {
    var url = document.getElementById('ics_url').value;

    if (!isValidLink(url)) {
        alert("Please enter a valid link.");
        return;
    }

    if (url) {
        fetch(`/Calendar/fetchICSFile?fileUrl=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                hideDropZone();
                parseICS(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert("Failed to fetch the file. Please check the URL.");
            });
    } else {
        alert("Please enter a URL.");
        addListeners();
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

//This method checks that the file contents are as expected
function isValidICS(contents) {
    return contents.includes("BEGIN:VCALENDAR");
}

//This method hides the dropZone after a successful upload and creates containers for the respective event types
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


