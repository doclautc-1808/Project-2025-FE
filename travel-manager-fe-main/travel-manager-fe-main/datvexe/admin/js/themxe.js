document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token");

  // Fetch driver data
  fetch("http://127.0.0.1:8000/api/admin/drivers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const selectDriverElement = document.querySelector(
        'select[name="id_user"]'
      );
      data.forEach((driver) => {
        const option = document.createElement("option");
        option.value = driver.id;
        option.textContent = driver.full_name;
        selectDriverElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching drivers:", error);
    });

  // Fetch car type data
  fetch("http://127.0.0.1:8000/api/admin/cartypes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const selectTypeElement = document.querySelector(
        'select[name="type_name"]'
      );
      data.types.forEach((type) => {
        const option = document.createElement("option");
        option.value = type.id;
        option.textContent = type.type_name;
        selectTypeElement.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching car types:", error);
    });
});

function addCar() {
  const typeName = document.querySelector('select[name="type_name"]').value;
  const licensePlates = document.querySelector(
    'input[name="license_plates"]'
  ).value;
  const name = document.querySelector('input[name="name"]').value;
  const idUser = document.querySelector('select[name="id_user"]').value;

  const imageInput = document.querySelector('input[name="image"]');
  const file = imageInput.files[0];

  let base64Image = "";

  if (file) {
    const reader = new FileReader();
    reader.onloadend = function () {
      base64Image = reader.result;

      const data = {
        type_name: typeName,
        license_plates: licensePlates,
        name: name,
        driver_id: idUser,
        car_type_id: typeName, // Assuming the value from the select is the car type ID
        image: base64Image,
        price: 100000,
      };

      const token = sessionStorage.getItem("token");

      fetch("http://127.0.0.1:8000/api/admin/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status) {
            alert("Thêm xe thành công");
            window.location.href = "QLXe.html";
          } else {
            alert(data.message);
          }
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
          alert("Thêm xe thất bại");
        });
    };
    reader.readAsDataURL(file);
  } else {
    alert("Chọn ảnh cho xe");
  }
}
