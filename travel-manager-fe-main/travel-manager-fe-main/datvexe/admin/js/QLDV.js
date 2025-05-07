document.addEventListener("DOMContentLoaded", function () {
  const endpoint = "http://127.0.0.1:8000/api/schedule/get-all-reservation";

  // Replace 'your-token' with the method to retrieve your actual token from session storage
  const token = sessionStorage.getItem("token");

  fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      const reservations = data.data;
      const tbody = document.getElementById("reservation-table");
      tbody.innerHTML = ""; // Clear any existing rows

      reservations.forEach((reservation, index) => {
        const tr = document.createElement("tr");
        tr.classList.add("text-gray-700", "dark:text-gray-400");

        tr.innerHTML = `
              <td class="px-4 py-3">${index + 1}</td>
              
              <td class="px-4 py-3 text-xs">
                  <span class="px-2 py-1 font-semibold leading-tight ${
                    reservation.is_accepted
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  } rounded-full dark:${
          reservation.is_accepted
            ? "bg-green-700 text-green-100"
            : "bg-red-700 text-red-100"
        }">
                      ${reservation.is_accepted ? "Accepted" : "Rejected"}
                  </span>
              </td>
              <td class="px-4 py-3 text-xs">
                  <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                      ${reservation.booking_time}
                  </span>
              </td>
              <td class="px-4 py-3 text-sm">${reservation.customer_name}</td>
              <td class="px-4 py-3 text-sm">
                  <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                      ${reservation.schedule.departure_location} to ${
          reservation.schedule.arrival_location
        }
                  </span>
              </td>
              <td class="px-4 py-3 text-sm">
                  ${reservation.seats.map((seat) => seat.name).join(", ")}
              </td>
              <td class="px-4 py-3 text-sm">
                  <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                      ${reservation.pickup_location}
                  </span>
              </td>
              <td class="px-4 py-3 text-sm">
                  <span class="px-2 py-1 font-semibold leading-tight text-green-700 bg-green-100 rounded-full dark:bg-green-700 dark:text-green-100">
                      ${reservation.total_amount}
                  </span>
              </td>
              <td class="px-4 py-3 text-center">
                  <div class="flex items-center space-x-4 text-sm">
                     
                    
                      
                     
                  </div>
              </td>
          `;
        tbody.appendChild(tr);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
});
