// DOM Elements
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.product-card');
const priceDisplay = document.getElementById('price-display');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const cartCountEl = document.getElementById('cart-count');

// Initialize filters
[minPriceInput, maxPriceInput, ...filters].forEach(el => {
  if (el) el.addEventListener('input', applyFilters);
});

// Apply filters
function applyFilters() {
  const selectedCategories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
    .map(cb => cb.value);

  let minPrice = parseInt(minPriceInput.value);
  let maxPrice = parseInt(maxPriceInput.value);

  if (minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  priceDisplay.textContent = `${minPrice} - ${maxPrice}+ Lekë`;

  cards.forEach(card => {
    const category = card.dataset.category;
    const priceText = card.querySelector('.product-price').textContent;
    const price = parseInt(priceText.replace(/\D/g, '')) || 0;

    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
    const matchPrice = price >= minPrice && price <= maxPrice;

    card.style.display = (matchCategory && matchPrice) ? 'block' : 'none';
  });
}

// Add to cart
function addToCartFromCard(button) {
  const productCard = button.closest('.product-card');
  const title = productCard.querySelector('.product-title').textContent.trim();
  const priceText = productCard.querySelector('.product-price').textContent;
  const price = parseInt(priceText.replace(/\D/g, '')) || 0;
  const imageSrc = productCard.querySelector('img').getAttribute('src');
  const quantityInput = productCard.querySelector('.product-quantity');
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  const existingIndex = cart.findIndex(item =>
    item.title === title && item.price === price && item.imageSrc === imageSrc
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ title, price, imageSrc, quantity });
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  showAlert('Produkti u shtua në shportë!');
}

// Update cart count
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) cartCountEl.textContent = totalQty;
}

// Alert message
function showAlert(message) {
  const alertBox = document.getElementById('custom-alert');
  if (!alertBox) return;

  alertBox.textContent = message;
  alertBox.classList.remove('hidden');
  alertBox.classList.add('show');

  setTimeout(() => {
    alertBox.classList.remove('show');
    setTimeout(() => {
      alertBox.classList.add('hidden');
    }, 300);
  }, 2500);
}


// Initial load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  applyFilters();
});

filterToggleBtn.addEventListener('click', () => {
  filterPanel.classList.toggle('filter-open');
});

  const modal = document.getElementById('giftBoxModal');
  const openBtn = document.getElementById('openModalBtn');
  const closeBtn = document.querySelector('.close');
  const customCheckbox = document.getElementById('customCheckbox');
  const customProduct = document.getElementById('customProduct');

  const contactMethod = document.getElementById('contactMethod');
  const emailField = document.getElementById('emailField');
  const phoneField = document.getElementById('phoneField');

  const budgetInput = document.getElementById('budgetInput');
  const shippingCost = document.getElementById('shippingCost');

  const deliveryDate = document.getElementById('deliveryDate');

  const confirmPopup = document.getElementById('confirmPopup');
  const confirmClose = document.querySelector('#confirmPopup .closePopup');
  const confirmOkBtn = document.getElementById('confirmOkBtn');

  // Hap dhe mbyll modalin
  openBtn.onclick = () => {
    modal.style.display = 'block';
    setMinDate();
    shippingCost.style.display = 'none';
  };
  closeBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
    if (e.target == confirmPopup) confirmPopup.style.display = 'none';
  };

  // Shfaq fushe produkt tjetër
  customCheckbox.addEventListener('change', function () {
    customProduct.style.display = this.checked ? 'block' : 'none';
    if (!this.checked) customProduct.value = '';
  });

  // Zgjidhja e mënyrës së kontaktit
  contactMethod.addEventListener('change', function () {
    emailField.style.display = this.value === 'email' ? 'block' : 'none';
    phoneField.style.display = this.value === 'phone' ? 'block' : 'none';
  });

  // Kontrollo budget-in dhe shfaq cmimin e postës në cep nëse është <1000
  budgetInput.addEventListener('input', () => {
    const value = parseFloat(budgetInput.value);
    if (!isNaN(value) && value < 1000 && value > 0) {
      shippingCost.style.display = 'inline-block';
    } else {
      shippingCost.style.display = 'none';
    }
  });

  // Vendos min date sot për delivery (vetëm në të ardhmen, mund të zgjidhet sot)
  function setMinDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = ('0' + (today.getMonth() + 1)).slice(-2);
    const dd = ('0' + today.getDate()).slice(-2);
    deliveryDate.min = `${yyyy}-${mm}-${dd}`;
    deliveryDate.value = `${yyyy}-${mm}-${dd}`;
  }

  // Submit me popup dhe mbyll modalin
  const form = document.getElementById('giftBoxForm');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Validim shtesë për datën (nëse përdoruesi ndryshon diku tjetër)
    if (deliveryDate.value < deliveryDate.min) {
      alert('Zgjidh një datë të ardhshme për dorëzim.');
      return;
    }

    // Mbyll modalin e formës
    modal.style.display = 'none';

    // Hap popup konfirmimi
    confirmPopup.style.display = 'block';

    // Ripastro formën dhe fusha shtesë
    form.reset();
    shippingCost.style.display = 'none';
    customProduct.style.display = 'none';
    emailField.style.display = 'none';
    phoneField.style.display = 'none';
  });

  // Mbyll popup konfirmimi
  confirmClose.onclick = () => (confirmPopup.style.display = 'none');
  confirmOkBtn.onclick = () => (confirmPopup.style.display = 'none');

  const termsModal = document.getElementById('termsModal');
  const openTerms = document.getElementById('openTerms');
  const closeBtn = document.querySelector('.modal .close');
  const termsOkBtn = document.getElementById('termsOkBtn');

  // Hap modalin kur klikojmë "Termat"
  openTerms.addEventListener('click', function(e) {
    e.preventDefault();
    termsModal.style.display = 'block';
  });

  // Mbyll modalin kur klikojmë X
  closeBtn.addEventListener('click', function() {
    termsModal.style.display = 'none';
  });

  // Mbyll modalin kur klikojmë "E kuptova"
  termsOkBtn.addEventListener('click', function() {
    termsModal.style.display = 'none';
  });

  // Mbyll modalin kur klikojmë jashtë tij
  window.addEventListener('click', function(event) {
    if (event.target === termsModal) {
      termsModal.style.display = 'none';
    }
  });