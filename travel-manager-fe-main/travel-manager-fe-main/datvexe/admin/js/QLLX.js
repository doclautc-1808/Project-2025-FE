var id;

document.addEventListener("DOMContentLoaded", function () {
  const token = sessionStorage.getItem("token"); // Replace with your actual token

  // Call fetch function to load data initially
  fetCarType();
});

// Fetch car types data
function fetCarType() {
  const token = sessionStorage.getItem("token");
  fetch("http://127.0.0.1:8000/api/admin/car-types/get-alls", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const carTypes = data.data;
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = ""; // Clear the table body before adding new rows

      carTypes.forEach((carType) => {
        const tr = document.createElement("tr");
        tr.classList.add("text-gray-700", "dark:text-gray-400");

        tr.innerHTML = `
          <td class="px-4 py-3 text-sm">${carType.id}</td>
          <td class="px-4 py-3 text-sm">${carType.type_name}</td>
          <td class="px-4 py-3 text-sm">${carType.number}</td>
          <td class="px-4 py-3">
              <div class="flex items-center space-x-4 text-sm">
                  <a href="suaLX.html?this_id=${carType.id}"><button
                      class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                      type="submit"> <i class="fa-solid fa-pen"></i>
                  </button></a>
                  <button onclick="openDialog(${carType.id})"
                      class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray"
                      type="submit"> <i style="color: red;" class="fa-solid fa-trash-can"></i>
                  </button>
              </div>
          </td>
        `;

        tbody.appendChild(tr);
      });
    })
    .catch((error) => console.error("Error:", error));
}

function openDialog(typeid) {
  id = typeid;
  const myDiv = document.getElementById("dialog");
  myDiv.classList.add("open_dialog");
}

function closeDialog() {
  const myDiv = document.getElementById("dialog");
  myDiv.classList.remove("open_dialog");
}

function deleteCarType() {
  const token = sessionStorage.getItem("token");
  const url = `http://127.0.0.1:8000/api/admin/car-types/delete-cartype/${id}`;

  fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((errorData) => {
          throw new Error(errorData.message || "Network response was not ok");
        });
      }
      return response.json();
    })
    .then(() => {
      alert("Xóa thành công");
      closeDialog();
      fetCarType(); // Call fetch data again after deleting
    })
    .catch((error) => {
      alert("Loại xe đã được đăng kí cho xe" + error.message);
      closeDialog();
      console.error("There was a problem with the fetch operation:", error);
    });
}
