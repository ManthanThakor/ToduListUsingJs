const inputAddTask = document.getElementById("input-add-task");
const btnAddTask = document.querySelector(".btn-todo");
const taskList = document.querySelector(".task-list");
const errorMessage = document.querySelector(".error-message");
const taskMessage = document.getElementById("task-message");

const saveTasksToLocalStorage = () => {
  const tasks = Array.from(taskList.children).map((task) => ({
    text: task.querySelector("span").textContent,
    isDone: task.querySelector("span").classList.contains("done"),
  }));
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(({ text, isDone }) => {
    addTaskToList(text, isDone);
  });
};

const updateTaskListMessage = () => {
  if (taskList.children.length === 0) {
    taskMessage.textContent = "No tasks available";
    taskMessage.style.display = "block";
  } else {
    taskMessage.style.display = "none";
  }
};

const addTaskToList = (taskText, isDone = false) => {
  const listItem = document.createElement("li");
  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  if (isDone) {
    taskSpan.classList.add("done");
  }

  listItem.appendChild(taskSpan);
  taskList.appendChild(listItem);

  const doneBtn = document.createElement("button");
  doneBtn.textContent = isDone ? "Undo" : "Done";
  doneBtn.classList.add("done-btn");
  doneBtn.addEventListener("click", () => {
    taskSpan.classList.toggle("done");
    doneBtn.textContent = taskSpan.classList.contains("done") ? "Undo" : "Done";
    saveTasksToLocalStorage();
  });
  listItem.appendChild(doneBtn);

  const removeBtn = document.createElement("button");
  removeBtn.textContent = "Remove";
  removeBtn.classList.add("remove-btn");
  removeBtn.addEventListener("click", () => {
    taskList.removeChild(listItem);
    updateTaskListMessage();
    saveTasksToLocalStorage();
  });
  listItem.appendChild(removeBtn);

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

btnAddTask.addEventListener("click", addTask);

inputAddTask.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

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
