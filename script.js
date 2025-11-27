// ---------- ДАННЫЕ О ТОВАРАХ (из атрибутов HTML) ----------
const productElements = document.querySelectorAll(".product-card");
const products = {};

productElements.forEach((el) => {
  const id = el.dataset.id;
  products[id] = {
    id,
    title: el.dataset.title,
    lang: el.dataset.lang,
    price: parseFloat(el.dataset.price || "0"),
    sample: el.dataset.sample,
    sampleEn: el.dataset.sampleEn,
  };
});

// ---------- КОРЗИНА ----------
const cart = {};
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountLabel = document.getElementById("cart-count-label");

function updateCartView() {
  const ids = Object.keys(cart);
  cartItemsContainer.innerHTML = "";

  if (ids.length === 0) {
    const empty = document.createElement("div");
    empty.className = "cart-empty";
    empty.innerHTML =
      "Ваша корзина пуста.<br />Добавьте пособие, нажав «В корзину / Add to cart».";
    cartItemsContainer.appendChild(empty);
    cartTotalEl.innerHTML = "0.00&nbsp;USD";
    cartCountLabel.textContent = "0 товаров";
    return;
  }

  let total = 0;
  let count = 0;

  ids.forEach((id) => {
    const item = cart[id];
    const product = products[id];
    if (!product) return;

    const sum = product.price * item.qty;
    total += sum;
    count += item.qty;

    const row = document.createElement("div");
    row.className = "cart-item";

    const left = document.createElement("div");
    const name = document.createElement("div");
    name.className = "cart-item-name";
    name.textContent = product.title;
    const meta = document.createElement("div");
    meta.className = "cart-item-meta";
    meta.textContent = product.lang;
    left.appendChild(name);
    left.appendChild(meta);

    const right = document.createElement("div");
    const price = document.createElement("div");
    price.className = "cart-item-price";
    price.innerHTML = sum.toFixed(2) + "&nbsp;USD";

    const qty = document.createElement("div");
    qty.className = "cart-item-qty";
    qty.textContent = "× " + item.qty;

    right.appendChild(price);
    right.appendChild(qty);

    row.appendChild(left);
    row.appendChild(right);

    cartItemsContainer.appendChild(row);
  });

  cartTotalEl.innerHTML = total.toFixed(2) + "&nbsp;USD";
  cartCountLabel.textContent = count + " " + (count === 1 ? "товар" : "товаров");
}

function addToCart(productId) {
  if (!products[productId]) return;
  if (!cart[productId]) {
    cart[productId] = { qty: 0 };
  }
  cart[productId].qty += 1;
  updateCartView();
  showToast("Товар добавлен в корзину / Item added to cart");
}

// ---------- ПРЕДПРОСМОТР (МОДАЛКА) ----------
const modalBackdrop = document.getElementById("modal-backdrop");
const modalTitle = document.getElementById("modal-title");
const modalLang = document.getElementById("modal-lang");
const modalDescription = document.getElementById("modal-description");
const modalSample = document.getElementById("modal-sample");
const modalCloseBtn = document.getElementById("modal-close-btn");
const modalAddToCartBtn = document.getElementById("modal-add-to-cart");

let currentPreviewId = null;

function openPreview(productId) {
  const product = products[productId];
  if (!product) return;

  currentPreviewId = productId;

  modalTitle.textContent = product.title;
  modalLang.textContent = product.lang;
  modalDescription.textContent =
    product.sample || "Описание в разработке / Description coming soon";

  const ruPart = product.sample
    ? "RU: " + product.sample
    : "RU: пример страницы появится позже.";
  const enPart = product.sampleEn
    ? "EN: " + product.sampleEn
    : "EN: sample will be available later.";

  modalSample.innerHTML =
    "<strong>Пример / Sample:</strong><br><br>" +
    ruPart +
    "<br><br>" +
    enPart;

  modalBackdrop.style.display = "flex";
}

function closePreview() {
  modalBackdrop.style.display = "none";
  currentPreviewId = null;
}

modalCloseBtn.addEventListener("click", closePreview);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) {
    closePreview();
  }
});

modalAddToCartBtn.addEventListener("click", () => {
  if (currentPreviewId) {
    addToCart(currentPreviewId);
  }
});

// ---------- КНОПКИ НА КАРТОЧКАХ ----------
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    if (!card) return;
    const id = card.dataset.id;
    addToCart(id);
  });
});

document.querySelectorAll(".preview-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".product-card");
    if (!card) return;
    const id = card.dataset.id;
    openPreview(id);
  });
});

// ---------- КНОПКИ ОФОРМЛЕНИЯ ЗАКАЗА ----------
const checkoutBtn = document.getElementById("checkout-btn");
const payBtn = document.getElementById("pay-btn");

checkoutBtn.addEventListener("click", () => {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    showToast("Добавьте хотя бы одно пособие в корзину");
    return;
  }
  alert(
    "Шаг оформления заказа.\n\nЗдесь вы можете:\n• добавить форму с данными покупателя (имя, e-mail);\n• указать способ доставки/формат (PDF/печать);\n• перейти к оплате."
  );
});

payBtn.addEventListener("click", () => {
  const ids = Object.keys(cart);
  if (ids.length === 0) {
    showToast("Сначала добавьте товары в корзину");
    return;
  }
  alert(
    "Шаг оплаты.\n\nВ реальном проекте здесь подключается платёжная система (Stripe, ЮKassa и т.п.).\nПосле успешной оплаты пользователь получает ссылку на скачивание PDF-файлов."
  );
});

// ---------- ТОСТ (ВСПЛЫВАЮЩЕЕ УВЕДОМЛЕНИЕ) ----------
const toastEl = document.getElementById("toast");
const toastMessageEl = document.getElementById("toast-message");
let toastTimeout = null;

function showToast(message) {
  toastMessageEl.textContent = message;
  toastEl.style.display = "flex";

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }
  toastTimeout = setTimeout(() => {
    toastEl.style.display = "none";
  }, 2500);
}

