// Hàm để lấy token từ session
function getTokenFromSession() {
  return sessionStorage.getItem("token"); // Giả sử token được lưu trong sessionStorage
}
document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    fetchUserData(); // Call the function to fetch user data
  });
// Hàm để gọi API và hiển thị dữ liệu
function fetchUserData() {
  const token = getTokenFromSession();
  const inputField = document.querySelector('input[name="noidung"]');
  const noidungValue = inputField ? inputField.value : "";
  const url = `http://127.0.0.1:8000/api/admin/users?noidung=${encodeURIComponent(
    noidungValue
  )}`;
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayData(data);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

// Hàm để chuyển đổi định dạng ngày tháng
function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Hàm để hiển thị dữ liệu lên bảng
function displayData(users) {
  const tbody = document.querySelector("tbody");
  tbody.innerHTML = ""; // Xóa nội dung hiện tại của tbody

  users.forEach((user) => {
    const row = document.createElement("tr");
    row.classList.add("text-gray-700", "dark:text-gray-400");
    id = user.id;
    row.innerHTML = `
        <td class="px-4 py-3">
          <div class="flex items-center text-sm">
            <div>
              <p class="font-semibold">${user.id}</p>
            </div>
          </div>
        </td>
        <td class="px-4 py-3 text-sm">
          <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
            ${user.role}
          </span>
        </td>
        <td class="px-4 py-3 text-sm">${formatDate(user.created_at)}</td>
        <td class="px-4 py-3 text-sm">${user.full_name}</td>
        <td class="px-4 py-3 text-sm">${user.email}</td>
        <td class="px-4 py-3 text-sm">${user.phone_number}</td>
        <td class="px-4 py-3 text-xs">${formatDate(user.date_of_birth)}</td>
        <td class="px-4 py-3 text-sm">${user.address}</td>
       <td class="px-4 py-3 text-sm">
                      <div class="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                        <img class="object-cover w-full h-full rounded-full" src="${
                          user.avatar ? user.avatar : "/img/Xe/1.jpg"
                        }" loading="lazy" />
                        <div class="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                      </div>
                    </td>
        <td class="px-4 py-3">
          <div class="flex items-center space-x-4 text-sm">
            <button onclick="navigateToDetail(${
              user.id
            })" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray">
              <i class="fa fa-eye"></i> Xem
            </button>
            <button onclick="navigateToUpdatePage(${
              user.id
            })" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray">
              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg> Sửa
            </button>
            <button id="deleteButton" onclick="openDialog(${
              user.id
            })" style="color: red;" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray">
              <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
              </svg> Xóa
            </button>
          </div>
        </td>
      `;

    tbody.appendChild(row);
  });
}

// Hàm để chuyển hướng tới trang cập nhật và lưu thông tin ID
function navigateToUpdatePage(userId) {
  window.location.href = `capnhatKH.html?this_id=${userId}`;
}
function navigateToDetail(userId) {
  window.location.href = `xemKH.html?this_id=${userId}`;
}

function deleteUser() {
  const token = getTokenFromSession();
  const url = `http://127.0.0.1:8000/api/admin/users/${id}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(() => {
      alert("Xóa thành công");
      closeDialog();
      fetchUserData(); // Cập nhật lại danh sách người dùng
    })
    .catch((error) => {
      console.error("Xóa thất bại", error);
    });
}

function openDialog(userid) {
  id = userid;
  const myDiv = document.getElementById("dialog");
  myDiv.classList.add("open_dialog");
}

function closeDialog() {
  const myDiv = document.getElementById("dialog");
  myDiv.classList.remove("open_dialog");
}
// Hàm để gọi API và hiển thị dữ liệu
document.addEventListener("DOMContentLoaded", fetchUserData);
