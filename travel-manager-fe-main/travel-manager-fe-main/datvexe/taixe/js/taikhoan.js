function updateUserProfile(userData) {
  document.getElementById("user_name").textContent = userData.full_name;
  document.getElementById("user_avatar").src = userData.avatar
    ? userData.avatar
    : "img/Xe/ghe/xe-35-cho-nha-trang-1.jpg";
  document.getElementById("user_dob").textContent = userData.date_of_birth
    ? userData.date_of_birth
    : "Chưa cập nhật";
  document.getElementById("user_gender").textContent = userData.gender
    ? userData.gender
    : "Chưa cập nhật";
  document.getElementById("user_phone").textContent = userData.phone_number
    ? userData.phone_number
    : "Chưa cập nhật";
  document.getElementById("user_email").textContent = userData.email;
  document.getElementById("user_address").textContent = userData.address;

  document.getElementById(
    "edit_profile"
  ).href = `capnhatTX.html?this_id=${userData.id}`;
}

function fetchUserProfile() {
  var token = sessionStorage.getItem("token");
  if (!token) {
    console.error("No token found in session storage");
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

fetchUserProfile();
