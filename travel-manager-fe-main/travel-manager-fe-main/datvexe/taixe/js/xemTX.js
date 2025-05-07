var userid;
document.addEventListener("DOMContentLoaded", function () {
  // Lấy ID từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("this_id");

  function fetchScheduleData() {
    const token = sessionStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/driver/schedules/by-date", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const tbody = document.querySelector("#scheduleTable tbody");
        tbody.innerHTML = ""; // Clear current table body content

        data.data.forEach((schedule, index) => {
          const row = `
                    <tr style="text-align:center;">
                        <td>${index + 1}</td>
                        <td>${schedule.departure_time}</td>
                        <td>${schedule.arrival_time}</td>
                        <td>${schedule.name}</td>
                        <td>${schedule.license_plates}</td>
                        <td>${schedule.departure_location}</td>
                        <td>${schedule.arrival_location}</td>
                        
                        
                    </tr>`;
          tbody.innerHTML += row;
        });
      })
      .catch((error) => console.error("Fetch Error:", error));
  }
  fetchScheduleData();

  // Utility function to get the day of the week from a date string
  function getDayOfWeek(dateString) {
    const date = new Date(dateString);
    const dayOfWeek = date.toLocaleDateString("vi-VN", { weekday: "long" });
    return dayOfWeek;
  }

  // Utility function to format a date string
  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
    return formattedDate;
  }

  // Function to navigate to update page

  // Lấy token từ session (hoặc cookie)
  const token = sessionStorage.getItem("token"); // Hoặc cookie nếu bạn sử dụng cookie

  // Gửi yêu cầu API
  fetch(`http://127.0.0.1:8000/api/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật dữ liệu vào trang

      document.getElementById("name").textContent = data.full_name;
      document.getElementById("dob").textContent = data.date_of_birth;

      document.getElementById("email").textContent = data.email;
      document.getElementById("phone").textContent = data.phone_number;
      document.getElementById("address").textContent = data.address;
      userid = data.id;
    })
    .catch((error) => console.error("Error fetching data:", error));

  fetch(`http://127.0.0.1:8000/api/schedule/reserved-schedule?user_id=${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"), // Lấy token từ session và thêm vào header Authorization
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Lấy bảng trong HTML để điền dữ liệu
      var tableBody = document.querySelector("table tbody");

      // Điền dữ liệu từ API vào bảng
      data.data.forEach((item, index) => {
        var row = `
              <tr style="text-align:center;">
                  <td>${index + 1}</td>
                  <td>${item.reservation_id}</td>
                  <td>${item.booking_time}</td>
                  <td>${item.schedule.departure_location} - ${
          item.schedule.arrival_location
        }</td>
                  <td>${item.seats.map((seat) => seat.name).join(", ")}</td>
                  <td>${item.is_accepted ? "Đã xác nhận" : "Chưa xác nhận"}</td>
                  <td><a href="xemPD.html?this_id=${
                    item.reservation_id
                  }" style="color: blue; text-decoration: none; cursor:pointer;"></a></td>
              </tr>`;
        tableBody.innerHTML += row;
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});
function navigateToUpdatePage() {
  window.location.href = `capnhatTX.html?this_id=${userid}`;
}
