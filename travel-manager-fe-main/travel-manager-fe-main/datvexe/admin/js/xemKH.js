var userid;
document.addEventListener("DOMContentLoaded", function () {
  // Lấy ID từ URL
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("this_id");

  // Lấy token từ session (hoặc cookie)
  const token = sessionStorage.getItem("token"); // Hoặc cookie nếu bạn sử dụng cookie

  // Gửi yêu cầu API
  fetch(`http://127.0.0.1:8000/api/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      // Cập nhật dữ liệu vào trang

      document.getElementById("name").textContent = data.user.full_name;
      document.getElementById("dob").textContent = data.user.date_of_birth;

      document.getElementById("email").textContent = data.user.email;
      document.getElementById("phone").textContent = data.user.phone_number;
      document.getElementById("address").textContent = data.user.address;
      userid = data.user.id;
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
  window.location.href = `capnhatKH.html?this_id=${userid}`;
}
