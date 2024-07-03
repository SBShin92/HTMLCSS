document.addEventListener("DOMContentLoaded", function () {
  const apiUrl = "http://localhost:8080/myportal/api/todos"; // API URL
  const todoList = document.getElementById("todo-list"); // TODO list element: ul#todo-list
  const newTodoInput = document.getElementById("new-todo"); // New TODO input element: input#new-todo
  const addTodoButton = document.getElementById("add-todo"); // Add TODO button element: button#add-todo

  // Add TODO to DOM
  //  새로운 todo item을 ul#todo-list에 추가하는 함수
  function addTodoToDOM(todo) {
    const li = document.createElement("li");
    li.className = "todo-item";
    li.textContent = `[${todo.id}] `;
    li.textContent += todo.title + ", " + todo.completed;

    const button = document.createElement("button");
    button.addEventListener("click", () => deleteTodo(todo.id));
    button.textContent = "delete";
    li.appendChild(button);
    todoList.appendChild(li);
  }

  // Fetch and display existing TODOs
  //  API로부터 todo list를 가져와서 화면에 표시하는 함수
  async function fetchTodos() {
    try {
      todoList.innerHTML = "";
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const todos = await response.json();
      todos.forEach((todo) => addTodoToDOM(todo));
    } catch (error) {
      console.error(error);
    }
  }

  // Add new TODO
  //  새로운 todo를 추가하는 이벤트 핸들러 연결
  addTodoButton.addEventListener("click", async (event) => {
    try {
      const title = newTodoInput.value;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          title: title,
          completed: false,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      addTodoToDOM(json);
      console.log(title);
    } catch (error) {
      console.error(error);
    }
  });

  // Delete TODO
  //  특정 todo를 삭제하는 함수 (삭제 버튼의 클릭 이벤트 핸들러로 사용됨)
  const deleteTodo = async function (id) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Initial fetch
  fetchTodos();
});
