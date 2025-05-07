function updateUserProfile(userData) {
  document.getElementById("user_name").textContent = userData.full_name;
  document.querySelector(".user-img img").src = userData.avatar
    ? userData.avatar
    : "img/Xe/ghe/xe-35-cho-nha-trang-1.jpg";
  document.querySelector(".user-detail").innerHTML = `
      <ul class="list-unstyled">
          <li><span>Họ và tên:</span> ${userData.full_name}</li>
          
          <li><span>Ngày sinh:</span> ${
            userData.date_of_birth ? userData.date_of_birth : "Chưa cập nhật"
          }</li>
          <li><span>Email:</span> ${userData.email}</li>
          <li><span>Số điện thoại:</span> ${
            userData.phone_number ? userData.phone_number : "Chưa cập nhật"
          }</li>
          <li><span>Địa chỉ:</span> ${userData.address}</li>
      </ul>
      <a class="btn btn-orange btn-lg" href="capnhatTK.html">Chỉnh sửa</a>
      <a class="btn btn-orange btn-lg" href="suamk.html">Thay đổi mật khẩu</a>
  `;
}
// Function to call the API and update the profile
function fetchUserProfile() {
  var token = sessionStorage.getItem("token"); // Replace with your token cookie name
  if (!token) {
    console.error("No token found in cookies");
    return;
  }

  fetch("http://127.0.0.1:8000/api/user", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      updateUserProfile(data);
    })
    .catch((error) => console.error("Error fetching user data:", error));
}

// Call the function to fetch and update the user profile
fetchUserProfile();

console.log(username);
