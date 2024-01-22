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

    toggleDropZoneLoading(true);

    var files = evt.target.files || evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects, use only the first one
    var file = files[0];

    // Check if the file is an .ics file
    if (file && isICSFile(file)) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            setTimeout(() => {
                parseICS(contents);
                toggleDropZoneLoading(false);
                hideDropZone();
            }, 4000);
        };

        reader.readAsText(file);
    } else {
        alert("Please upload a valid .ics file.");
        toggleDropZoneLoading(false);
    }
}

//This method handles fetching the ics file from a given url
function fetchICSFromUrl() {
    var url = document.getElementById('ics_url').value;

    if (!isValidLink(url)) {
        alert("Please enter a valid link.");
        return;
    }
    toggleDropZoneLoading(true);

    if (url) {
        fetch(`/Calendar/fetchICSFile?fileUrl=${encodeURIComponent(url)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                setTimeout(() => {
                    parseICS(data);
                    toggleDropZoneLoading(false);
                    hideDropZone();
                }, 4000);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                alert("Failed to fetch the file. Please check the URL.");
                toggleDropZoneLoading(false);
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
    if (dropZone) {
        dropZone.style.display = 'none';
    }
}

//This method changes the drop zone to a loading bar while file is uploading/parsing
function toggleDropZoneLoading(isLoading) {
    var dropZone = document.getElementById('drop_zone');
    if (dropZone) {
        if (isLoading) {
            dropZone.innerHTML =
                '  <h1 class=loadingH1><em class="let1" > l</em ><em class="let2">o</em><em class="let3">a</em><em class="let4">d</em><em class="let5">i</em><em class="let6">n</em><em class="let7">g</em></h1>';
        } else {
            // Restore original drop zone content
            dropZone.innerHTML = '<h1>Upload ICS File</h1>' +
                '<input type="file" id="file_input" accept=".ics">' +
                '<div id="dropArea">Drop file here!</div>';
            // Reattach event listeners to new elements
            document.getElementById('file_input').addEventListener('change', handleFileSelect, false);
        }
    }
}
