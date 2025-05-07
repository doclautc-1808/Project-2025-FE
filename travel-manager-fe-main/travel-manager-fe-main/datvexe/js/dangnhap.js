document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn chặn hành động mặc định của form

      // Lấy giá trị từ các input
      var email = document.querySelector('input[name="email"]').value;
      var password = document.querySelector('input[name="password"]').value;

      // Định nghĩa dữ liệu gửi đi
      var requestData = {
        email: email,
        password: password,
      };

      // Gửi yêu cầu API đăng nhập bằng fetch
      fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            alert("Đăng nhập thành công!");
            sessionStorage.setItem("email", email);
            sessionStorage.setItem("token", data.token);
            window.location.href = "index.html";
          } else {
            const errorData = await response.json();
            alert(errorData.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
          alert("Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại sau.");
        });
    });
});

document
  .getElementById("loginWithGoogle")
  .addEventListener("click", function () {
    window.location.href = "http://localhost:8000/api/auth/google";
  });
