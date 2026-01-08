const API = "http://127.0.0.1:8000/api/";

function loadProducts() {
  fetch(API + "products/")
    .then(res => res.json())
    .then(data => {
      let html = "";
      data.forEach(p => {
        html += `
          <p onclick="openDetails(${p.id})" style="cursor:pointer;">
            <b>${p.name}</b> - ₹${p.price}
          </p>
        `;
      });
      document.getElementById("products").innerHTML = html;
    });
}

function openDetails(id) {
  localStorage.setItem("productId", id);
  window.location = "details.html";
}

function loadProductDetails() {
  const id = localStorage.getItem("productId");

  fetch(API + "products/" + id + "/")
    .then(res => res.json())
    .then(p => {
      document.getElementById("product").innerHTML = `
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <p>Price: ₹${p.price}</p>
      `;
    });
}

function goBack() {
  window.location = "index.html";
}

function logout() {
  localStorage.clear();
  window.location = "login.html";
}

// Auto load
if (document.getElementById("products")) {
  loadProducts();
}

if (document.getElementById("product")) {
  loadProductDetails();
}





function addProduct() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first!");
    return;
  }

  fetch(API + "products/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + token
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value
    })
  })
  .then(res => {
    console.log("Status:", res.status);

    if (res.status === 401) {
      alert("Unauthorized! Please login again.");
      return;
    }

    if (res.status === 403) {
      alert("Only admin can add products!");
      return;
    }

    return res.json();
  })
  .then(data => {
    if (data) {
      alert("Product added successfully!");
      loadProducts();
    }
  })
  .catch(err => {
    console.error("Add product error:", err);
    alert("Server error!");
  });
}

function register() {
  fetch(API + "users/", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username: username.value,   
        password: password.value
    })
  })        
    .then(res => res.json())    
    .then(data => {
        alert("Registration successful! Please login.");
        window.location = "login.html";
    });
}

function login() {
  fetch(API + "login/", {
    method: "POST", 
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        username: username.value,   
        password: password.value
    })
    })
    .then(res => res.json())
    .then(data => {
        localStorage.setItem("token", data.access);
        window.location = "index.html";
    });
}