class Todo {
  #items;
  #onStateUpdateCalllBack;
  constructor() {
    this.#items = [];
    this.#onStateUpdateCalllBack = null;
  }

  get items() {
    return this.#items;
  }

  addTodo(value) {
    const item = {
      title: value,
      status: false,
    };

    return fetch("https://json-server-mocker-masai.herokuapp.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    })
      .then((res) => {
        console.log(`success`);
        return this.getTodos();
      })
      .catch((err) => {
        console.log(`error`);
      });
  }

  updateStatus(id, newValue) {
    return fetch("https://json-server-mocker-masai.herokuapp.com/tasks/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: newValue,
        status: false,
      }),
    })
      .then((res) => {
        console.log(`success`);
        return this.getTodos();
      })
      .catch((err) => {
        console.log(`error`);
      });
  }

  toggleStatus(id, newStatus) {
    return fetch("https://json-server-mocker-masai.herokuapp.com/tasks/" + id, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: newStatus,
      }),
    })
      .then((res) => {
        console.log(`success`);
        return this.getTodos();
      })
      .catch((err) => {
        console.log(`error`);
      });
  }

  deleteTodo(id) {
    return fetch("https://json-server-mocker-masai.herokuapp.com/tasks/" + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        console.log(`success`);
        return this.getTodos();
      })
      .catch((err) => {
        console.log(`error`);
      });
  }

  getTodos() {
    return fetch("https://json-server-mocker-masai.herokuapp.com/tasks")
      .then((res) => res.json())
      .then((res) => {
        this.#items = res;
        this.stateUpdateEvent();
      })
      .catch((err) => {});
  }

  stateUpdateEvent() {
    console.log(`update`);
    if (this.#onStateUpdateCalllBack) {
      this.#onStateUpdateCalllBack();
    }
  }
  addStateChangeCallBack(func) {
    this.#onStateUpdateCalllBack = func;
  }
}

const todo = new Todo();
todo.addStateChangeCallBack(function () {
  renderTodoList(todo.items);
});

todo.getTodos();
// .then(() => {
// console.log(todo.items);
//   renderTodoList(todo.items);
// });

function renderTodoList(items) {
  const target = document.getElementById("todo-items");

  const itemElement = items.map((item) => createTodoCard(item));
  target.innerHTML = null;
  target.append(...itemElement);
}

function createTodoCard(item) {
  let div = document.createElement("div");
  let title = document.createElement("p");

  let button = document.createElement("button");
  let delbtn = document.createElement("button");
  let updateBtn = document.createElement("button");

  title.textContent = item.title;
  delbtn.textContent = "Delete";
  updateBtn.textContent = "Update";

  button.textContent = item.status;
  div.append(title, button, delbtn, updateBtn);

  button.addEventListener("click", () => {
    todo.toggleStatus(item.id, !item.status);
  });

  delbtn.addEventListener("click", () => {
    todo.deleteTodo(item.id);
  });

  updateBtn.addEventListener("click", () => {
    todo.updateStatus(item.id, "India");
  });

  return div;
}

window.addEventListener("load", () => {
  const addBtn = document.getElementById("add-todo-btn");

  addBtn.addEventListener("click", () => {
    const input = document.getElementById("todo-input");
    const text = input.value;
    todo.addTodo(text).then((res) => {
      renderTodoList(todo.items);
    });
  });
});
