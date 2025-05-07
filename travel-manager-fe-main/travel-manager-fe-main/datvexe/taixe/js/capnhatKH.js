// Hàm để lấy token từ session
function getTokenFromSession() {
  return sessionStorage.getItem("token"); // Giả sử token được lưu trong sessionStorage
}

// Hàm để lấy ID từ URL
function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("this_id");
}

// Hàm để cập nhật thông tin khách hàng
function updateCustomerInfo() {
  const token = getTokenFromSession();
  const userId = getUserIdFromUrl();
  const url = `http://127.0.0.1:8000/api/admin/users/${userId}`;

  const avatarInput = document.getElementById("imageInput");
  const file = avatarInput.files[0];
  const imgPreview = document.getElementById("imgPreview");

  let base64Image = imgPreview.src; // Use existing avatar image as default

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      base64Image = reader.result;

      const data = {
        full_name: document.getElementById("KH_Ten").value,
        phone_number: document.getElementById("KH_sdt").value,
        address: document.getElementById("KH_Diachi").value,
        date_of_birth: document.getElementById("KH_Ngaysinh").value,
        avatar: base64Image, // Include the base64 image
      };

      fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok " + response.statusText
            );
          }
          return response.json();
        })
        .then((data) => {
          if (data.status === true) {
            alert("Cập nhật thành công");
            window.location.href = "QLKH.html";
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("Cập nhật thất bại", error);
        });
    };
    reader.readAsDataURL(file);
  } else {
    // No new image is selected, use the existing image
    const data = {
      full_name: document.getElementById("KH_Ten").value,
      phone_number: document.getElementById("KH_sdt").value,
      address: document.getElementById("KH_Diachi").value,
      date_of_birth: document.getElementById("KH_Ngaysinh").value,
      avatar: base64Image, // Include the existing avatar image
    };

    fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        if (data.status === true) {
          alert("Cập nhật thành công");
          window.location.href = "QLKH.html";
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Cập nhật thất bại", error);
      });
  }
}

// Gọi hàm để điền thông tin khách hàng khi trang được tải
document.addEventListener("DOMContentLoaded", () => {
  const userId = getUserIdFromUrl();
  const token = getTokenFromSession();
  const url = `http://127.0.0.1:8000/api/user/${userId}`;

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("KH_Ten").value = data.user.full_name || "";
      document.getElementById("KH_Ngaysinh").value =
        data.user.date_of_birth || "";
      document.getElementById("KH_sdt").value = data.user.phone_number || "";
      document.getElementById("KH_email").value = data.user.email || "";
      document.getElementById("KH_Diachi").value = data.user.address || "";

      const imgPreview = document.getElementById("imgPreview");
      imgPreview.src = data.user.avatar || ""; // Set default avatar image
      imgPreview.style.display = data.user.avatar ? "block" : "none";
    })
    .catch((error) => console.error("Error fetching user data:", error));
});

// Xử lý hình ảnh khi được chọn
document.getElementById("imageInput").addEventListener("change", function () {
  const file = this.files[0];
  const imgPreview = document.getElementById("imgPreview");

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      imgPreview.src = reader.result;
      imgPreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    imgPreview.src = "";
    imgPreview.style.display = "none";
  }
});
