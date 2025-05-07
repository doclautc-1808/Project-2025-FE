document.addEventListener("DOMContentLoaded", function () {
  // Thêm sự kiện khi chọn file
  document
    .getElementById("imageInput")
    .addEventListener("change", function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          const imgPreview = document.getElementById("imgPreview");
          imgPreview.src = e.target.result;
          imgPreview.style.display = "block"; // Hiển thị ảnh xem trước
        };
        reader.readAsDataURL(file);
      } else {
        const imgPreview = document.getElementById("imgPreview");
        imgPreview.src = "";
        imgPreview.style.display = "none"; // Ẩn ảnh xem trước nếu không có file
      }
    });

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
      var address = document.querySelector('input[name="address"]').value;
      var repass = document.querySelector('input[name="repass"]').value;
      var imageInput = document.querySelector('input[name="image"]');
      var file = imageInput.files[0];

      // Kiểm tra xem password và repass có khớp nhau không
      if (password !== repass) {
        alert("Mật khẩu và Nhập lại mật khẩu không khớp.");
        return; // Dừng lại nếu không khớp
      }

      // Chuyển đổi ảnh thành Base64 nếu có
      let base64Image = "";
      if (file) {
        const reader = new FileReader();
        reader.onloadend = function () {
          base64Image = reader.result;

          // Định nghĩa dữ liệu gửi đi
          const requestData = {
            full_name: fullName,
            phone_number: phoneNumber,
            email: email,
            password: password,
            address: address,
            avatar: base64Image,
          };

          // Gửi yêu cầu API đăng ký bằng fetch
          fetch("http://127.0.0.1:8000/api/admin/drivers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${sessionStorage.getItem("token")}`,
            },
            body: JSON.stringify(requestData),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Đăng ký không thành công");
              }
              return response.json();
            })
            .then((data) => {
              if (data.status === true) {
                alert("Đăng ký thành công!");
                window.location.href = "QLTX.html";
              } else {
                alert(data.message);
              }
            })
            .catch((error) => {
              console.error("Lỗi khi gửi yêu cầu đăng ký:", error);
              alert("Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau.");
            });
        };
        reader.readAsDataURL(file);
      } else {
        // Nếu không có ảnh, gửi dữ liệu mà không có trường image
        const requestData = {
          full_name: fullName,
          phone_number: phoneNumber,
          email: email,
          password: password,
          address: address,
        };

        fetch("http://127.0.0.1:8000/api/admin/drivers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Đăng ký không thành công");
            }
            return response.json();
          })
          .then((data) => {
            if (data.status === true) {
              alert("Đăng ký thành công!");
              window.location.href = "QLTX.html";
            } else {
              alert(data.message);
            }
          })
          .catch((error) => {
            console.error("Lỗi khi gửi yêu cầu đăng ký:", error);
            alert("Đã xảy ra lỗi khi đăng ký, vui lòng thử lại sau.");
          });
      }
    });
});
