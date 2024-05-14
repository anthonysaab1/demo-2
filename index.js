let logoutBtn = document.getElementById("logoutBtn");
let MainTable = document.getElementById("tableOfTodo");
let saveBtn = document.getElementById("saveBtn");
let output = document.getElementById("titleInput");
let addBtn = document.getElementById("addBtn");
let radioCheck = document.getElementById("Completed");
let checkRadio = document.getElementById("check");
let errorMsg = document.getElementById("errorMsg");
let searchBar = document.getElementById("searchBar");
let searchBtn = document.getElementById("searchBtn");
let allData;
let addedTable = [];
let addedObj = {};
let id = 200;

let idCheck = document.getElementById("idInput");
fetch("https://jsonplaceholder.typicode.com/todos")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    allData = data;
    data.forEach((person) => {
      createTable(person, data);
    });
  });
// fuctions for the JSON
// Create Table

function createTable(person, data) {
  let tableRow = document.createElement("tr");
  tableRow.setAttribute("id", person.id);
  let userId = document.createElement("td");
  userId.textContent = person.userId;
  let taskId = document.createElement("td");
  taskId.textContent = person.id;
  let title = document.createElement("td");
  title.textContent = person.title;
  let status = document.createElement("td");
  let editBtn = document.createElement("td");
  // edit Function
  editData(data, person, editBtn, tableRow);
  let deleteBtn = document.createElement("td");
  // deleteBtn
  deleteData(data, person, deleteBtn, tableRow);
  // check if completed or not
  checkIfcompleted(person, status);
  // saveButton(person);

  tableRow.append(taskId, userId, title, status, editBtn, deleteBtn);
  MainTable.append(tableRow);
}
// delete function
function deleteData(data, person, deleteBtn, tableRow) {
  deleteBtn.addEventListener("click", async function deleteObjectById() {
    try {
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${person.id}`,

        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to delete object with ID ${person.id}`);
      } else {
        data = data.filter((element) => {
          element.id !== person.id;
        });
        MainTable.removeChild(tableRow);
        console.log(`Object with ID ${person.id} deleted successfully.`);
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  });
  deleteBtn.innerHTML = trashMark;
}
// Edit function
function editData(data, person, editBtn) {
  editBtn.addEventListener("click", () => {
    data.filter((element) => {
      if (element.id !== person.id) {
        idCheck.value = person.id;
        output.value = person.title;
        saveBtn.style.display = "block";
      }

      if (!person.completed) {
        checkRadio.style.display = "block";
        radioCheck.checked = false;
      } else {
        checkRadio.style.display = "block";
        radioCheck.checked = true;
      }
    });
    output.value;
  });
  editBtn.innerHTML = editMark;
}
// To check if completed or not
function checkIfcompleted(person, status) {
  if (person.completed) {
    status.innerHTML = completedMark;
  } else {
    status.innerHTML = unCompletedMark;
  }
}
// saveBtn

saveBtn.addEventListener("click", () => {
  let personRow = document.getElementById(idCheck.value);

  allData.forEach((person) => {
    if (radioCheck.checked == true) {
      person.completed = true;
      personRow.children[3].innerHTML = completedMark;
    }
    if (person.id == idCheck.value) {
      fetch(`https://jsonplaceholder.typicode.com/posts/${idCheck.value}`, {
        method: "PUT",
        body: JSON.stringify({
          userId: `${person.userId}`,
          id: `${person.id}`,
          title: output.value,
          completed: `${person.completed}`,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => console.log(json));
      personRow.children[2].textContent = output.value;
      output.value = "";
      idCheck.value = "";
      saveBtn.style.display = "none";
      checkRadio.style.display = "none";
    }
  });
});
addBtn.addEventListener("click", () => {
  if (output.value.length !== 0) {
    id += 1;
    let completed = false;
    fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify({
        userId: `11`,
        id: `${id}`,
        title: output.value,
        completed: `${completed}`,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => console.log(json));

    errorMsg.textContent = "";
    output.textContent = "";
  } else {
    errorMsg.textContent = "Empty Task Name";
  }
});
searchBtn.addEventListener("click", () => {
  let searchValue = searchBar.value.trim();
  allData.forEach((person) => {
    let tableRow = document.getElementById(person.id);
    if (searchValue === person.title) {
      tableRow.style.display = "";
    } else {
      tableRow.style.display = "none";
    }
  });
});
logoutBtn.addEventListener("click", () => {
  localStorage.clear();
  window.location.href = "login.html";
});
////
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
