document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const startDateInput = document.getElementById("start-date");
  const endDateInput = document.getElementById("end-date");
  const todoList = document.getElementById("todo-list");
  const today = new Date().toISOString().split("T")[0];

  startDateInput.setAttribute("min", today);

  startDateInput.addEventListener("change", function () {
    endDateInput.setAttribute("min", this.value);
  });

  document.getElementById("add-todo").addEventListener("click", function () {
    addTodo();
  });

  todoInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      addTodo();
    }
  });

  loadTasks();

  function addTodo() {
    const todoText = todoInput.value.trim();
    const start = startDateInput.value;
    const end = endDateInput.value;

    let isValid = true;

    clearErrors();

    if (todoText === "") {
      displayError(todoInput);
      isValid = false;
    }

    if (start === "") {
      displayError(startDateInput);
      isValid = false;
    }

    if (end === "") {
      displayError(endDateInput);
      isValid = false;
    }

    if (!isValid) return;

    const id = getRandomId();
    addTodoItem(todoText, start, end, id);
    saveTasksToLocalStorage(todoText, start, end, id);
    todoInput.value = "";
    startDateInput.value = "";
    endDateInput.value = "";
  }

  function displayError(element) {
    element.style.borderColor = "red";
  }

  function clearErrors() {
    const errorMessages = document.querySelectorAll(".error-message");
    errorMessages.forEach((message) => message.remove());

    todoInput.style.borderColor = "";
    startDateInput.style.borderColor = "";
    endDateInput.style.borderColor = "";
  }

  function addTodoItem(todoText, start, end, id) {
    const todoItem = document.createElement("li");

    const todoSpan = document.createElement("span");
    todoSpan.innerHTML = `${todoText} <small>(${start} - ${end})</small>`;
    todoItem.appendChild(todoSpan);
    todoItem.id = id;

    const completeButton = document.createElement("button");
    completeButton.textContent = "Complete";
    completeButton.classList.add("complete");
    completeButton.addEventListener("click", function () {
      todoItem.classList.toggle("completed");
      if (todoItem.classList.contains("completed")) {
        completeButton.textContent = "Completed";
      } else {
        completeButton.textContent = "Complete";
      }
      updateTasksToLocalStorage(id);
    });
    todoItem.appendChild(completeButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", function () {
      todoList.removeChild(todoItem);
      updateTasksToLocalStorage(id, true);
    });
    todoItem.appendChild(deleteButton);

    todoList.appendChild(todoItem);
  }

  function saveTasksToLocalStorage(todoText, start, end, id) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const newTask = {
      completed: false,
      start,
      end,
      todoText,
      id,
    };
    tasks = [...tasks, newTask];
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    tasks.forEach((task) => {
      const { completed, start, end, todoText, id } = task;
      const todoItem = document.createElement("li");

      const todoSpan = document.createElement("span");
      todoSpan.innerHTML = `${todoText} <small>(${start} - ${end})</small>`;
      if (completed) {
        todoItem.classList.add("completed");
      }
      todoItem.appendChild(todoSpan);

      const completeButton = document.createElement("button");
      completeButton.textContent = "Complete";
      completeButton.classList.add("complete");
      completeButton.addEventListener("click", function () {
        todoItem.classList.toggle("completed");
        if (todoItem.classList.contains("completed")) {
          completeButton.textContent = "Completed";
        } else {
          completeButton.textContent = "Complete";
        }
        updateTasksToLocalStorage(id);
      });
      todoItem.appendChild(completeButton);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", function () {
        todoList.removeChild(todoItem);
        updateTasksToLocalStorage(id, true);
      });
      todoItem.appendChild(deleteButton);

      todoList.appendChild(todoItem);
    });
  }

  const updateTasksToLocalStorage = (id, deleted = false) => {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    if (deleted) {
      tasks = tasks.filter((task) => id !== task.id);
    } else {
      tasks = tasks.map((task) => {
        if (id === task.id) {
          return { ...task, completed: !task.completed };
        }
        return task;
      });
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
});

const getRandomId = () => {
  const constants =
    "0123456789abcdefghijklmnopqrstuvxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let id = "";
  for (let i = 0; i < 8; i++) {
    id += constants[Math.floor(Math.random() * constants.length)];
  }
  return id;
};
