// Alap termékadatok kiegészítve kategória és leírás információval
const products = [
  {
    id: 1,
    name: "Fekete Póló",
    price: 4990,
    image: "src/cq5dam.web.hebebed.1000.1000.avif",
    description: "Kényelmes, fekete póló pamut anyagból.",
    category: "polo",
  },
  {
    id: 2,
    name: "Fehér Cipő",
    price: 12990,
    image: "src/fehercipo.webp",
    description: "Modern fehér cipő mindennapi használatra.",
    category: "cipo",
  },
  {
    id: 3,
    name: "Kék Nadrág",
    price: 8990,
    image: "src/kek.webp",
    description: "Stílusos kék nadrág, rugalmas anyagból.",
    category: "nadrag",
  },
];

// Kosár inicializálása
let cart = [];
let currentCategory = "all";
let searchQuery = "";

// Kosár tartalom betöltése a localStorage-ból
function loadCartFromStorage() {
  const savedCart = localStorage.getItem("cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

// Kosár tartalom mentése a localStorage-ba
function saveCartToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Termékek betöltése a szűrési és keresési beállítások alapján
function loadProducts() {
  const productGrid = document.getElementById("products");
  productGrid.innerHTML = ""; // Töröljük az előző tartalmat

  // Szűrt termékek keresés és kategória alapján
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      currentCategory === "all" || product.category === currentCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Termékek megjelenítése
  filteredProducts.forEach((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("product-item");
    productItem.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <p>${product.name} - ${product.price} Ft</p>
        <button onclick="addToCart(${product.id})">Kosárba</button>
        <button onclick="openModal(${product.id})">Részletek</button>
      `;
    productGrid.appendChild(productItem);
  });
}

// Keresési funkció - Keresési lekérdezés beállítása és termékek frissítése
function filterProducts() {
  searchQuery = document.getElementById("search-input").value;
  loadProducts();
}

// Kategória szerinti szűrés - Kategória beállítása és termékek frissítése
function filterByCategory(category) {
  currentCategory = category;
  loadProducts();
}

// Modál megnyitása részletes adatokkal
function openModal(productId) {
  const product = products.find((p) => p.id === productId);
  document.getElementById("modal-product-name").textContent = product.name;
  document.getElementById("modal-product-image").src = product.image;
  document.getElementById("modal-product-description").textContent =
    product.description;
  document.getElementById(
    "modal-product-price"
  ).textContent = `${product.price} Ft`;
  document.getElementById("product-modal").classList.add("show");

  // A termék ID-jét tároljuk a későbbi kosárhoz adáshoz
  window.currentProductId = productId;
}

// Modál bezárása
function closeModal() {
  document.getElementById("product-modal").classList.remove("show");
}

// Kosárhoz adás a modálból
function addToCartModal() {
  addToCart(window.currentProductId);
  closeModal();
}

// Kosárhoz adás
function addToCart(productId) {
  const product = products.find((p) => p.id === productId);
  const cartItem = cart.find((item) => item.id === productId);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  saveCartToStorage();
  alert(`${product.name} hozzáadva a kosárhoz!`);
}

// Kosár frissítése
function updateCart() {
  const cartCount = document.getElementById("cart-count");
  const cartItems = document.getElementById("cart-items");
  const totalPrice = document.getElementById("total-price");

  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartItems.innerHTML = "";
  cart.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.name} x ${item.quantity} - ${
      item.price * item.quantity
    } Ft`;
    cartItems.appendChild(li);
  });
  totalPrice.textContent = `Összesen: ${cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  )} Ft`;
}

// Kosár megjelenítése/elrejtése
function toggleCart() {
  const cart = document.getElementById("cart");
  cart.classList.toggle("hidden");
}

function checkout() {
  alert("A fizetési funkció jelenleg nem elérhető a demó verzióban.");
}


// Oldal betöltésekor a termékek és a kosár tartalmának betöltése
window.onload = function () {
  loadProducts();
  loadCartFromStorage();
  updateCart();
};
