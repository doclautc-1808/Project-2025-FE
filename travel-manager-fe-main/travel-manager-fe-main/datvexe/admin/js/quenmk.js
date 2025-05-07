document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("forgotPasswordForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const email = document.querySelector('input[name="email"]').value;

      fetch(`http://127.0.0.1:8000/api/forget-password?email=${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Không thể gửi yêu cầu đổi mật khẩu.");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === true) {
            console.log("Success:", data);
            alert(data.message);
            window.location.href = "login.html";
          } else {
            alert(data.message);
          }
          // Redirect to another page if needed
          // window.location.href = 'login.html';
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Đã có lỗi xảy ra. Vui lòng thử lại.");
        });
    });
});
