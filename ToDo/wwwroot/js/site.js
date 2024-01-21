//Ethan Niehus - this is file is needed in order to let the website for the light and dark mode to work

// Function to toggle between light and dark modes

function toggleDarkMode() {
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark-mode');

    // Update the stored mode in localStorage
    const currentMode = htmlElement.classList.contains('dark-mode') ? 'dark-mode' : 'light-mode';
    localStorage.setItem('mode', currentMode);
}

// Event listener for the button to toggle dark mode
document.getElementById('toggleDarkModeButton').addEventListener('click', toggleDarkMode);

// Check if a mode is stored in localStorage and apply it
const savedMode = localStorage.getItem('mode');
document.documentElement.classList.add(savedMode || 'light-mode');
