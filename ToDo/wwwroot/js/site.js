//Ethan Niehus - this is file is needed in order to let the website for the light and dark mode to work

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
    iconElement.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
}

// Event listener for the button to toggle dark mode
document.getElementById('toggleDarkModeButton').addEventListener('click', toggleDarkMode);

// Check if a mode is stored in localStorage and apply it on page load
document.addEventListener('DOMContentLoaded', function () {
    const savedMode = localStorage.getItem('mode');
    if (savedMode) {
        const htmlElement = document.documentElement;
        htmlElement.classList.add(savedMode);

        // Update button icon based on the saved mode
        updateButtonIcon(savedMode === 'dark-mode');
    }
});

