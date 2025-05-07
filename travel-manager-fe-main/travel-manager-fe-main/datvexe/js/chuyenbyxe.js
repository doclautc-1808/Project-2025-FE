const vehicleContainer = document.getElementById("list-ve");

// Hàm để lấy các tham số từ URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  const query = {};
  for (const [key, value] of params.entries()) {
    query[key] = value;
  }
  return query;
}

async function fetchSchedules() {
  // Lấy các tham số từ URL
  const queryParams = getQueryParams();

  // Lấy car_id từ URL
  const carId = queryParams.id;

  if (!carId) {
    console.error("Car ID is not provided in the URL.");
    return;
  }

  // Xây dựng URL API
  const apiUrl = `http://127.0.0.1:8000/api/schedule/get-by-car?car_id=${carId}`;

  // Lấy token từ session storage
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    const schedules = result.data;

    schedules.forEach((schedule) => {
      const itemHTML = `
        <div class="">
          <div class="list-block main-block cr-list-block">
            <div class="list-content">
              <div class="main-img list-img cr-list-img">
                <a href="car-detail-left-sidebar.html">
                  <img src="${schedule.image}" class="img-responsive" alt="car-img" />
                </a>
                <div class="main-mask">
                  <ul class="list-unstyled list-inline offer-price-1">
                    <li class="price">${schedule.price} VND<span class="divider">|</span><span class="pkg">GHẾ</span></li>
                  </ul>
                </div><!-- end main-mask -->
              </div><!-- end cr-list-img -->
              <div class="list-info cr-list-info">
                <h3 class="block-title">
                  <a href="car-detail-left-sidebar.html"></a>
                  <span>
                    <b style="padding-top:1.5rem;padding-bottom:1.5rem;text-transform: none; font-size: 17px;" class="block-minor">
                      
                    </b>
                  </span>
                </h3>
                <p class="block-minor">
                  <i class="fa-sharp fa-solid fa-bullseye"></i>&nbsp; ${schedule.departure_time} &emsp;
                  <i class="fa-solid fa-house-flag"></i> <span>&nbsp; ${schedule.departure_location}</span>
                </p>
                <p><i class="fa fa-long-arrow-down" aria-hidden="true"></i></p>
                <p class="block-minor">
                  <i class="fa-solid fa-location-dot"></i>&nbsp; ${schedule.arrival_time} &emsp;
                  <i class="fa-solid fa-house-flag"></i> <span>&nbsp; ${schedule.arrival_location}</span>
                </p>
                <ul class="list-unstyled list-inline car-features">
                  <li><span><i class="fa fa-wifi"></i></span>Wifi</li>
                  <li><span><i class="fa fa-snowflake-o"></i></span>Điều hoà</li>
                  <li><span><i class="fa fa-battery-full"></i></span>Sạc pin</li>
                  <li><span><i class="fa fa-music"></i></span>Music</li>
                  <li><span><i class="fa fa-tv"></i></span>Tivi LED</li>
                </ul>
            
                <a href="datve.html?schedule_id=${schedule.id}&car_id=${carId}" class="btn btn-orange btn-lg">Đặt vé ngay</a>
              </div><!-- end crs-list-info -->
            </div> <!-- end list-content -->
          </div> <!-- end cr-list-block -->
        </div><!-- end columns -->
      `;
      vehicleContainer.innerHTML += itemHTML;
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
}

fetchSchedules();
