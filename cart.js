// Load cart from localStorage or initialize as empty array
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Normalize old cart items to include quantity
cart = cart.map(item => ({
  ...item,
  quantity: item.quantity || 1
}));

// DOM Elements
const cartContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

// Render cart items on page
function renderCart() {
  if (!cartContainer || !cartTotal) return;

  cartContainer.innerHTML = '';
  let total = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = '<p>Shporta është bosh.</p>';
    cartTotal.textContent = '';
    return;
  }

  cart.forEach((item, index) => {
    const itemPrice = parseFloat(item.price);
    const itemQty = parseInt(item.quantity);
    const itemTotal = itemPrice * itemQty;
    total += itemTotal;

    const itemEl = document.createElement('div');
    itemEl.className = 'cart-item';
    itemEl.style.display = 'flex';
    itemEl.style.alignItems = 'center';
    itemEl.style.marginBottom = '10px';
    itemEl.style.gap = '10px';

    itemEl.innerHTML = `
      <img src="${item.imageSrc || ''}" alt="${item.title}" style="width: 60px; height: 60px; object-fit: cover;">
      <div style="flex: 1;">
        <p>${item.title}</p>
        <p>${itemPrice.toFixed(2)} Leke x ${itemQty}</p>
        <p>Subtotal: ${itemTotal.toFixed(2)} Leke</p>
      </div>
      <button onclick="removeItem(${index})" style="color: red; background: none; border: none; font-size: 20px; cursor: pointer;">×</button>
    `;

    cartContainer.appendChild(itemEl);
  });

  cartTotal.textContent = `Totali: ${total.toFixed(2)} Leke`;
  updateTotal(); // update checkout section total
}

// Add product from product card
function addToCartFromCard(button) {
  const productCard = button.closest('.product-card');
  const title = productCard.querySelector('.product-title').textContent;
  const price = productCard.querySelector('.product-price').textContent.replace('Leke', '').trim();
  const imageSrc = productCard.querySelector('img').getAttribute('src');

  const existingIndex = cart.findIndex(item =>
    item.title === title && item.price === price && item.imageSrc === imageSrc
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push({ title, price, imageSrc, quantity: 1 });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
  alert('Produkti u shtua në shportë!');
}

// Remove single item
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
  updateCartCount();
}

// Clear all items
function clearCart() {
  cart = [];
  localStorage.removeItem('cart');
  renderCart();
  updateCartCount();
}

// Update cart icon
function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
  }
}


// Used in checkout form
function getTotal() {
  return cart.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0).toFixed(2);
}

function updateTotal() {
  const totalEl = document.getElementById('total-amount');
  if (totalEl) {
    totalEl.textContent = `Totali: ${getTotal()} Leke`;
  }
}

// Show checkout form, hide cart
function showCheckout() {
  if (cart.length === 0) {
    alert('Shporta është bosh. Shto produkte para se të vazhdosh.');
    return;
  }

  document.getElementById('cart-items').style.display = 'none';
  document.getElementById('cart-total').style.display = 'none';

  const buttons = document.querySelector('.cart-buttons');
  if (buttons) buttons.style.display = 'none';

  const form = document.getElementById('checkout-form');
  if (form) form.style.display = 'block';

  updateTotal(); // update total for checkout
}


// Toggle card fields visibility
function toggleCardFields() {
  const method = document.getElementById('payment-method').value;
  const cardFields = document.getElementById('card-fields');
  cardFields.classList.toggle('hidden', method !== 'card');
}

// Format card number input
function formatCardNumber() {
  const input = document.getElementById('card-number');
  let value = input.value.replace(/\D/g, '').substring(0, 16);
  value = value.replace(/(.{4})/g, '$1 ').trim();
  input.value = value;
}

// Buy/submit form
function handleBuy() {
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const address = document.getElementById('address').value.trim();
  const payment = document.getElementById('payment-method').value;

  if (!name || !email || !address) {
    alert('Ju lutemi plotësoni të gjitha fushat.');
    return;
  }

  if (payment === 'card') {
    const cardName = document.getElementById('card-name').value.trim();
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiry = document.getElementById('expiry').value;
    const cvv = document.getElementById('cvv').value.trim();

    if (!cardName || !cardNumber || !expiry || !cvv) {
      alert('Ju lutemi plotësoni të gjitha të dhënat e kartës.');
      return;
    }
  }

  // Clear cart after successful "purchase"
  localStorage.removeItem('cart');
  cart = [];

  if (document.getElementById('checkout-form')) document.getElementById('checkout-form').style.display = 'none';
  if (document.getElementById('thank-you')) document.getElementById('thank-you').style.display = 'block';
  updateCartCount();
}

// Back to home/shop
function goToShop() {
  window.location.href = 'index.html';
}

// On page load
renderCart();
updateCartCount();
updateTotal();