let carImg;

document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("this_id");
  const apiUrlGet = `http://127.0.0.1:8000/api/cars/${carId}`;
  const token = sessionStorage.getItem("token");

  // Lấy thông tin xe từ API
  fetch(apiUrlGet, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        const car = data.car;

        // Set ảnh mặc định
        const imageElement = document.querySelector('img[name="car_image"]');
        if (car.image) {
          imageElement.src = car.image;
          carImg = car.image;
        }

        // Gán dữ liệu vào form
        document.querySelector('input[name="license_plates"]').value = car.license_plates || "";
        document.querySelector('input[name="name"]').value = car.name || "";

        // Gọi API lấy tài xế
        fetch("http://127.0.0.1:8000/api/admin/drivers", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((driverData) => {
            const selectDriver = document.querySelector('select[name="id_user"]');
            driverData.forEach((driver) => {
              const option = document.createElement("option");
              option.value = driver.id;
              option.textContent = driver.full_name;
              if (driver.id === car.driver_id) option.selected = true;
              selectDriver.appendChild(option);
            });
          });

        // Gọi API lấy loại xe
        fetch("http://127.0.0.1:8000/api/admin/cartypes", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((typeData) => {
            const selectType = document.querySelector('select[name="type_name"]');
            typeData.types.forEach((type) => {
              const option = document.createElement("option");
              option.value = type.id;
              option.textContent = type.type_name;
              if (type.id === car.car_type_id) option.selected = true;
              selectType.appendChild(option);
            });
          });
      } else {
        console.error("Không thể lấy thông tin xe:", data.message);
      }
    })
    .catch((error) => console.error("Lỗi khi gọi API:", error));
});

// Hàm cập nhật thông tin xe
function updateCar() {
  const carId = new URLSearchParams(window.location.search).get("this_id");
  const typeName = document.querySelector('select[name="type_name"]').value;
  const licensePlates = document.querySelector('input[name="license_plates"]').value;
  const name = document.querySelector('input[name="name"]').value;
  const idUser = document.querySelector('select[name="id_user"]').value;

  const imageInput = document.querySelector('input[name="image"]');
  const file = imageInput.files[0];
  const token = sessionStorage.getItem("token");

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      const base64Image = reader.result;
      const data = {
        car_type_id: typeName,
        license_plates: licensePlates,
        name: name,
        driver_id: idUser,
        image: base64Image,
      };
      sendUpdateRequest(carId, data, token);
    };
    reader.readAsDataURL(file);
  } else {
    const data = {
      car_type_id: typeName,
      license_plates: licensePlates,
      name: name,
      driver_id: idUser,
      image: carImg, // Ảnh cũ nếu không chọn ảnh mới
    };
    sendUpdateRequest(carId, data, token);
  }
}

// Hàm gửi request cập nhật
function sendUpdateRequest(carId, data, token) {
  fetch(`http://127.0.0.1:8000/api/admin/cars/${carId}`, {
    method: "POST", // nếu server yêu cầu PUT thì đổi lại
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Lỗi mạng");
      return res.json();
    })
    .then((resData) => {
      if (resData.status) {
        alert("Cập nhật thành công");
        window.location.href = "QLXe.html";
      } else {
        alert(resData.message || "Cập nhật thất bại");
      }
    })
    .catch((err) => {
      console.error("Lỗi khi cập nhật:", err);
      alert("Có lỗi xảy ra khi cập nhật");
    });
}
