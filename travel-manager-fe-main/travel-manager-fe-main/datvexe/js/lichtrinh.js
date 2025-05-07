const numberOfItems = 8; // Change this to the number of items you want
const vehicleContainer = document.getElementById("lichtrinh-body");
const test = 1;
for (let i = 0; i < numberOfItems; i++) {
  const itemHTML = `
            
                                    <tr style="text-align:center;">
                                        <td> <a class="btn"
                                                href="chitiet.html?this_id=<?php echo $ro['C_Ma'] ?>"><span>Chuyến
                                                </span>

                                            </a></td>
                                        <td>
                                            08:00
                                        </td>
                                        <td>
                                            10:20
                                        </td>


                                        <td>
                                            Mỹ Đình
                                        </td>
                                        <td>
                                            200000
                                        </td>
                                        <td><a href="chitiet.html?this_id=<?php echo $ro['C_Ma'] ?>"
                                                style="text-decoration: none; cursor:pointer">Chi tiết</a> </td>

                                        

                                        <td><button onclick="tb()" style="text-decoration: none" class="my-btn">Đặt vé
                                                ngay</button></td>


        `;
  vehicleContainer.innerHTML += itemHTML;
}
