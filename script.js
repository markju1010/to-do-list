const todoForm = document.querySelector("form");
const todoInput = document.getElementById("todo-input");
const todoListUL = document.getElementById("todo-list");

let allTodos = [];

// Load todos from local storage (before clearing the list)
loadTodos();

todoForm.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo();
});

function addTodo() {
  const todoText = todoInput.value.trim();
  if (todoText.length > 0) {
    allTodos.unshift({ text: todoText, done: false }); // New tasks go to the top
    updateTodoList();
    saveTodos();
    todoInput.value = "";
  }
}

function updateTodoList() {
  todoListUL.innerHTML = ""; // Clear the UI before re-rendering
  
  // Sort: Unfinished tasks first, completed tasks last
  allTodos.sort((a, b) => a.done - b.done);

  allTodos.forEach((todo, todoIndex) => {
    const todoItem = createTodoItem(todo, todoIndex);
    todoListUL.append(todoItem);
  });
}

function createTodoItem(todo, todoIndex) {
  const todoId = "todo-" + todoIndex;
  const todoLI = document.createElement("li");
  todoLI.className = "todo";
  todoLI.innerHTML = `
    <input type="checkbox" id="${todoId}" ${
    todo.done ? "checked" : ""
  } onchange="toggleTodoDone(${todoIndex})">
    <label class="custom-checkbox" for="${todoId}">
      <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
      </svg>
    </label>
    <label for="${todoId}" class="todo-text">${todo.text}</label>
    <button class="delete-button" onclick="deleteTodo(${todoIndex})">
      <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px">
        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
      </svg>
    </button>
  `;
  return todoLI;
}

function toggleTodoDone(todoIndex) {
  allTodos[todoIndex].done = !allTodos[todoIndex].done;
  saveTodos();
  updateTodoList(); // Refresh UI to reflect new order
}

function deleteTodo(todoIndex) {
  allTodos.splice(todoIndex, 1);
  updateTodoList();
  saveTodos();
}

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(allTodos));
}

function loadTodos() {
  const storedTodos = localStorage.getItem("todos");
  if (storedTodos) {
    allTodos = JSON.parse(storedTodos);
  }
  updateTodoList(); // Ensure the list is rendered properly
}
