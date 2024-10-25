const inputAddTask = document.getElementById("input-add-task");
const btnAddTask = document.querySelector(".btn-todo");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const taskMessage = document.getElementById("task-message");

const saveTasksToLocalStorage = () => {
  const tasks = Array.from(taskList.children).map(
    (task) => task.querySelector("span").textContent
  );
  console.log(tasks);
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

// Function to load tasks from local storage
const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskText) => {
    addTaskToList(taskText);
  });
};

// Function to update the task message (e.g., "No tasks available")
const updateTaskListMessage = () => {
  if (taskList.children.length === 0) {
    taskMessage.textContent = "No tasks available";
    taskMessage.style.display = "block";
  } else {
    taskMessage.style.display = "none";
  }
};

// Reusable function to add a task item to the list
const addTaskToList = (taskText) => {
  const listItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;
  listItem.appendChild(taskSpan);
  taskList.appendChild(listItem);

  // Remove item
  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("remove-btn");
  removeBtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  listItem.appendChild(removeBtn);

  // Edit item
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", () => {
    inputAddTask.value = taskSpan.textContent;
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  listItem.appendChild(editBtn);

  updateTaskListMessage();
};

// Main add task function (handles input and local storage)
const addTask = () => {
  const taskText = inputAddTask.value.trim();

  if (taskText) {
    addTaskToList(taskText); // Add task to list
    inputAddTask.value = "";
    errorMessage.textContent = "";
    saveTasksToLocalStorage(); // Save task to local storage
  } else {
    errorMessage.textContent = "Please Enter a Task";
  }
};

btnAddTask.addEventListener("click", addTask);

const keypressFn = (e) => {
  if (e.key === "Enter") {
    addTask();
  }
};
inputAddTask.addEventListener("keypress", keypressFn);

// Load tasks on page load
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

searchIcon.addEventListener("click", () => {
  searchInput.value = "";
  searchResults.innerHTML = "<li>No tasks found</li>";
  searchModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  searchModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === searchModal) {
    searchModal.style.display = "none";
  }
});

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
