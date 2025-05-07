document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the form from submitting the traditional way
    fetchCars(); // Call the function to fetch user data
  });

function fetchCars() {
  const inputField = document.querySelector('input[name="noidung"]');
  const noidungValue = inputField ? inputField.value : "";
  const apiUrl = `http://127.0.0.1:8000/api/admin/cars?noidung=${encodeURIComponent(
    noidungValue
  )}`;
  const token = sessionStorage.getItem("token");
  console.log(noidungValue);
  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const tableBody = document.querySelector("tbody");
      tableBody.innerHTML = ""; // Clear existing rows

      if (data.status) {
        const cars = data.cars;
        cars.forEach((car) => {
          const row = document.createElement("tr");
          row.classList.add("text-gray-700", "dark:text-gray-400");

          row.innerHTML = `
            <td class="px-4 py-3">${car.id}</td>
            <td class="px-4 py-3 text-sm">${car.license_plates}</td>
          
            
            <td class="px-4 py-3 text-xs">
                <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">${car.name}</span>
            </td>
            <td class="px-4 py-3 text-sm">
                            <div
                                class="relative hidden w-8 h-8 mr-3 rounded-full md:block"
                              >
                                <img
                                  class="object-cover w-full h-full rounded-full"
                                  src="${car.image}"
                                  loading="lazy"
                                />
                                <div
                                  class="absolute inset-0 rounded-full shadow-inner"
                                  aria-hidden="true"
                                ></div>
                            </div>
                          </td> 
           
            <td class="px-4 py-3">
                <div class="flex items-center space-x-4 text-sm">
                    <a class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" href="capnhatxe.html?this_id=${car.id}">
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
                        </svg>
                    </a>
                    <a style="color: red;" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" onclick="openDialog(${car.id})">
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                        </svg>
                    </a>
                    <a  class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" href="QLChuyen.html?this_id=${car.id}">
                        <span>Chuyến</span>
                    </a>
                    <a  class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" href="QLGhe.html?this_id=${car.id}">
                        <span>Ghế</span>
                    </a>
                </div>
            </td>

            
        `;

          tableBody.appendChild(row);
        });
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
}
document.addEventListener("DOMContentLoaded", function () {
  fetchCars(); // Fetch cars when page loads
});

function openDialog(carid) {
  id = carid;
  const myDiv = document.getElementById("dialog");
  myDiv.classList.add("open_dialog");
}

function closeDialog() {
  const myDiv = document.getElementById("dialog");
  myDiv.classList.remove("open_dialog");
}
function deleteCar() {
  const token = sessionStorage.getItem("token");
  const url = `http://127.0.0.1:8000/api/admin/cars/${id}`;

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
      fetchCars(); // Refresh the list of cars
    })
    .catch((error) => {
      console.error("Xóa thất bại");
    });
}

function toaddPage() {
  window.location.href = "themxe.html";
}
