// Lấy giá trị 'user_email' từ cookie
var userEmail = sessionStorage.getItem("email");

// Kiểm tra xem userEmail có giá trị không và điền vào phần tử HTML
if (userEmail) {
  document.getElementById("userEmail").textContent = userEmail;
}

document
  .getElementById("logoutLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    // Chuyển hướng đến trang đăng nhập
    window.location.href = "dangnhap.html"; // Thay đổi thành URL của trang đăng nhập thực tế
  });
