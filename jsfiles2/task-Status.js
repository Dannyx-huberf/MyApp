import {checkDarkMode} from '../jsFiles/darkModeToggle.js'
// Function to calculate all task statistics

checkDarkMode();
function getAllTaskStats() {
    const taskTypes = ['daily_tasks', 'weekly_tasks', 'monthly_tasks', 'yearly_tasks'];
    const stats = {
        pending: 0,
        completed: 0,
        byCategory: {}
    };

    // Initialize each category
    taskTypes.forEach(type => {
        stats.byCategory[type] = {
            pending: 0,
            completed: 0,
            tasks: []
        };
    });

    // Calculate statistics
    taskTypes.forEach(type => {
        try {
            const tasks = JSON.parse(localStorage.getItem(type)) || [];
            tasks.forEach(task => {
                const isCompleted = typeof task === 'object' && task.completed;
                const taskName = typeof task === 'string' ? task : task.text;

                if (isCompleted) {
                    stats.completed++;
                    stats.byCategory[type].completed++;
                } else {
                    stats.pending++;
                    stats.byCategory[type].pending++;
                }

                stats.byCategory[type].tasks.push({
                    name: taskName,
                    completed: isCompleted
                });
            });
        } catch (e) {
            console.error(`Error processing ${type} tasks:`, e);
        }
    });

    return stats;
}

// Function to update the display
function updateTaskStatsDisplay() {
    const stats = getAllTaskStats();
    
    // Update summary numbers
    document.getElementById('pending-count').textContent = stats.pending;
    document.getElementById('completed-count').textContent = stats.completed;
    
    // Create detailed breakdown
    const breakdownElement = document.getElementById('tasks-breakdown');
    breakdownElement.innerHTML = '<h2>Detailed Breakdown</h2>';
    
    for (const [category, data] of Object.entries(stats.byCategory)) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'task-category';
        categoryElement.innerHTML = `
            <h3 class="category-name">${formatCategoryName(category)} (${data.pending + data.completed})</h3>
            <p class="counts"><strong class="pends">Pending:</strong> ${data.pending} | <strong class="comps">Completed:</strong> ${data.completed}</p>
            <ul class= "list-group">
                ${data.tasks.map(task => `
                    <li style="${task.completed ? 'text-decoration: line-through; color: #888' : ''}">
                        ${task.name}
                    </li>
                `).join('')}
            </ul>
        `;
        breakdownElement.appendChild(categoryElement);
    }
}

// Helper function to format category names
function formatCategoryName(category) {
    return category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', updateTaskStatsDisplay);

// Optional: Update when storage changes (for multi-tab usage)
window.addEventListener('storage', updateTaskStatsDisplay);