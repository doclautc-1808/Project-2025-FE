const numberOfItems = 8; // Change this to the number of items you want
const vehicleContainer = document.getElementById("list-car");
const sheduleContainer = document.getElementById("list-schedule");

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

  // Xây dựng URL API
  let apiUrl = "http://127.0.0.1:8000/api/schedules/search";
  const queryStrings = [];

  // Thêm các tham số vào mảng queryStrings
  if (queryParams.departure_date) {
    queryStrings.push(`departure_date=${queryParams.departure_date}`);
  }
  if (queryParams.departure_location) {
    queryStrings.push(
      `departure_location=${encodeURIComponent(queryParams.departure_location)}`
    );
  }
  if (queryParams.arrival_location) {
    queryStrings.push(
      `arrival_location=${encodeURIComponent(queryParams.arrival_location)}`
    );
  }
  if (queryParams.page) {
    queryStrings.push(`page=${queryParams.page}`);
  }

  if (queryParams.arrival_time) {
    queryStrings.push(`arrival_time=${queryParams.arrival_time}`);
  }

  // Gắn chuỗi truy vấn vào URL nếu có tham số
  if (queryStrings.length > 0) {
    apiUrl += `?${queryStrings.join("&")}`;
  }

  console.log(apiUrl);

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
        <div class="col-sm-6 col-md-3">
            <div class="main-block vehicle-block">
                <div class="main-img vehicle-img">
                    <a href="comment.html?this_id=${schedule.car_id}">
                        <img src="${schedule.image}" class="img-responsive" alt="tour-img" style="height:150px;width:100%" />
                    </a>
                    <div class="vehicle-time">
                        <p><span><i class="fa fa-clock-o"></i></span>
                            ${schedule.departure_location} - ${schedule.arrival_location}
                        </p>
                    </div><!-- end vehicle-time -->
                </div><!-- end vehicle-img -->

                <div class="offer-price-2">
                    <ul class="list-unstyled">
                        <li class="price">
                            ${schedule.price} VND<a href="comment.html?this_id=${schedule.car_id}"><span class="arrow"><i class="fa fa-angle-right"></i></span></a>
                        </li>
                    </ul>
                </div><!-- end offer-price-2 -->

                <div class="main-info vehicle-info">
                    <div class="main-title vehicle-title">
                        
                        <i>
                            ${schedule.departure_time}
                        </i><br>
                        <i>
                        ${schedule.arrival_time}
                        </i>
                       
                    </div><!-- end vehicle-title -->
                </div><!-- end vehicle-info -->
                <div class="view-all text-center">
                    <a href="datve.html?schedule_id=${schedule.schedule_id}&car_id=${schedule.car_id}" class="btn btn-orange btn-lg">Đặt vé ngay</a>
                </div><!-- end view-all -->
            </div><!-- end vehicle-block -->
        </div><!-- end columns -->
    `;
      sheduleContainer.innerHTML += itemHTML;
    });
  } catch (error) {
    console.error("Error fetching schedules:", error);
  }
}

async function fetchCars() {
  // URL API
  const apiUrl = "http://127.0.0.1:8000/api/car/get-all";

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
    const cars = result.data;

    cars.forEach((car) => {
      const itemHTML = `
        <div class="col-sm-6 col-md-3">
            <div class="main-block vehicle-block">
                <div class="main-img vehicle-img">
                    <a href="comment.html?this_id=${car.id}">
                        <img src="${car.image}" class="img-responsive" alt="car-img" style="height:150px;width:100%"/>
                    </a>
                    
                </div><!-- end vehicle-img -->

                <div class="offer-price-2">
                    <ul class="list-unstyled">
                        <li class="price">
                            ${car.name}<a href="chuyenbyxe.html?id=${car.id}"><span class="arrow"><i class="fa fa-angle-right"></i></span></a>
                        </li>
                    </ul>
                </div><!-- end offer-price-2 -->

                <div class="main-info vehicle-info">
                    <div class="main-title vehicle-title">
                        <i>Biển số xe: ${car.license_plates}</i><br>
                    
                    </div><!-- end vehicle-title -->
                </div><!-- end vehicle-info -->
            </div><!-- end vehicle-block -->
        </div><!-- end columns -->
    `;
      vehicleContainer.innerHTML += itemHTML;
    });
  } catch (error) {
    console.error("Error fetching cars:", error);
  }
}

// Lấy giá trị 'user_email' từ session storage
var userEmail = sessionStorage.getItem("email");

// Kiểm tra xem userEmail có giá trị không và điền vào phần tử HTML
if (userEmail) {
  document.getElementById("userEmail").textContent = userEmail;
}

document
  .getElementById("logoutLink")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Ngăn chặn hành động mặc định của liên kết
    sessionStorage.removeItem("email");
    sessionStorage.removeItem("token");
    // Chuyển hướng đến trang đăng nhập
    window.location.href = "dangnhap.html"; // Thay đổi thành URL của trang đăng nhập thực tế
  });

document
  .getElementById("searchForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Ngăn form gửi đi theo cách mặc định

    // Lấy các giá trị từ các trường nhập liệu
    const di = document.querySelector('input[name="di"]').value;
    const den = document.querySelector('input[name="den"]').value;

    const gioKhoiHanh = document.querySelector('input[name="time1"]').value;
    const gioDen = document.querySelector('input[name="time2"]').value;

    // Xây dựng URL với các tham số truy vấn
    const url = `tuyen.html?departure_date=${
      2024 - 12 - 12
    }&departure_location=${encodeURIComponent(
      di
    )}&arrival_location=${encodeURIComponent(
      den
    )}&departure_time=${gioKhoiHanh}&arrival_time=${gioDen}&page=1`;

    // Chuyển hướng đến trang tuyen.html với các tham số truy vấn
    window.location.href = url;
  });

document.addEventListener("DOMContentLoaded", function () {
  fetchSchedules();
  fetchCars();
});
