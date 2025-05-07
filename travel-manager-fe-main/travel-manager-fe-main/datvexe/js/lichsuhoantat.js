document.addEventListener("DOMContentLoaded", async function () {
  const token = sessionStorage.getItem("token");

  async function loadTickets() {
    try {
      // Fetch user details
      const userResponse = await fetch(
        "http://127.0.0.1:8000/api/user/details",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const userData = await userResponse.json();
      const userId = userData.user.id;

      // Fetch reserved schedules
      const scheduleResponse = await fetch(
        `http://127.0.0.1:8000/api/schedule/reserved-schedule?user_id=${userId}&is_canceled=false&is_completed=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const scheduleData = await scheduleResponse.json();

      // Clear the tickets table
      const ticketsTable = document.getElementById("tickets-table");
      ticketsTable.innerHTML = "";

      // Loop through the schedules and create a row for each ticket
      scheduleData.data.forEach((schedule) => {
        const ticketRow = document.createElement("tr");

        // Extract schedule details
        const scheduleDetails = schedule.schedule;
        const carDetails =
          scheduleDetails.cars.length > 0
            ? `
        <div>
          <img src="${scheduleDetails.cars[0].image}" alt="${scheduleDetails.cars[0].name}" style="width: 100px;">
          <p><strong>Tên xe:</strong> ${scheduleDetails.cars[0].name}</p>
          <p><strong>Biển số xe:</strong> ${scheduleDetails.cars[0].license_plates}</p>
          <p><strong>Tên tài xế:</strong> ${scheduleDetails.cars[0].driver.full_name}</p>
          <p><strong>Số điện thoại:</strong> ${scheduleDetails.cars[0].driver.phone_number}</p>
        </div>
      `
            : "No cars available";

        // Extract seat details
        const seatDetails = schedule.seats
          .map((seat) => `<li>${seat.name}</li>`)
          .join("");

        ticketRow.innerHTML = `
          <td class="dash-list-icon booking-list-date" style="border-bottom: 2px solid black">
            <div class="b-date">
              <h3>${schedule.booking_time}</h3>
              <p></p>
            </div>
            <div class="b-date" style="color: ${
              schedule.is_accepted ? "green" : "red"
            };">
              <h5><b>${
                schedule.is_accepted ? "Hoàn thành" : "Chưa hoàn thành"
              }</b></h5>
            </div>
          </td>
          <td class="dash-list-text booking-list-detail" style="border-bottom: 2px solid black">
            <h3>${scheduleDetails.departure_location} - ${
          scheduleDetails.arrival_location
        }</h3>
            <h4><b><i class="fa fa-id-card-o" aria-hidden="true"></i>Thông tin khách hàng:</b></h4>
            <ul class="list-unstyled booking-info">
              <li><span class="line">Họ và tên: </span>${
                schedule.customer_name
              }</li>
              <li><span class="line">Email:</span>${schedule.email}</li>
              <li><span class="line">Số điện thoại:</span>${
                schedule.phone_number
              }</li>
            </ul>
            <hr style="height:5px;border-width:0;color:gray;background-color:white">
            <h4><b><i class="fa fa-car" aria-hidden="true"></i> Thông tin vé:</b></h4>
            <ul class="list-unstyled booking-info">
              <li><span class="line">Thời gian khởi hành: </span>${
                scheduleDetails.departure_time
              }</li>
              <li><span class="line">Thời gian đến: </span>${
                scheduleDetails.arrival_time
              }</li>
              <li><span class="line">Điểm lên xe: </span>${
                schedule.pickup_location
              }</li>
              <li><span class="line">Tổng tiền: </span>${
                schedule.total_amount
              }</li>
              <li><span class="line">Phương thức thanh toán: </span>Cash</li>
            </ul>
            <hr style="height:5px;border-width:0;color:gray;background-color:white">
            <h4><b><i class="fa fa-chair" aria-hidden="true"></i> Ghế đã đặt:</b></h4>
            <ul class="list-unstyled booking-info">${seatDetails}</ul>
            <hr style="height:5px;border-width:0;color:gray;background-color:white">
            <ul class="list-unstyled booking-info">
              <li><span class="line">Thời gian đặt vé: </span>${
                schedule.booking_time
              }</li>
            </ul>
            ${carDetails}
            <div style="margin-top:1rem;margin-left:0.5rem; color:red" id="countdown"></div>
            
            
          </td>
          <td class="dash-list-btn" style="border-bottom: 2px solid black">
           
          </td>
        `;

        ticketsTable.appendChild(ticketRow);
      });

      // Add event listeners for cancel buttons
      document.querySelectorAll(".cancel-btn").forEach((button) => {
        button.addEventListener("click", async function () {
          const reservationId = this.getAttribute("data-reservation-id");
          await cancelTicket(reservationId);
          await loadTickets();
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function cancelTicket(reservationId) {
    const url = `http://127.0.0.1:8000/api/schedule/reservation-status?reservation_id=${reservationId}&is_accepted=false&is_completed=true`;

    try {
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reservation_id: reservationId,
          is_canceled: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Cancellation response:", data);
      alert(data.message);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  // Load tickets on page load
  loadTickets();
});
