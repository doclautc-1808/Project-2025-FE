document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token"); // Replace with your actual token

  // Fetch user data
  fetch("http://127.0.0.1:8000/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.querySelector('input[name="name"]').value = data.full_name;
      document.querySelector('input[name="ngaysinh"]').value =
        data.date_of_birth;
      document.querySelector('input[name="sdt"]').value = data.phone_number;
      document.querySelector('input[name="diachi"]').value = data.address;

      // Display user avatar if available
      if (data.avatar) {
        document.getElementById("user-img").src = data.avatar;
      }
    })
    .catch((error) => console.error("Error:", error));

  // Handle image file input change
  const imgInput = document.querySelector('input[name="img"]');
  imgInput.addEventListener("change", function () {
    const file = imgInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
      // Set preview image
      document.getElementById("user-img").src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });

  // Handle form submission
  document
    .getElementById("profileForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData();
      formData.append(
        "full_name",
        document.querySelector('input[name="name"]').value
      );
      formData.append(
        "date_of_birth",
        document.querySelector('input[name="ngaysinh"]').value
      );
      formData.append(
        "phone_number",
        document.querySelector('input[name="sdt"]').value
      );
      formData.append(
        "address",
        document.querySelector('input[name="diachi"]').value
      );

      // Add avatar if a new image is selected and convert to base64
      const imgFile = imgInput.files[0];
      if (imgFile) {
        const reader = new FileReader();
        reader.readAsDataURL(imgFile);
        reader.onloadend = function () {
          const base64Image = reader.result; // Remove data URL header
          formData.append("avatar", base64Image);

          // Send form data with base64 avatar to server
          fetch("http://127.0.0.1:8000/api/user/update-profile", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Success:", data);
              alert("Cập nhật thành công");
              window.location.href = "taikhoan.html";
            })
            .catch((error) => console.error("Error:", error));
        };
      } else {
        // No new image selected, send form data without avatar_base64
        fetch("http://127.0.0.1:8000/api/user/update-profile", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            alert("Cập nhật thành công");
            window.location.href = "taikhoan.html";
          })
          .catch((error) => console.error("Error:", error));
      }
    });
});
