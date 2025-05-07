document
  .getElementById("addScheduleForm")
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
        image: imageBase64,
      };
      const urlParams = new URLSearchParams(window.location.search);
      const carId = urlParams.get("this_id");

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/cars/${carId}/schedules`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("token"),
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        alert("Thêm chuyến thành công!");
        window.location.href = `QLChuyen.html?this_id=${carId}`;
      } else {
        const errorData = await response.json();
        alert(
          "Thêm chuyến thất bại vui lòng kiểm tra thời gian xuất phát nhỏ hơn thời gian đến hoặc điền đầy đủ thông tin các trường"
        );
      }
    }
  });
