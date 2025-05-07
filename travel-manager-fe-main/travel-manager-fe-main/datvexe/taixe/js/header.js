var userEmail = sessionStorage.getItem("email");

// Kiểm tra xem userEmail có giá trị không và điền vào phần tử HTML
if (userEmail) {
  document.getElementById("userEmail").textContent = userEmail;
}

function logout() {
  sessionStorage.removeItem("email");
  sessionStorage.removeItem("token");
  window.location.href = "login.html";
}
