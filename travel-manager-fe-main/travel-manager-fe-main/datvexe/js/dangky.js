document.addEventListener("DOMContentLoaded", function () {
  // Bắt sự kiện submit của form
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      event.preventDefault(); // Ngăn chặn hành động mặc định của form

      // Lấy giá trị từ các input
      var fullName = document.querySelector('input[name="full_name"]').value;
      var phoneNumber = document.querySelector(
        'input[name="phone_number"]'
      ).value;
      var email = document.querySelector('input[name="email"]').value;
      var password = document.querySelector('input[name="password"]').value;
      var repass = document.querySelector('input[name="repass"]').value;

      // Kiểm tra xem password và repass có khớp nhau không
      if (password !== repass) {
        alert("Mật khẩu và Nhập lại mật khẩu không khớp.");
        return; // Dừng lại nếu không khớp
      }

      // Định nghĩa dữ liệu gửi đi
      var requestData = {
        full_name: fullName,
        phone_number: phoneNumber,
        email: email,
        password: password,
        avatar: "/img/Xe/1.jpg",
      };

      fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      })
        .then(async (response) => {
          // Kiểm tra trạng thái HTTP của phản hồi
          if (response.ok) {
            // Phản hồi thành công, đọc dữ liệu JSON từ phản hồi
            const responseData = await response.json();
            alert("Đăng ký thành công!");
            window.location.href = "dangnhap.html";
            // Ví dụ: chuyển hướng người dùng tới trang đăng nhập
          } else {
            // Phản hồi thất bại, đọc dữ liệu lỗi từ phản hồi
            const errorData = await response.json();
            alert(errorData.errors.email);
          }
        })
        .catch((error) => {
          // Xử lý lỗi kết nối hoặc các lỗi khác
          console.error("Lỗi:", error);
          alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        });
    });
});
