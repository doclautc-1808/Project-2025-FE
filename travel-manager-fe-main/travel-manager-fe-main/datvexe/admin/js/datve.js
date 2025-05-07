// Example date

document.addEventListener("DOMContentLoaded", function () {
  // Fetch seat details
  fetch(
    `http://127.0.0.1:8000/api/schedule/details?schedule_id=${scheduleId}&car_id=${carId}&date=${date}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
    .then((response) => response.json())
    .then((data) => {
      const seats = data.seats;
      const seatSelectionDiv = document.getElementById("seatSelection");
      seats.forEach((seat) => {
        const seatDiv = document.createElement("div");
        seatDiv.innerHTML = `<input type="checkbox" name="seat_ids[]" value="${
          seat.seat_id
        }" ${seat.available ? "" : "disabled"} />
                                         <span>${seat.seat_name}</span>`;
        seatSelectionDiv.appendChild(seatDiv);
      });

      // Set route and car details
      document.getElementById(
        "routeName"
      ).textContent = `${data.schedule.departure_location} - ${data.schedule.arrival_location}`;
      document.getElementById(
        "departureTime"
      ).textContent = `${data.schedule.departure_time}`;
      document.getElementById(
        "arrivalTime"
      ).textContent = `${data.schedule.arrival_time}`;
      document.getElementById(
        "price"
      ).textContent = `${data.schedule.price} VND`;
      document.getElementById("carImage").src = `img/Xe/${data.car.image}`;
    })
    .catch((error) => console.error("Error fetching seat details:", error));

  // Handle form submission
  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = new FormData(this);
      const seatIds = Array.from(
        document.querySelectorAll('input[name="seat_ids[]"]:checked')
      ).map((input) => parseInt(input.value));

      const bookingData = {
        user_id: 1,
        schedule_id: scheduleId,
        seat_ids: seatIds,
        date: "2024-07-27", // Example date
        pickup_location: formData.get("dd"),
        customer_name: formData.get("PD_TenKH"),
        phone_number: formData.get("PD_SdtKH"),
        email: formData.get("PD_EmailKH"),
        total_amount: 1000, // Example total amount
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
          alert("Đặt vé thành công");
          console.log("Booking response:", data);
        })
        .catch((error) => {
          alert("Đặt vé thất bại! Vui lòng kiểm tra lại thông tin các trường.");
          console.error("Error:", error);
        });
    });
});
