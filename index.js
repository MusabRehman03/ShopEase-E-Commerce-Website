let arr = [];
// let cartCountArray = JSON.parse(localStorage.getItem("cartCountArray")) || [
//   0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
//   0, 0, 0, 0,
// ];
let totalNumberOfProductsInCart=0
let total = 0;
let currentPage = 1;
let cartArray = JSON.parse(localStorage.getItem("cartArray")) || [];
if (currentPage == 1) {
  document.getElementById("prev").disabled = true;
}
let limit = 8;
let skip = (currentPage - 1) * limit;
let div = document.getElementById("productsDiv");
async function fetchData() {
  document.getElementById("total").classList.add("hidden");
  let raw = await fetch("https://dummyjson.com/product");
  let data = await raw.json();
  arr = data.products;
//   console.log(arr);
  let paginatedArray = arr.slice(skip, skip + limit);
//   console.log(paginatedArray);
  let pages = document.getElementById("pages");
  pages.classList.remove("hidden");
  displayData(paginatedArray);
  // displayData(arr)
}
function displayData(array = arr) {
  div.innerHTML = "";
  div.innerHTML = array
    .map((element, index) => {
      return `<div  class=" productCard p-4 border rounded-lg shadow-md h-fit w-80 flex flex-col justify-center items-center">
            <img src="${element.thumbnail}" alt="${element.title}" class="w-40 h-40 object-cover">
            <h2 class="text-lg font-semibold">${element.title}</h2>
            <p class="text-gray-600">Brand: ${element.brand}</p>
            <p class="text-green-500 font-bold">$${element.price}</p>
            
            <button index=${index} class=" addToCart mt-2 px-4 py-2 hover:bg-blue-700 bg-blue-500 text-white rounded">Add to Cart</button>
            
        </div>`;
    })
    .join("");
  updatePagination();
  let buttons = div.querySelectorAll(".addToCart");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
    //   cartCountArray[button.getAttribute("index")]++;
    //   localStorage.setItem("cartCountArray", JSON.stringify(cartCountArray));

      let c = 0;
      // console.log('loopstart')
      // console.log(Number( button.getAttribute("index"))+1)
      for (let i = 0; i < cartArray.length; i++) {
        if (Number(button.getAttribute("index")) + 1 == cartArray[i].id) {
            cartArray[i].count++
          c++;

        }
      }
      // console.log('loopEnd')
      if (c == 0) {
        // console.log("if");
        const temp = array[button.getAttribute("index")]
        // console.log(temp)
        temp.count=1
        cartArray.push(array[button.getAttribute("index")]);
        localStorage.setItem("cartArray", JSON.stringify(cartArray));
      }

      button.innerHTML = "Added to Cart";
      button.className = "mt-2 px-4 py-2 bg-yellow-500 text-white rounded";
      currentPage--;
      setTimeout(() => {
        nextUpdate();
      }, 700);
    });
  });
}
function nextUpdate() {
  currentPage++;

  skip = (currentPage - 1) * limit;
  let paginatedArray = arr.slice(skip, skip + limit);
  displayData(paginatedArray);
  let current = document.getElementById("current");
  current.innerText = currentPage;
}
function prevUpdate() {
  currentPage--;
  skip = (currentPage - 1) * limit;
  let paginatedArray = arr.slice(skip, skip + limit);
  displayData(paginatedArray);
  let current = document.getElementById("current");
  current.innerText = currentPage;
}
function updatePagination() {
  if (currentPage * limit >= arr.length) {
    document.getElementById("next").disabled = true;
  } else {
    document.getElementById("next").disabled = false;
  }
  if (currentPage === 1) {
    document.getElementById("prev").disabled = true;
  } else {
    document.getElementById("prev").disabled = false;
  }
}
function cart() {
  let pages = document.getElementById("pages");
  pages.classList.add("hidden");
  displayCartData(cartArray);
}
fetchData();
displayData();
function displayCartData(array = cartArray) {
//   console.log(cartCountArray);
  document.getElementById("total").classList.remove("hidden");
  div.innerHTML = "";
  total = 0;
  totalNumberOfProductsInCart=0
  div.innerHTML = array
    .map((element, index) => {
      let n = Number(element.id) - 1;
      total+=element.count*element.price
        totalNumberOfProductsInCart+=element.count
    //   total = total + cartCountArray[n] * arr[n].price;
    //   console.log(cartCountArray[n]);
    //   console.log(arr[n].price);
      //   for(let i=0;i<30;i++){
      //     total=total+(cartCountArray[i]*arr[n].price)

      //   }
      //   console.log(total)
      // console.log(element.price)
      element.index=index
      // console.log(element)
      return `<div  class=" productCard p-4 border rounded-lg shadow-md h-fit w-80 flex flex-col justify-center items-center">
              <img src="${element.thumbnail}" alt="${element.title}" class="w-40 h-40 object-cover">
              <h2 class="text-lg font-semibold">${element.title}</h2>
              <p class="text-gray-600">Brand: ${element.brand}</p>
              <p class="text-green-500 font-bold">$${element.price}</p>
                <div class="flex space-x-1">
              <button  index=${index} onclick="decrement(${element.index})" class=" plus  mt-2 px-4 py-2 hover:bg-red-500 bg-red-400 text-white rounded">-</button>
              <span class="mt-2 px-4 py-2" id="count">${element.count}</span>
            <button index=${index} onclick="increment(${element.index})" class=" minus mt-2 px-4 py-2 hover:bg-blue-500 bg-blue-400 text-white rounded">+</button>

            </div>
          </div>`;
    })
    .join("");

  document.getElementById("bill").innerText = total.toFixed("2");
  document.getElementById('checkOut').innerText = `Check Out(${totalNumberOfProductsInCart})`
}
// let counter=document.getElementById("count")
//       let count=0;
function decrement(n) {
  if(cartArray[n].count>1){
    cartArray[n].count--
  }else if(cartArray[n].count==1){
    cartArray.splice(n,1)
  }
   
    // console.log('jdhdjsks')
  // console.log(index)
//   if (cartCountArray[n] > 1) {
//     cartCountArray[n]--;
//     console.log(n)
//     localStorage.setItem("cartCountArray", JSON.stringify(cartCountArray));

    // let p=arr[n+1].price
    // console.log(total)
    // total-=p
    // console.log(total)
    // console.log(arr[n+1].price)
    // displayCartData();
//   } else if (cartCountArray[n] == 1) {
    // console.log(n + 1);
    // console.log(n)

    // cartCountArray[n]--;
    // localStorage.setItem("cartCountArray", JSON.stringify(cartCountArray));

    // cartArray.splice(n+1,1)
    // cartArray.forEach((elem,index) => {
    //   if (elem.id === n+1 ) {
    //     // let index=getAttribute('index')
    //     console.log(elem)
    //     cartArray.splice(index, 1);
    //     localStorage.setItem("cartArray", JSON.stringify(cartArray));
    //   }
    // });

    displayCartData();
//   }

  // console.log(cartCountArray[n])
}
function increment(n) {
    cartArray[n].count++
//   cartCountArray[n]++;
//   localStorage.setItem("cartCountArray", JSON.stringify(cartCountArray));

  // total+=arr[n+1].price
  // console.log(arr[n+1].price)
  displayCartData();
}
// function checkOut(){
//     // document.getElementById("checkOutDiv").classList.remove('hidden')
// }
// function confirmPayment(){
//     // document.getElementById("checkOutDiv").classList.add('hidden')
// }

// let checkOut=document.getElementById('checkOut')
// checkOut.addEventListener('click',()=>{
    function checkOut(){
    let a=document.getElementById('co')
    a.innerHTML='Check Out'
    let checkOutForm=document.getElementById('checkOutForm')
    checkOutForm.classList.remove('hidden')
    }
// })
function confirmPayment(){
let a=document.getElementById('co')
a.innerHTML='Order Summary'
let c = document.getElementById('orderSummary')
c.innerHTML=''


c.innerHTML=cartArray.map(element=>`<div class="flex justify-between"><h2 class="text-lg font-semibold">${element.title}</h2>
                
                <p class="text-green-500 font-bold">$${(element.price)*element.count}</p>
                </div>
    `).join('')
    let t=document.getElementById('thank')
    t.classList.remove('hidden')
    // window.onclick=function(){
    // let a = document.getElementById("checkOutForm")
    // a.classList.add('hidden')

    // }
}
