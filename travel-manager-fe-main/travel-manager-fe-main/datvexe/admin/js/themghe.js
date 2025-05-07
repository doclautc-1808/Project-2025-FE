document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  const carId = urlParams.get("this_id");

  if (!carId) {
    console.error("Car ID not found in URL");
    return;
  }

  const token = sessionStorage.getItem("token"); // Assume token is stored in sessionStorage

  // Fetch seats and populate the select input
  fetch("http://127.0.0.1:8000/api/admin/seats", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        const seatSelect = document.getElementById("seat-select");
        data.seats.forEach((seat) => {
          const option = document.createElement("option");
          option.value = seat.id;
          option.textContent = seat.name;
          seatSelect.appendChild(option);
        });
      } else {
        console.error("Failed to fetch seats data");
      }
    })
    .catch((error) => console.error("Error:", error));

  // Handle form submission
  document
    .getElementById("add-seat-btn")
    .addEventListener("click", function () {
      const seatId = document.getElementById("seat-select").value;

      if (!seatId) {
        alert("Please select a seat.");
        return;
      }

      const payload = { seat_id: seatId };

      fetch(`http://127.0.0.1:8000/api/admin/cars/${carId}/seats`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })
        .then((response) => {
          if (!response.ok) {
            alert("Ghế đã tồn tại trong xe");
          }
          return response.json();
        })
        .then((data) => {
          if (data.status) {
            alert("Thêm ghế thành công");

            window.location.href = `QLGhe.html?this_id=${carId}`;
          }
        })
        .catch((error) => console.error("Error:", error));
    });
});
