document.addEventListener("DOMContentLoaded", () => {
  const token = sessionStorage.getItem("token"); // Replace with code to get token from session
  const apiUrl = "http://127.0.0.1:8000/api/driver/reservations-for-driver";
  const reservationTable = document.getElementById("reservation-table");
  const dateInput = document.getElementById("reservation-date");

  function fetchReservations(date) {
    const url = date
      ? `${apiUrl}?date=${date}`
      : apiUrl + `?date=${new Date().toISOString().split("T")[0]}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          populateTable(data.data);
        } else {
          console.error("Failed to fetch reservations");
        }
      })
      .catch((error) => console.error("Error:", error));
  }

  function populateTable(reservations) {
    reservationTable.innerHTML = reservations
      .map(
        (res, index) => `
      <tr>
 
        <td class="px-4 py-3">${res.id}</td>
       
        <td class="px-4 py-3">${res.booking_time}</td>
        <td class="px-4 py-3">${res.customer_name}</td>
        <td class="px-4 py-3">${res.phone_number}</td>
        <td class="px-4 py-3">${res.pickup_location}</td>
        <td class="px-4 py-3">${res.departure_location} - ${
          res.arrival_location
        }</td>
        <td class="px-4 py-3">${res.departure_time} - ${res.arrival_time}</td>
        <td class="px-4 py-3">${res.seats.join(", ")}</td>
      
        <td class="px-4 py-3">${res.total_amount}</td>
      </tr>
    `
      )
      .join("");
  }

  dateInput.addEventListener("change", () => {
    fetchReservations(dateInput.value);
  });

  // Fetch reservations for today's date on load
  fetchReservations();
});
