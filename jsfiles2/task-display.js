const darkModeIcon = document.querySelector('.dark-mode');
const lightModeIcon = document.querySelector('.light-mode');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Initialize dark mode and display tasks when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkDarkMode();
    displayTasks('completed-tasks', 'completed');
    displayTasks('pending-tasks', 'pending');
});

// Get all tasks from localStorage
function getAllTasks() {
    const categories = ['daily_tasks', 'weekly_tasks', 'monthly_tasks', 'yearly_tasks'];
    const allTasks = [];
    
    categories.forEach(category => {
        const tasks = JSON.parse(localStorage.getItem(category)) || [];
        tasks.forEach(task => {
            // Convert string tasks to object format
            if (typeof task === 'string') {
                allTasks.push({
                    text: task,
                    completed: false,
                    category: category
                });
            } else {
                allTasks.push({
                    ...task,
                    category: category
                });
            }
        });
    });
    
    return allTasks;
}

// Separate tasks into completed and pending
function separateTasks() {
    const allTasks = getAllTasks();
    const completed = [];
    const pending = [];

    
    allTasks.forEach(task => {
        if (task.completed) {
            completed.push(task);
   
        } else {
            pending.push(task);
     
        }
    });

    return { completed, pending };
}

// Display tasks in the page
// ... (previous code remains the same until displayTasks function)

// Display tasks in the page with counts
// ... (previous code remains the same until displayTasks function)

// Display tasks in the page and update stats
function displayTasks() {
    const { completed, pending } = separateTasks();
    
    // Update pending tasks count
    const pendingCountElement = document.getElementById('pending-task-count');
    if (pendingCountElement) {
        pendingCountElement.textContent = pending.length;
    }
    
    // Update completed tasks count (if you have one)
    const completedCountElement = document.getElementById('completed-task-count');
    if (completedCountElement) {
        completedCountElement.textContent = completed.length;
    }
    
    // Update task lists (if you're still using these)
    const pendingList = document.getElementById('pending-list');
    const completedList = document.getElementById('completed-list');
    
    if (pendingList) {
        pendingList.innerHTML = pending.map(task => 
            `<li>${task.text} (${task.category.replace('_', ' ')})</li>`
        ).join('');
    }
    
    if (completedList) {
        completedList.innerHTML = completed.map(task => 
            `<li>${task.text} (${task.category.replace('_', ' ')})</li>`
        ).join('');
    }
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', function() {
    checkDarkMode();
    displayTasks(); // This will now update both counts and lists
});


// Check for saved preference or system preference
function checkDarkMode() {
    if (localStorage.getItem('darkMode') === 'enabled' || 
        (prefersDarkScheme.matches && !localStorage.getItem('darkMode'))) {
        enableDarkMode();
    } else {
        disableDarkMode();
    }
}

// Enable dark mode
function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'enabled');
    darkModeIcon.style.display = 'none';
    lightModeIcon.style.display = 'block';
}

// Disable dark mode
function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkMode', 'disabled');
    darkModeIcon.style.display = 'block';
    lightModeIcon.style.display = 'none';
}

// Toggle between dark and light mode
function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

// Event listeners for dark/light mode toggle
darkModeIcon.addEventListener('click', toggleDarkMode);
lightModeIcon.addEventListener('click', toggleDarkMode);

// Watch for system preference changes
prefersDarkScheme.addEventListener('change', checkDarkMode);