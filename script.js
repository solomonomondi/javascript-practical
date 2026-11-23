
const taskInput = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const errorMsg = document.getElementById("error-msg");
const taskList = document.getElementById("task-list");
const taskCounter = document.getElementById("task-counter");
const clearBtn = document.getElementById("clear-btn");
const emptyMsg = document.getElementById("empty-msg");


let tasks = [];
function saveTasks() {
  
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    
    tasks = JSON.parse(saved);
  }
}


function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.remove("hidden");
}

function hideError() {
  errorMsg.classList.add("hidden");
}


function renderTasks() {
  
  taskList.innerHTML = "";

  tasks.forEach(function (task) {
    // Create the elements in memory
    const li = document.createElement("li");
    li.classList.add("task");
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = task.text; 

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.textContent = "Delete";

    // Each task's own controls get their own listeners
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    // Attach the pieces to the li, then the li to the list
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCounterAndEmptyState();
}

// the added work
function updateCounterAndEmptyState() {
  const total = tasks.length;
  taskCounter.textContent = total === 1 ? "1 task" : total + " tasks";

  if (total === 0) {
    emptyMsg.classList.remove("hidden");
    clearBtn.classList.add("hidden");
  } else {
    emptyMsg.classList.add("hidden");
    clearBtn.classList.remove("hidden");
  }
}

// actions
function addTask() {
  // Remove extra spaces before checking if it is empty
  const text = taskInput.value.trim();

  if (text === "") {
    showError("Please type a task before adding it.");
    taskInput.focus();
    return; 
  }

  hideError();

  const newTask = {
    id: Date.now(), 
    text: text,
    completed: false,
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();

  taskInput.value = ""; 
  taskInput.focus();
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed; 
    }
  });
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  // Keep every task except the one with this id
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveTasks();
  renderTasks();
}

function clearAllTasks() {
  if (tasks.length === 0) {
    return;
  }
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// event listener

addBtn.addEventListener("click", addTask);

// Pressing Enter in the input also adds the task
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Hide the error as soon as the user starts typing again
taskInput.addEventListener("input", hideError);

clearBtn.addEventListener("click", clearAllTasks);

// starting the app
loadTasks();
renderTasks();