/*
 * Quinton Nelson
 * 1/14/2024
 * This file creates an event objects and formats the contents
 */

function parseEvent(eventRaw) {
    // Use a flexible regex to handle different line endings
    const summaryMatch = eventRaw.match(/SUMMARY:(.*?)(\r\n|\n|\r)/);
    const summary = summaryMatch ? summaryMatch[1] : "No summary";

    const startDateMatch = eventRaw.match(/DTSTART:(.*?)(\r\n|\n|\r)/);
    let startDate = startDateMatch ? startDateMatch[1] : "No start date";

    const endDateMatch = eventRaw.match(/DTEND:(.*?)(\r\n|\n|\r)/);
    const endDate = endDateMatch ? endDateMatch[1] : "No end date";

    const lastModifiedMatch = eventRaw.match(/LAST-MODIFIED:(.*?)(\r\n|\n|\r)/);
    const lastModified = lastModifiedMatch ? lastModifiedMatch[1] : "No history";

    const uIdMatch = eventRaw.match(/UID:(.*?)(\r\n|\n|\r)/);
    const uId = uIdMatch ? uIdMatch[1] : "No UID";

    const descriptionMatch = eventRaw.match(/DESCRIPTION:([\s\S]*?)(?=\b[A-Z]+:)/);
    let description = descriptionMatch ? descriptionMatch[1].trim() : "No description";

    //SANITIZE
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

    //Append my.southeasttech.edu in front of <a> links so they work as expected
    const linkRegex = /\/ICS\/[^\s"']+/g;
    description = description.replace(linkRegex, match => 'https://my.southeasttech.edu' + match);

    // Determine the type of event
    let eventType = 'Unknown';
    if (summary.startsWith('Class Session')) {
        eventType = 'Class-Session';
    } else if (summary.trim().match(/^[A-Z]{3}\s+\d{3}/)) {
        eventType = 'Assignment';
    }

    //Create an event object
    let event = {
        summary: summary,
        startDate: formatDateTime(startDate),
        endDate: formatDateTime(endDate),
        lastModified: formatDateTime(lastModified),
        uId: uId,
        description: description,
        eventType: eventType,
        eventRaw: eventRaw,
        selected: false
    };

    return event;
}

function formatDateTime(dateTime) {
    let year = dateTime.substring(0, 4);
    let month = dateTime.substring(4, 6);
    let day = dateTime.substring(6, 8);
    let hour = dateTime.substring(9, 11);
    let minute = dateTime.substring(11, 13);
    let second = dateTime.substring(13, 15);

    // Create a new Date object in a standard format
    let formattedDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

    return formattedDate;
}

function createDateObject(dateTime) {
    return new Date(dateTime);
}