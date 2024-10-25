const inputAddTask = document.getElementById("input-add-task");
const btnAddTask = document.querySelector(".btn-todo");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const taskMessage = document.getElementById("task-message");

// Function to save tasks to Local Storage
const saveTasksToLocalStorage = () => {
  const tasks = Array.from(taskList.children).map((task) => ({
    text: task.querySelector("span").textContent,
    isDone: task.querySelector("span").classList.contains("done"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to load tasks from Local Storage
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ text, isDone }) => {
    addTaskToList(text, isDone);
  });
};

// Function to update task list message
const updateTaskListMessage = () => {
  taskMessage.textContent =
    taskList.children.length === 0 ? "No tasks available" : "";
  taskMessage.style.display = taskList.children.length === 0 ? "block" : "none";
};

// Function to add a task to the list
const addTaskToList = (taskText, isDone = false) => {
  const listItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  if (isDone) {
    taskSpan.classList.add("done");
  }

  listItem.appendChild(taskSpan);

  // Create Done/Undo button with icon
  const doneBtn = document.createElement("button");
  doneBtn.classList.add("done-btn");
  doneBtn.innerHTML = isDone
    ? '<i class="fa-solid fa-hourglass"></i>'
    : '<i class="fa-solid fa-circle-check"></i>';

  doneBtn.addEventListener("click", () => {
    taskSpan.classList.toggle("done");
    doneBtn.innerHTML = taskSpan.classList.contains("done")
      ? '<i class="fa-solid fa-hourglass"></i>'
      : '<i class="fa-solid fa-circle-check"></i>';
    saveTasksToLocalStorage();
  });
  listItem.appendChild(doneBtn);

  // Create Remove button with icon
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  removeBtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  listItem.appendChild(removeBtn);

  // Create Edit button with icon
  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-btn");
  editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  editBtn.addEventListener("click", () => {
    inputAddTask.value = taskSpan.textContent;
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  listItem.appendChild(editBtn);

  // Set flex properties
  listItem.style.display = "flex";
  listItem.style.justifyContent = "space-between";
  listItem.style.alignItems = "center";

  taskList.appendChild(listItem);
  updateTaskListMessage();
};

// Function to add a task when button is clicked
const addTask = () => {
  const taskText = inputAddTask.value.trim();

  if (taskText) {
    addTaskToList(taskText);
    inputAddTask.value = "";
    errorMessage.textContent = "";
    saveTasksToLocalStorage();
  } else {
    errorMessage.textContent = "Please Enter a Task";
  }
};

// Event listeners
btnAddTask.addEventListener("click", addTask);
inputAddTask.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

// Load tasks from Local Storage on page load
loadTasksFromLocalStorage();

//--------------------------
// Modal Box and Search Functionality
//--------------------------
const searchModal = document.getElementById("search-modal");
const searchIcon = document.getElementById("search-icon");
const closeModal = document.querySelector(".close");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchResults = document.getElementById("search-results");

// Open search modal
searchIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchResults.innerHTML = "<li>No tasks found</li>";
  searchModal.style.display = "block";
});

// Close search modal
closeModal.addEventListener("click", () => {
  searchModal.style.display = "none";
});

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === searchModal) {
    searchModal.style.display = "none";
  }
});

// Search functionality
searchBtn.addEventListener("click", () => {
  const query = searchInput.value.toLowerCase();
  searchResults.innerHTML = "";
  const tasks = Array.from(taskList.children);

  let tasksFound = false;
  tasks.forEach((task) => {
    const taskText = task.querySelector("span").textContent.toLowerCase();
    if (taskText.includes(query)) {
      const resultItem = document.createElement("li");
      resultItem.textContent = task.querySelector("span").textContent;
      searchResults.appendChild(resultItem);
      tasksFound = true;
    }
  });

  if (!tasksFound) {
    searchResults.innerHTML = "<li>No tasks found</li>";
  }
});
