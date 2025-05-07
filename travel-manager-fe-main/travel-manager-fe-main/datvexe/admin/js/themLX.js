document.addEventListener("DOMContentLoaded", function () {
  const addCarTypeForm = document.getElementById("addCarTypeForm");

  addCarTypeForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const token = sessionStorage.getItem("token"); // Replace with your actual token
    const typeName = document.getElementById("ten").value;
    const number = document.getElementById("sl").value;

    const formData = {
      type_name: typeName,
      number: parseInt(number), // Assuming number should be sent as integer
    };

    fetch("http://127.0.0.1:8000/api/admin/car-types/insert-new", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        alert("Thêm loại xe thành công");
        window.location.href = "QLLX.html";
        // Optionally redirect or update UI as needed
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Đã xảy ra lỗi khi thêm loại xe");
      });
  });
});
