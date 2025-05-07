document.addEventListener("DOMContentLoaded", async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const scheduleId = urlParams.get("scheduleid");
  const carId = urlParams.get("carid");

  // Fetch schedule details and populate the form
  const response = await fetch(
    `http://127.0.0.1:8000/api/schedules/detail/${scheduleId}`,
    {
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    }
  );

  if (response.ok) {
    const data = await response.json();
    if (data.status && data.schedule) {
      const schedule = data.schedule;
      document.querySelector('[name="C_ThoiGianXP"]').value =
        schedule.departure_time.slice(0, 5);
      document.querySelector('[name="C_ThoiGianDen"]').value =
        schedule.arrival_time.slice(0, 5);
      document.querySelector('[name="C_DonGia"]').value = schedule.price;
      document.querySelector('[name="BXKH_Ma"]').value =
        schedule.departure_location;
      document.querySelector('[name="BXD_Ma"]').value =
        schedule.arrival_location;
      document.getElementById("existingImage").src = schedule.image; // Set the existing image
    } else {
      alert("Failed to load schedule details");
    }
  } else {
    alert("Failed to fetch schedule details");
  }

  // Handle form submission for updating the schedule
  document
    .getElementById("updateScheduleForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const form = event.target;

      const departureTime = form.C_ThoiGianXP.value;
      const arrivalTime = form.C_ThoiGianDen.value;
      const departureLocation = form.BXKH_Ma.value;
      const arrivalLocation = form.BXD_Ma.value;
      const price = form.C_DonGia.value;

      let imageBase64 = "";
      if (form.img.files.length > 0) {
        const file = form.img.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          imageBase64 = reader.result;
          submitData();
        };
        reader.onerror = function (error) {
          console.log("Error: ", error);
        };
      } else {
        submitData();
      }

      async function submitData() {
        const data = {
          departure_location: departureLocation,
          arrival_location: arrivalLocation,
          departure_time: departureTime,
          arrival_time: arrivalTime,
          price: parseFloat(price),
          image: imageBase64 || document.getElementById("existingImage").src,
        };

        const response = await fetch(
          `http://127.0.0.1:8000/api/admin/cars/${carId}/schedules/${scheduleId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          alert("Cập nhật chuyến thành công!");
          form.reset();
          window.location.href = `QLChuyen.html?this_id=${carId}`;
        } else {
          const errorData = await response.json();
          alert(
            "Cập nhật chuyến thất bại vui lòng kiểm tra thời gian xuất phát nhỏ hơn thời gian đến hoặc điền đầy đủ thông tin các trường"
          );
        }
      }
    });
});
