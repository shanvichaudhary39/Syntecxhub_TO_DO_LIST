const STORAGE_KEY = 'little-list-tasks';

const taskForm = document.querySelector('#task-form');
const taskInput = document.querySelector('#task-input');
const taskList = document.querySelector('#task-list');
const taskCount = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const clearCompletedButton = document.querySelector('#clear-completed');
const today = document.querySelector('#today');

let tasks = loadTasks();

today.textContent = new Intl.DateTimeFormat('en', {
  weekday: 'short',
  month: 'short',
  day: 'numeric'
}).format(new Date());

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();
  emptyState.hidden = tasks.length > 0;

  const openTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${openTasks} ${openTasks === 1 ? 'thing' : 'things'} left`;

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' completed' : ''}`;

    const checkButton = document.createElement('button');
    checkButton.className = 'check-button';
    checkButton.type = 'button';
    checkButton.setAttribute('aria-label', task.completed ? `Mark ${task.text} as active` : `Complete ${task.text}`);
    checkButton.textContent = task.completed ? '✓' : '';
    checkButton.addEventListener('click', () => toggleTask(task.id));

    const text = document.createElement('p');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.setAttribute('aria-label', `Delete ${task.text}`);
    deleteButton.textContent = '×';
    deleteButton.addEventListener('click', () => deleteTask(task.id));

    item.append(checkButton, text, deleteButton);
    taskList.append(item);
  });
}

function addTask(text) {
  tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map((task) => task.id === id ? { ...task, completed: !task.completed } : task);
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id);
  saveTasks();
  renderTasks();
}

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTask(text);
  taskForm.reset();
  taskInput.focus();
});

clearCompletedButton.addEventListener('click', () => {
  tasks = tasks.filter((task) => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
