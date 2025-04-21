// width.js
export function validateTaskInput(inputValue) {  // Changed parameter name for clarity
    if (!inputValue) return "Please enter a task!";
    
    const inputText = inputValue.trim();
    if (!inputText) return "Please enter a task!";
    
    const words = inputText.split(/\s+/).filter(word => word.length > 0);
    const viewportWidth = window.innerWidth;

    if (inputText.length > 50) return "Task should be less than 50 characters!";
    if (viewportWidth <= 370 && words.length > 20) return "Maximum 20 words allowed on small screens!";
    if (viewportWidth <= 500 && words.length > 40) return "Maximum 40 words allowed on medium screens!";
    
    return null;
}
