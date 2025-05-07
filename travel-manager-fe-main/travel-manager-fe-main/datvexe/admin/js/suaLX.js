document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carTypeId = urlParams.get("this_id");
  const token = sessionStorage.getItem("token"); // Replace with your actual token

  // Fetch car type data to pre-fill the form
  fetch(`http://127.0.0.1:8000/api/admin/car-types/get-cartype/${carTypeId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("ten").value = data.type_name;
      document.getElementById("sl").value = data.number;
      document.getElementById("LX_Ma").value = data.id;
    })
    .catch((error) => console.error("Error:", error));

  // Handle form submission
  document
    .getElementById("updateCarTypeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const typeName = document.getElementById("ten").value;
      const number = document.getElementById("sl").value;
      const carTypeId = document.getElementById("LX_Ma").value;

      const formData = {
        id: parseInt(carTypeId),
        type_name: typeName,
        number: parseInt(number), // Assuming number should be sent as integer
      };

      fetch("http://127.0.0.1:8000/api/admin/car-types/update-cartype", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          alert("Cập nhật loại xe thành công");
          window.location.href = "QLLX.html";
          // Optionally redirect or update UI as needed
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("Đã xảy ra lỗi khi cập nhật loại xe!");
        });
    });
});
