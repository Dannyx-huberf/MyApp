import { validateTaskInput } from "./width.js";
import { checkDarkMode } from "./darkModeToggle.js";
import { handleTaskChange } from "./homePage.js";
// DOM Elements (same structure as daily)
const inputValue = document.getElementById('input');
const addButton = document.getElementById('addBtn');
const taskList = document.querySelector('.list');
const clearButton = document.querySelector('.clear');
const modalContainer = document.getElementById('modal_container');
const cancelButton = document.querySelector('.cancel');
const confirmButton = document.querySelector('.confirm');
const headerButton = document.getElementById('header-btn');
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menu-btn');


checkDarkMode(); // Check dark mode on load
// Key change: Use 'weekly_tasks' instead of 'tasks'
const tasks = JSON.parse(localStorage.getItem('monthly_tasks')) || [];

// Load saved weekly tasks
function loadTasks() {
    taskList.innerHTML = '';
    tasks.forEach(task => {
        addTask(task);
    });
}

document.addEventListener('DOMContentLoaded', loadTasks);

function addTask(task) {
    // Ensure task is an object (if string is passed, convert it)
    if (typeof task === 'string') {
        task = { text: task, completed: false };
    }

    const taskItem = document.createElement('li');
    taskItem.textContent = task.text; // Now always uses task.text

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-radio';
    checkbox.checked = task.completed || false;

    checkbox.addEventListener('change', (event) => {
        taskItem.style.textDecoration = event.target.checked ? 'line-through' : 'none';
        taskItem.style.color = event.target.checked ? 'gray' : 'white';
        saveTasks(); // Now saves the updated completion status
    });

    if (checkbox.checked) {
        taskItem.style.textDecoration = 'line-through';
        taskItem.style.color = 'gray';
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete';
    deleteButton.textContent = '🗑️';
    deleteButton.addEventListener('click', () => {
        taskItem.remove();
        saveTasks();
    });

    taskItem.prepend(checkbox);
    taskItem.appendChild(deleteButton);
    taskList.appendChild(taskItem);
}

// Save to 'weekly_tasks' in localStorage
function saveTasks() {
    const taskElements = Array.from(taskList.querySelectorAll('li'));
    const tasksToSave = taskElements.map(li => {
        const text = li.textContent.replace('🗑️', '').trim();
        const isCompleted = li.querySelector('.task-radio').checked;
        return { text, completed: isCompleted }; // Save as object
    });

    localStorage.setItem('monthly_tasks', JSON.stringify(tasksToSave));
    handleTaskChange(); // Update pending tasks count
}
function handleAddTask() {
    const task = inputValue.value;
    
    if (!task) {
        showInputError('Please enter a task!');
        return;
    }
    
    if (task.length > 50) {
        showInputError('Task should be less than 50 characters!');
        return;
    }
    
    if (validateTaskInput(task)) {
        showInputError('Task exceeds word limit for current screen size!');
        return;
    }
    
    tasks.push(task);
    addTask(task);
    inputValue.value = '';
    saveTasks();
    handleTaskChange(); // Update pending tasks count
}

function showInputError(message) {
    alert(message);
    inputValue.style.border = '1px solid red';
    inputValue.ariaRequired = true;
    setTimeout(() => {
        inputValue.style.border = '';
    }, 2000);
}

function clearTasks(){
    const taskElements = Array.from(taskList.querySelectorAll('li'));
    taskElements.forEach(li => {
        li.remove();
    });
    localStorage.removeItem('monthly_tasks');
    handleTaskChange(); // Update pending tasks count
}

// Event Listeners (identical to daily)
headerButton.addEventListener('click', event => {
    headerButton.classList.add('type');
    nav.style.display = 'block';
});

menuBtn.addEventListener('click', event => {
    nav.style.display = 'block';
});

addButton.addEventListener('click', handleAddTask);

inputValue.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        handleAddTask();
    }
    if (event.key === 'Escape') {
        inputValue.value = '';
    }
});

clearButton.addEventListener('click', () => {
    if (taskList.children.length === 0) {
        alert('No tasks to clear!');
        return;
    }
    modalContainer.classList.add('active');
    handleTaskChange(); // Update pending tasks count
});

confirmButton.addEventListener('click', () => {
    clearTasks();
    modalContainer.classList.remove('active');
});

cancelButton.addEventListener('click', () => {
    modalContainer.classList.remove('active');
});

window.addEventListener('resize', () => {
    const currentTasks = Array.from(taskList.querySelectorAll('li'))
        .map(li => li.textContent.replace('🗑️', '').trim());
    
    taskList.innerHTML = '';
    currentTasks.forEach(task => addTask(task));
});