// Get DOM elements
const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    renderTodos();
    updateStats();
});

// Add event listeners
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Add a new to-do
function addTodo() {
    const text = todoInput.value.trim();

    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    updateStats();
    todoInput.value = '';
    todoInput.focus();
}

// Render all to-dos
function renderTodos() {
    todoList.innerHTML = '';

    todos.forEach((todo) => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;

        todoList.appendChild(li);
    });
}

// Toggle todo completion status
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
        updateStats();
    }
}

// Delete a to-do
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    renderTodos();
    updateStats();
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;

    totalCount.textContent = total;
    completedCount.textContent = completed;
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

// Escape HTML special characters
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
