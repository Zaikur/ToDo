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
