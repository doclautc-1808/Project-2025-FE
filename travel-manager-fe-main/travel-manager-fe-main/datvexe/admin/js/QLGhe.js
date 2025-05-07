document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("this_id");

  if (!carId) {
    console.error("Car ID not found in URL");
    return;
  }

  const token = sessionStorage.getItem("token"); // Assume token is stored in sessionStorage

  function fetchSeat() {
    fetch(`http://127.0.0.1:8000/api/admin/cars/${carId}/seats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          const seatData = document.getElementById("seat-data");
          seatData.innerHTML = ""; // Clear existing data

          data.seats.forEach((seat, index) => {
            const row = document.createElement("tr");
            row.classList.add("text-gray-700", "dark:text-gray-400");

            row.innerHTML = `
                    <td class="px-4 py-3 text-sm">${index + 1}</td>
                    <td class="px-4 py-3 text-sm">${seat.pivot.car_id}</td>
                    <td class="px-4 py-3 text-sm">${seat.name}</td>
                    <td class="px-4 py-3">
                        <div class="flex items-center space-x-4 text-sm">
                            <a onclick="openDialog(${
                              seat.id
                            })" style="color: red;" class="flex items-center justify-between px-2 py-2 text-sm font-medium leading-5 text-purple-600 rounded-lg dark:text-gray-400 focus:outline-none focus:shadow-outline-gray" aria-label="Xóa">
                                  <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                                  </svg>
                              </a>
                        </div>
                    </td>
                `;

            seatData.appendChild(row);
          });
        } else {
          console.error("Failed to fetch seat data");
        }
      })
      .catch((error) => console.error("Error:", error));
  }
  fetchSeat();

  var id;
  window.openDialog = function (seatid) {
    id = seatid;
    const myDiv = document.getElementById("dialog");
    myDiv.classList.add("open_dialog");
  };

  window.closeDialog = function () {
    const myDiv = document.getElementById("dialog");
    myDiv.classList.remove("open_dialog");
  };

  window.deleteSeat = function () {
    const url = `http://127.0.0.1:8000/api/admin/cars/${carId}/seats/${id}`;

    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("token")}`,
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
        fetchSeat();
      })
      .catch((error) => {
        console.error("Xóa thất bại", error);
      });
  };

  window.nextAdd = function () {
    window.location.href = `themghe.html?this_id=${carId}`;
  };
});
