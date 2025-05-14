let arr = [];
let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];
let spanc = 0;
for(let i = 0; i < cartArray.length; i++) {
  spanc += Number(cartArray[i].count);
}
document.getElementById("span").innerText = spanc;

let currentPage = 1;
let limit = 8;
let skip = 0;
let total = 0;

let div = document.getElementById("productsDiv");

async function fetchData() {
  document.getElementById("total").classList.add("hidden");
  const raw = await fetch("https://dummyjson.com/products?limit=100");
  const data = await raw.json();
  arr = data.products;
  updatePagination();
  displayData(arr.slice(skip, skip + limit));
}

function displayData(array) {
  document.getElementById("span").classList.remove("hidden");
  div.innerHTML = array
    .map((item, index) => {
      return `
        <div class="productCard p-4 border rounded-lg shadow-md h-fit w-80 flex flex-col justify-center items-center bg-white">
          <img src="${item.thumbnail}" alt="${item.title}" class="w-40 h-40 object-cover">
          <h2 class="text-lg font-semibold">${item.title}</h2>
          <p class="text-gray-600">Brand: ${item.brand}</p>
          <p class="text-green-500 font-bold">$${item.price}</p>
          <button index=${index} class="addToCart mt-2 px-4 py-2 bg-[#443627] text-white hover:bg-[#5b4736] rounded">Add to Cart</button>
        </div>`;
    })
    .join("");

  document.querySelectorAll(".addToCart").forEach((button) => {
    button.addEventListener("click", () => {
      const idx = Number(button.getAttribute("index")) + skip;
      const product = arr[idx];
      const found = cartArray.find((p) => p.id === product.id);
      spanc++;
      document.getElementById("span").innerText = spanc;

      if (found) {
        found.count++;
      } else {
        cartArray.push({ ...product, count: 1 });
      }
      localStorage.setItem("cartArray", JSON.stringify(cartArray));

      button.innerHTML = "Added";
      button.className = "mt-2 px-4 py-2 bg-yellow-500 text-white rounded";
      setTimeout(() => {
        button.innerHTML = "Add to Cart";
        button.className = "addToCart mt-2 px-4 py-2 bg-[#443627] text-white hover:bg-[#5b4736] rounded";
      }, 700);
    });
  });
}

function updatePagination() {
  document.getElementById("prev").disabled = currentPage === 1;
  document.getElementById("next").disabled = currentPage * limit >= arr.length;
  document.getElementById("current").innerText = currentPage;
}

function nextUpdate() {
  currentPage++;
  skip = (currentPage - 1) * limit;
  updatePagination();
  displayData(arr.slice(skip, skip + limit));
}

function prevUpdate() {
  currentPage--;
  skip = (currentPage - 1) * limit;
  updatePagination();
  displayData(arr.slice(skip, skip + limit));
}

function cart() {
  document.getElementById("pages").classList.add("hidden");
  document.getElementById("total").classList.remove("hidden");
  document.getElementById("span").classList.add("hidden");
  showCart();
}

function showCart() {
  total = 0;
  div.innerHTML = `
    <div class="overflow-x-auto w-full">
      <table class="min-w-full bg-white rounded-lg shadow">
        <thead class="bg-[#443627] text-white">
          <tr>
            <th class="p-4 text-left">Image</th>
            <th class="p-4 text-left">Product</th>
            <th class="p-4 text-left">Price</th>
            <th class="p-4 text-left">Quantity</th>
            <th class="p-4 text-left">Total</th>
          </tr>
        </thead>
        <tbody>
          ${cartArray
            .map((item, index) => {
              const lineTotal = item.price * item.count;
              total += lineTotal;
              return `
                <tr class="border-b">
                  <td class="p-4"><img src="${item.thumbnail}" class="w-16 h-16 object-cover"></td>
                  <td class="p-4">${item.title}</td>
                  <td class="p-4">$${item.price}</td>
                  <td class="p-4 flex items-center gap-2">
                    <button onclick="decrement(${index})" class="bg-[#443627] text-white px-2 rounded">-</button>
                    ${item.count}
                    <button onclick="increment(${index})" class="bg-[#443627] text-white px-2 rounded">+</button>
                  </td>
                  <td class="p-4 font-semibold">$${lineTotal.toFixed(2)}</td>
                </tr>`;
            })
            .join("")}
        </tbody>
      </table>
    </div>

    <div class="mt-6 w-full flex justify-end">
      <div class="w-96 p-4 bg-white shadow rounded space-y-2">
        <div class="flex text-xl justify-between"><span>Subtotal:</span><span>$${total.toFixed(2)}</span></div>
        <div class="flex text-xl justify-between"><span>Discount:</span><span>$${(total/10).toFixed(2)}</span></div>
        <div class="flex text-xl justify-between font-bold"><span>Total:</span><span>$${(total-(total/10)).toFixed(2)}</span></div>
      </div>
    </div>
  `;
  document.getElementById("bill").innerText = total.toFixed(2);
  document.getElementById("checkOut").innerText = `Check Out (${cartArray.reduce((a, b) => a + b.count, 0)});`
}

function increment(index) {
  cartArray[index].count++;
  localStorage.setItem("cartArray", JSON.stringify(cartArray));
  showCart();
}

function decrement(index) {
  cartArray[index].count--;
  if (cartArray[index].count <= 0) {
    cartArray.splice(index, 1);
  }
  localStorage.setItem("cartArray", JSON.stringify(cartArray));
  showCart();
}

function checkOut() {
  document.getElementById("checkOutForm").classList.remove("hidden");
}

function confirmPayment() {
  const form = document.getElementById("userForm");
  form.classList.add("hidden");
  document.getElementById("co").innerText = "Order Summary";

  const summary = document.getElementById("orderSummary");
  summary.innerHTML = cartArray
    .map(
      (item) =>
        `<div class="flex justify-between border-b py-2">
          <span>${item.title} x${item.count}</span>
          <span>$${(item.price * item.count).toFixed(2)}</span>
        </div>`
    )
    .join("");

  document.getElementById("thank").classList.remove("hidden");
  localStorage.removeItem("cartArray");
}

fetchData();