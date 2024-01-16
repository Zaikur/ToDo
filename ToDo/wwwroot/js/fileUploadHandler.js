/*
 * Quinton Nelson
 * 1/14/2024
 * This file handles file input and file parsing for .ics calendar files
 * 
 * TODO: Add file error handling
 *       Check that file is .ics file
 *       Verify contents are as expected
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

    if (file) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            parseICS(contents);
        };
        reader.readAsText(file);
    }
}
