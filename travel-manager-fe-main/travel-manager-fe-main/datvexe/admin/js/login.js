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
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);

      // Gửi yêu cầu API đăng nhập bằng fetch
      fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",

        body: formData,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Đăng nhập thất bại");
          }
          return response.json();
        })
        .then((data) => {
          // Xử lý phản hồi từ server
          if (data.status === true) {
            if (data.message === "Admin Logged In Successfully") {
              alert("Đăng nhập thành công");
              sessionStorage.setItem("email", email);
              sessionStorage.setItem("token", data.token);
              window.location.href = "QLKH.html";
            } else {
              alert("Tài khoản không phải Admin");
            }
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gửi yêu cầu đăng nhập:", error);
          alert("Đã xảy ra lỗi khi đăng nhập, vui lòng thử lại sau.");
        });
    });
});
