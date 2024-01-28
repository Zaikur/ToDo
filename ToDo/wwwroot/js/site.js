// Function to toggle between light and dark modes
function toggleDarkMode() {
    const htmlElement = document.documentElement;
    const isDarkMode = htmlElement.classList.toggle('dark-mode');

    // Update the stored mode in localStorage
    const currentMode = isDarkMode ? 'dark-mode' : 'light-mode';
    localStorage.setItem('mode', currentMode);

    // Update button icon based on the current mode
    updateButtonIcon(isDarkMode);
}

// Function to update button icon based on the current mode
function updateButtonIcon(isDarkMode) {
    const iconElement = document.getElementById('darkModeIcon');

    // Set the class directly based on the current mode
    iconElement.className = isDarkMode ? 'bi bi-moon' : 'bi bi-brightness-high-fill';
}

// Event listener for the button to toggle dark mode
document.getElementById('toggleDarkModeButton').addEventListener('click', toggleDarkMode);

// Function to submit rating
function submitRating() {
    const rating = document.querySelector('input[name="rating"]:checked');

    if (!rating) {
        alert('Please select a rating before submitting.');
        return;
    }

    // Use AJAX to send the rating to the server
    $.ajax({
        url: '/Home/SubmitRating', // Specify your controller action URL
        type: 'POST',
        data: { rating: rating.value },
        success: function (data) {
            // Handle success, e.g., show a thank you message
            alert('Thank you for your rating!');
        },
        error: function () {
            // Handle error, if any
            alert('Error submitting rating. Please try again.');
        }
    });
}
