function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const query = {};
  for (const [key, value] of params.entries()) {
    query[key] = value;
  }
  return query;
}

// Extract the 'id' from the URL
const queryParams = getQueryParams();
const reservationId = queryParams.id;

// Add event listener to the form
document
  .getElementById("updateForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Extract data from the form
    const name = document.querySelector('input[name="name"]').value;
    const sdt = document.querySelector('input[name="sdt"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const pickupLocation = document.querySelector(
      'input[name="PD_DiemDon"]'
    ).value;

    // Create the data object for the API request
    const requestData = {
      id: reservationId,
      customer_name: name,
      phone_number: sdt,
      email: email,
      pickup_location: pickupLocation,
    };

    // Get the token from session storage
    const token = sessionStorage.getItem("token");

    // Make the API request
    fetch("http://127.0.0.1:8000/api/schedule/update-reservation", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          alert("Cập nhật thành công!");
          window.location.href = "lichsu.html";
          // Optionally, redirect or perform another action
        } else {
          alert(data.message);
        }
      })
      .catch((error) => {
        alert("Có lỗi xảy ra khi cập nhật đặt chỗ");
        console.error("Error:", error);
      });
  });
