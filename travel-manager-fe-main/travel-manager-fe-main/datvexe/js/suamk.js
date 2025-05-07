document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token"); // Replace with your actual token

  document
    .getElementById("changePasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const passold = document.querySelector('input[name="passold"]').value;
      const newpass = document.querySelector('input[name="newpass"]').value;
      const repass = document.querySelector('input[name="repass"]').value;

      // Validate if new passwords match
      if (newpass !== repass) {
        alert("Mật khẩu nhập lại không khớp.");
        return;
      }
      const formData = new FormData();
      formData.append("current_password", passold);
      formData.append("new_password", newpass);
      formData.append("new_password_confirmation", repass);

      fetch("http://127.0.0.1:8000/api/user/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === false) {
            alert("Mật khẩu hiện tại không chính xác");
          } else {
            alert("Đổi mật khẩu thành công!");
            // Redirect to another page if needed
            window.location.href = "taikhoan.html";
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        });
    });
});
