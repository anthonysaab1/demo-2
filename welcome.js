let logoutBtn = document.getElementById("logoutBtn");
let outputMsg = document.getElementById("welcome");
let MainTable = document.getElementById("mainTable");
let divComplete = document.getElementById("completed");
let isCompleted = document.getElementById("isCompleted");
let taskName = document.getElementById("userName");
let userIdCheck = document.getElementById("userId");
let saveBtn = document.getElementById("saveBtn");
let addBtn = document.getElementById("addBtn");
let errorMsg = document.getElementById("errorMsg");
const loader = document.getElementById("loader");
let allData = [];
let userId;
let allEditedData = [];

let addedTable = localStorage.addItem ? JSON.parse(localStorage.addItem) : [];
const deletedItem = localStorage.deletedItem
  ? JSON.parse(localStorage.deletedItem)
  : [];
const editDataLS = localStorage.editData
  ? JSON.parse(localStorage.editData)
  : [];

let editDataObj = {};
outputMsg.textContent = `Welcome ${localStorage.lastname}`;
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
loader.style.display = "block";
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((data) => {
    allData = data;
    allEditedData = data;
    let addDataLs = localStorage.addItem
      ? JSON.parse(localStorage.addItem)
      : [];
    for (let i = 0; i < addDataLs.length; i++) {
      data.push(addDataLs[i]);
    }

    data.forEach((todo) => {
      createTable(todo);
    });

    loader.style.display = "none";
  });

function createTable(todo) {
  let editBtn = document.createElement("button");
  let editRow = document.createElement("td");
  editBtn.innerHTML = editMark;
  let trashBtn = document.createElement("button");
  let trashRow = document.createElement("td");
  let tableRow = document.createElement("tr");
  tableRow.setAttribute("id", todo.id);
  let taskNameRow = document.createElement("td");

  let completed = document.createElement("td");
  loader.style.display = "block";
  if (
    deletedItem.includes(todo.id) ||
    todo.userId != JSON.parse(localStorage.id)
  ) {
    return;
  }

  userId = todo.userId;

  taskNameRow.textContent = todo.title;
  for (let i = 0; i < editDataLS.length; i++) {
    if (editDataLS[i].id == todo.id) {
      taskNameRow.textContent = editDataLS[i].title;
      completed.innerHTML = editDataLS[i].completed
        ? completedMark
        : unCompletedMark;
      todo.completed = editDataLS[i].completed;
      todo.title = editDataLS[i].title;
    }
  }

  trashBtn.innerHTML = trashMark;
  completed.innerHTML = todo.completed ? completedMark : unCompletedMark;
  trashRow.append(trashBtn);
  editRow.append(editBtn);
  tableRow.append(taskNameRow, completed, editRow, trashRow);

  MainTable.append(tableRow);
  editfunc(editBtn, todo);
  deleteFunc(trashBtn, todo);
}

function editfunc(editBtn, todo) {
  editBtn.addEventListener("click", async function editObjectById() {
    userIdCheck.value = todo.id;
    let todoRow = document.getElementById(userIdCheck.value);
    taskName.value = todoRow.children[0].textContent;
    addBtn.style.display = "none";
    saveBtn.style.display = "block";
    isCompleted.checked = isCompleted.disabled = todo.completed;
  });
}
//Save btn
saveBtn.addEventListener("click", async function addObject() {
  loader.style.display = "block";
  let todoRow = document.getElementById(userIdCheck.value);
  let completed;

  if (!taskName.value.length) {
    errorMsg.textContent = "Hit the pen button";
    return;
  }
  allData.forEach((todo) => {
    if (todo.title == taskName.value) {
      falsy();
      taskName.value = "";
      addBtn.style.display = "block";
      return;
    }

    if (isCompleted.checked) {
      todoRow.children[1].innerHTML = completedMark;
      todo.completed = true;
      completed = true;
    } else {
      completed = false;
    }

    if (todo.title == taskName.value) {
      taskName.value = "";
      addBtn.style.display = "";
      return;
    }
    if (todo.id == userIdCheck.value) {
      localStorage.setItem("taskId", userIdCheck.value);
      fetch(
        `https://jsonplaceholder.typicode.com/posts/${userIdCheck.value}`,

        {
          method: "PUT",
          body: JSON.stringify({
            userId: todo.userId,
            id: todo.id,
            title: taskName.value,
            completed: completed,
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        }
      )
        .then((response) => response.json())
        .then((json) => console.log(json));

      editDataObj = {
        userId: todo.userId,
        id: todo.id,
        title: taskName.value,
        completed,
      };

      editDataLS.push(editDataObj);
      localStorage.setItem("editData", JSON.stringify(editDataLS));
      todoRow.children[0].textContent = taskName.value;
      taskName.value = "";
      addBtn.style.display = "";
    }
  });

  falsy();
});
//
////////
//Delete
function deleteFunc(trashBtn, todo) {
  let todoRow = document.getElementById(todo.id);
  trashBtn.addEventListener("click", async function deleteObjectById() {
    trashBtn.disabled = true;

    loader.style.display = "block";
    taskName.value = "";
    addBtn.style.display = "block";
    saveBtn.style.display = "none";
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${todo.id}`,

        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`Failed to delete object with ID ${todo.id}`);
      } else {
        allData = allData.filter((element) => {
          element.id !== todo.id;
        });
        console.log(allData);

        deletedItem.push(todo.id);
        localStorage.setItem("deletedItem", JSON.stringify(deletedItem));
        MainTable.removeChild(todoRow);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
    falsy();
  });
}
//
//Add to table
let LSidAdded = localStorage.idAdded ? JSON.parse(localStorage.idAdded) : 200;
addBtn.addEventListener("click", function addObjectTotable() {
  if (!taskName.value.length) {
    errorMsg.textContent = "Empty Title Name";
    return;
  }
  loader.style.display = "block";
  LSidAdded++;
  let completed;
  localStorage.setItem("idAdded", JSON.stringify(LSidAdded));

  completed = isCompleted.checked;
  fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify({
      userId: `11`,
      id: LSidAdded,
      title: taskName.value,
      completed,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => console.log(json));
  addedObj = {
    userId: userId,
    id: LSidAdded,
    title: taskName.value,
    completed,
  };
  addedTable.push(addedObj);
  localStorage.setItem("addItem", JSON.stringify(addedTable));
  errorMsg.textContent = "";
  taskName.value = "";
  falsy();
});
////////
function falsy() {
  isCompleted.checked = false;
  isCompleted.disabled = false;
  loader.style.display = "none";
  saveBtn.style.display = "none";
}

let unCompletedMark = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 384 512"
id="spanBtn"
>
<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
<path
  d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
/>
</svg>`;
let completedMark = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 448 512"
id="checkBtn"
>
<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
<path
  d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
/>
</svg>`;
let editMark = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 512 512"
id="editBtn"
>
<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
<path
  d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
/>
</svg>`;
let trashMark = `<svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 448 512"
id="deleteBtn"
>
<!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
<path
  d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
/>
</svg>`;
