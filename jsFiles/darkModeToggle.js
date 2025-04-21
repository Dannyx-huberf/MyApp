// Dark Mode Toggle
const darkModeIcon = document.querySelector('.dark-mode');
const lightModeIcon = document.querySelector('.light-mode');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved preference or system preference
export function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (prefersDarkScheme.matches && !localStorage.getItem('darkMode'))) {
        document.body.classList.add('dark-mode');
        darkModeIcon.style.display = 'none';
        lightModeIcon.style.display = 'block';
    }
}

// Initialize dark mode check
checkDarkMode();
toggleDarkMode();
// Toggle dark mode
function toggleDarkMode() {
    const isDark = !document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode');
    
    darkModeIcon.style.display = isDark ? 'none' : 'block';
    lightModeIcon.style.display = isDark ? 'block' : 'none';
    
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

// Event listeners
darkModeIcon.addEventListener('click', toggleDarkMode);
lightModeIcon.addEventListener('click', toggleDarkMode);

// Watch for system preference changes
prefersDarkScheme.addEventListener('change', checkDarkMode);

export function toggle(){
    // Add to your script file
document.querySelector('.dark-mode').addEventListener('click', () => {
    document.body.classList.add('dark-mode');
});

document.querySelector('.light-mode').addEventListener('click', () => {
    document.body.classList.remove('dark-mode');
});
}