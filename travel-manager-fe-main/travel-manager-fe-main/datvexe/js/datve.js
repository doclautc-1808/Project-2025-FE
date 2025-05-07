function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const query = {};
  for (const [key, value] of params.entries()) {
    query[key] = value;
  }
  return query;
}

var urlMomo;
const token = sessionStorage.getItem("token");
const queryParams = getQueryParams();
const scheduleId = queryParams.schedule_id;
const carId = queryParams.car_id;
let userId;
let price;

// Calculate next day's date
const currentDate = new Date();
currentDate.setDate(currentDate.getDate() + 1); // Add 1 day
const formattedNextDate = currentDate.toISOString().split("T")[0]; // Format yyyy-mm-dd
let date = formattedNextDate; // Next day's date

document.addEventListener("DOMContentLoaded", function () {
  // Fetch user details
  fetch("http://127.0.0.1:8000/api/user/details", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((userData) => {
      if (userData.status) {
        const user = userData.user;
        userId = user.id;

        // Pre-fill customer information
        document.getElementById("customerName").value = user.full_name || "";
        document.getElementById("phoneNumber").value = user.phone_number || "";
        document.getElementById("email").value = user.email || "";
      }
      fetchSchedule(date); // Fetch the schedule on load
    })
    .catch((error) => console.error("Error fetching user details:", error));

  // Handle booking form submission
  document
    .getElementById("bookingButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const formData = new FormData(document.getElementById("bookingForm"));
      const seatIds = Array.from(
        document.querySelectorAll('input[name="seat_ids[]"]:checked')
      ).map((input) => parseInt(input.value));

      const bookingData = {
        user_id: userId, // Use the fetched user ID
        schedule_id: scheduleId,
        seat_ids: seatIds,
        departure_date:
          document.querySelector('input[name="travelDate"]').value ||
          formattedNextDate,
        pickup_location: document.querySelector('input[name="pickupLocation"]')
          .value,
        customer_name: document.querySelector('input[name="customerName"]')
          .value,
        phone_number: document.querySelector('input[name="phoneNumber"]').value,
        email: document.querySelector('input[name="email"]').value,
        total_amount: price * seatIds.length,
        method: "CASH",
      };

      fetch("http://127.0.0.1:8000/api/schedule/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status) {
            alert("Đặt vé thành công");
            window.location.href = "lichsu.html";
          } else {
            alert(data.error);
          }
        })
        .catch((error) => {
          alert("Đặt vé thất bại");
          console.error("Error:", error);
        });
    });

  // Handle payment button click
  document
    .getElementById("paymentButton")
    .addEventListener("click", function (event) {
      event.preventDefault();
      const seatIds = Array.from(
        document.querySelectorAll('input[name="seat_ids[]"]:checked')
      ).map((input) => parseInt(input.value));

      const bookingData = {
        user_id: userId,
        schedule_id: scheduleId,
        seat_ids: seatIds,
        departure_date:
          document.querySelector('input[name="travelDate"]').value ||
          formattedNextDate,
        pickup_location: document.querySelector('input[name="pickupLocation"]')
          .value,
        customer_name: document.querySelector('input[name="customerName"]')
          .value,
        phone_number: document.querySelector('input[name="phoneNumber"]').value,
        email: document.querySelector('input[name="email"]').value,
        total_amount: price * seatIds.length,
      };

      const seatIdsString = bookingData.seat_ids.join(",");

      // Construct the URL with query parameters
      urlMomo = `http://127.0.0.1:8000/api/momo/payment?user_id=${
        bookingData.user_id
      }&schedule_id=${
        bookingData.schedule_id
      }&seat_ids=${seatIdsString}&departure_date=${
        bookingData.departure_date
      }&pickup_location=${encodeURIComponent(
        bookingData.pickup_location
      )}&customer_name=${encodeURIComponent(
        bookingData.customer_name
      )}&phone_number=${encodeURIComponent(
        bookingData.phone_number
      )}&email=${encodeURIComponent(bookingData.email)}&total_amount=${
        bookingData.total_amount
      }&email_user=${encodeURIComponent(
        sessionStorage.getItem("email")
      )}&token=${sessionStorage.getItem("token")}`;

      window.location.href = urlMomo;
    });

  // Event listener for date change
  document.getElementById("travelDate").addEventListener("change", function () {
    date = this.value;
    fetchSchedule(date); // Fetch the schedule with the new date
  });
});

function fetchSchedule(date) {
  fetch(
    `http://127.0.0.1:8000/api/schedule/seats?schedule_id=${scheduleId}&car_id=${carId}&departure_date=${date}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const schedule = data.schedule;
      const car = data.car;
      const seats = data.seats;

      // Set route and car details
      document.getElementById(
        "routeName"
      ).textContent = `${schedule.departure_location} - ${schedule.arrival_location}`;
      document.getElementById(
        "departureTime"
      ).textContent = `${schedule.departure_time}`;
      document.getElementById(
        "arrivalTime"
      ).textContent = `${schedule.arrival_time}`;
      document.getElementById("price").textContent = `${schedule.price} VND`;
      document.getElementById("carImage").src = `${car.image}`;
      price = schedule.price;

      // Populate seat selection
      const seatSelectionDiv = document.getElementById("seatSelection");
      seatSelectionDiv.innerHTML = ""; // Clear existing seats

      // Create a container for the seats
      const seatContainer = document.createElement("div");
      seatContainer.className = "seat-container";

      seats.forEach((seat) => {
        const seatLabel = document.createElement("label");
        seatLabel.className = `seat ${
          seat.available ? "available" : "unavailable"
        }`;

        const seatInput = document.createElement("input");

        seatInput.type = "checkbox";
        seatInput.name = "seat_ids[]";
        seatInput.value = seat.seat_id;
        seatInput.disabled = !seat.available;
        const divSeat = document.createElement("div");
        divSeat.className = "seat_test";

        const seatIcon = document.createElement("span");

        seatIcon.className = "seat-icon";
        seatIcon.textContent = seat.seat_name;

        seatLabel.appendChild(seatInput);
        seatLabel.appendChild(divSeat);
        divSeat.appendChild(seatIcon);
        seatContainer.appendChild(seatLabel);
      });

      seatSelectionDiv.appendChild(seatContainer);
    })
    .catch((error) => console.error("Error fetching seat details:", error));
}
