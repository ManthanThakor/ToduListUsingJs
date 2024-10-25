const inputAddTask = document.getElementById("input-add-task");
const btnAddTask = document.querySelector(".btn-todo");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const taskMessage = document.getElementById("task-message");

// Function to save tasks to local storage
const saveTasksToLocalStorage = () => {
  const tasks = [];
  document.querySelectorAll(".task-list li").forEach((li) => {
    const taskText = li.querySelector("span").textContent;
    const isDone = li.querySelector("span").classList.contains("done");
    tasks.push({ text: taskText, done: isDone });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => {
    addTaskToList(task.text, task.done);
  });
};

// Function to update the task message
const updateTaskListMessage = () => {
  const totalTasks = taskList.children.length;
  taskMessage.style.display = totalTasks > 0 ? "block" : "none";
  taskMessage.textContent = `You have ${totalTasks} task${
    totalTasks === 1 ? "" : "s"
  }.`;
};

// Function to add task to the list
const addTaskToList = (taskText, isDone = false) => {
  const listItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  if (isDone) {
    taskSpan.classList.add("done");
  }

  listItem.appendChild(taskSpan);

  // Create a div to hold the buttons
  const buttonContainer = document.createElement("div");
  buttonContainer.classList.add("button-container");

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
  buttonContainer.appendChild(doneBtn);

  // Create Remove button with icon
  const removeBtn = document.createElement("button");
  removeBtn.classList.add("remove-btn");
  removeBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  removeBtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  buttonContainer.appendChild(removeBtn);

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
  buttonContainer.appendChild(editBtn);

  // Append button container to the list item
  listItem.appendChild(buttonContainer);

  // Set flex properties
  listItem.style.display = "flex";
  listItem.style.justifyContent = "space-between";
  listItem.style.alignItems = "center";

  taskList.appendChild(listItem);
  updateTaskListMessage();
};

// Event listener for adding a task
btnAddTask.addEventListener("click", () => {
  const taskText = inputAddTask.value.trim();
  if (taskText === "") {
    errorMessage.textContent = "Please enter a task.";
    return;
  }
  errorMessage.textContent = "";
  addTaskToList(taskText);
  inputAddTask.value = ""; // Clear input after adding
  saveTasksToLocalStorage();
});

// Load tasks from local storage on page load
document.addEventListener("DOMContentLoaded", loadTasksFromLocalStorage);

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
