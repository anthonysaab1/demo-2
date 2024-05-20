let loginBtn = document.getElementById("loginBtn");
let userName = document.getElementById("username");
let showPass = document.getElementById("showPass");
let passWord = document.getElementById("password");
let modal = document.getElementById("myModal");

let span = document.getElementsByClassName("close")[0];
let allData;
let verification = false;
fetch("https://jsonplaceholder.typicode.com/users")
  .then((response) => response.json())
  .then((data) => {
    allData = data;
    console.log(data);
  });
loginBtn.addEventListener("click", function (event) {
  allData.forEach((person) => {
    if (person.username === userName.value && person.name === passWord.value) {
      localStorage.setItem("lastname", userName.value);

      window.location.href = "welcome.html";
      passWord.value = "";
      userName.value = "";
      verification = true;
      event.preventDefault();
      window.location.href =
        "welcome.html?userId=" + encodeURIComponent(person.id);
    }
    if (userName.value == "admin" && passWord.value == "admin") {
      localStorage.setItem("lastname", userName.value);

      window.location.href = "index.html";
      passWord.value = "";
      userName.value = "";
      verification = true;
    }
    if (!verification) {
      modal.style.display = "block";
      span.onclick = function () {
        modal.style.display = "none";
      };

      window.onclick = function (event) {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    }
  });
});
showPass.addEventListener("click", () => {
  if (passWord.type == "password") {
    passWord.type = "text";
  } else {
    passWord.type = "password";
  }
});
