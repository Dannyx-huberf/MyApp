import { checkDarkMode} from "./darkModeToggle.js";

checkDarkMode();

// Function to calculate pending tasks across all categories
function calculateAllTasks() {
    const taskTypes = ['daily_tasks', 'weekly_tasks', 'monthly_tasks', 'yearly_tasks'];
    let pending = 0;
    let completed = 0;
    let total = 0;

    taskTypes.forEach(type => {
        try {
            const tasks = JSON.parse(localStorage.getItem(type)) || [];
            tasks.forEach(task => {
                total++;
                if (typeof task === 'string') {
                    pending++; // String tasks are always pending
                } else if (typeof task === 'object') {
                    if (task.completed) {
                        completed++;
                    } else {
                        pending++;
                    }
                } else {
                    console.warn(`Unknown task format in ${type}:`, task);
                }
            });
        } catch (e) {
            console.error(`Error processing ${type} tasks:`, e);
        }
    });

    return { pending, completed, total };
}
function updateTasksDisplay() {
    try {
        const { pending, completed, total } = calculateAllTasks();
        
        // Update pending tasks display
        const pendingElement = document.getElementById('pending-task');
        if (pendingElement) {
            pendingElement.innerHTML = pending;
            pendingElement.style.color = pending > 0 ? 'red' : 'green';
            pendingElement.title = `${pending} of ${total} tasks remaining`;
        }
        
        // Update completed tasks display (optional)
        const completedElement = document.getElementById('completed-task');
        if (completedElement) {
            completedElement.innerHTML = completed;
            completedElement.style.color = 'var(--completed-color, #4CAF50)';
            completedElement.title = `${completed} tasks done`;
        }
        
        // Update progress (optional)
        const progressElement = document.getElementById('tasks-progress');
        if (progressElement && total > 0) {
            const percent = Math.round((completed / total) * 100);
            progressElement.textContent = `${percent}%`;
            progressElement.style.width = `${percent}%`;
        }
    } catch (error) {
        console.error('Error updating tasks display:', error);
    }
}
export function handleTaskChange() {
    // Use requestAnimationFrame for smooth UI updates
    requestAnimationFrame(() => {
        updateTasksDisplay();
    });
}
// Wait for full page load including all elements
document.addEventListener('DOMContentLoaded', () => {
    // Initial display update
    updateTasksDisplay();
    
    // Optional: Periodic refresh in case of changes from other tabs
    setInterval(updateTasksDisplay, 15000);
});