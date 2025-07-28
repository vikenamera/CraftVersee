console.log('Market.js loading...');

// DOM Elements - Declare all at the top
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.product-card');
const priceDisplay = document.getElementById('price-display');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const cartCountEl = document.getElementById('cart-count');
const filterToggleBtn = document.getElementById('filterToggleBtn');
const filterPanel = document.getElementById('filterPanel');

// Modal elements
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

console.log('Elements found:', {
  filters: filters.length,
  cards: cards.length,
  priceDisplay: !!priceDisplay,
  filterToggleBtn: !!filterToggleBtn,
  modal: !!modal
});

// Initialize filters
function initializeFilters() {
  if (minPriceInput && maxPriceInput) {
    [minPriceInput, maxPriceInput, ...filters].forEach(el => {
      if (el) el.addEventListener('input', applyFilters);
    });
  }
}

// Filter toggle functionality
function initializeFilterToggle() {
  if (filterToggleBtn && filterPanel) {
    filterToggleBtn.addEventListener('click', () => {
      console.log('Filter toggle clicked');
      filterPanel.classList.toggle('filter-open');
    });
  }
}

// Apply filters function
function applyFilters() {
  console.log('Applying filters...');
  
  const selectedCategories = Array.from(document.querySelectorAll('input[data-filter="category"]:checked'))
    .map(cb => cb.value);

  let minPrice = parseInt(minPriceInput?.value || 0);
  let maxPrice = parseInt(maxPriceInput?.value || 10000);

  if (minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }

  if (priceDisplay) {
    priceDisplay.textContent = `${minPrice} - ${maxPrice}+ Lekë`;
  }

  cards.forEach(card => {
    const category = card.dataset.category;
    const priceText = card.querySelector('.product-price')?.textContent || '0';
    const price = parseInt(priceText.replace(/\D/g, '')) || 0;

    const matchCategory = selectedCategories.length === 0 || selectedCategories.includes(category);
    const matchPrice = price >= minPrice && price <= maxPrice;

    card.style.display = (matchCategory && matchPrice) ? 'block' : 'none';
  });
}

// Add to cart function
function addToCartFromCard(button) {
  console.log('Add to cart clicked');
  
  const productCard = button.closest('.product-card');
  if (!productCard) {
    console.error('Product card not found');
    return;
  }

  const title = productCard.querySelector('.product-title')?.textContent?.trim() || 'Unknown Product';
  const priceText = productCard.querySelector('.product-price')?.textContent || '0';
  const price = parseInt(priceText.replace(/\D/g, '')) || 0;
  const imageSrc = productCard.querySelector('img')?.getAttribute('src') || '';
  const quantityInput = productCard.querySelector('.product-quantity');
  const quantity = quantityInput ? parseInt(quantityInput.value) || 1 : 1;

  console.log('Product details:', { title, price, quantity });

  let cart = [];
  try {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error('Error loading cart:', e);
    cart = [];
  }

  const existingIndex = cart.findIndex(item =>
    item.title === title && item.price === price && item.imageSrc === imageSrc
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ title, price, imageSrc, quantity });
  }

  try {
    localStorage.setItem('cart', JSON.stringify(cart));
  } catch (e) {
    console.error('Error saving cart:', e);
  }

  updateCartCount();
  showAlert('Produkti u shtua në shportë!');
}

// Make function global for onclick handlers
window.addToCartFromCard = addToCartFromCard;

// Update cart count
function updateCartCount() {
  let cart = [];
  try {
    const savedCart = localStorage.getItem('cart');
    cart = savedCart ? JSON.parse(savedCart) : [];
  } catch (e) {
    console.error('Error loading cart for count:', e);
  }
  
  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCountEl) {
    cartCountEl.textContent = totalQty;
  }
}

// Alert message
function showAlert(message) {
  const alertBox = document.getElementById('custom-alert');
  if (!alertBox) {
    console.warn('Alert box not found');
    return;
  }

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

// Modal functionality
function initializeModal() {
  if (!modal || !openBtn) {
    console.warn('Modal elements not found');
    return;
  }

  // Open modal
  openBtn.onclick = () => {
    console.log('Opening modal');
    modal.style.display = 'block';
    setMinDate();
    if (shippingCost) shippingCost.style.display = 'none';
  };

  // Close modal
  if (closeBtn) {
    closeBtn.onclick = () => {
      console.log('Closing modal');
      modal.style.display = 'none';
    };
  }

  // Custom product checkbox
  if (customCheckbox && customProduct) {
    customCheckbox.addEventListener('change', function () {
      customProduct.style.display = this.checked ? 'block' : 'none';
      if (!this.checked) customProduct.value = '';
    });
  }

  // Contact method selection
  if (contactMethod) {
    contactMethod.addEventListener('change', function () {
      console.log('Contact method changed:', this.value);
      if (emailField) emailField.style.display = this.value === 'email' ? 'block' : 'none';
      if (phoneField) phoneField.style.display = this.value === 'phone' ? 'block' : 'none';
    });
  }

  // Budget monitoring
  if (budgetInput && shippingCost) {
    budgetInput.addEventListener('input', () => {
      const value = parseFloat(budgetInput.value);
      if (!isNaN(value) && value < 1000 && value > 0) {
        shippingCost.style.display = 'inline-block';
      } else {
        shippingCost.style.display = 'none';
      }
    });
  }

  // Form submission
  const form = document.getElementById('giftBoxForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Form submitted');

      // Validate delivery date
      if (deliveryDate && deliveryDate.value < deliveryDate.min) {
        alert('Zgjidh një datë të ardhshme për dorëzim.');
        return;
      }

      // Close modal and show confirmation
      modal.style.display = 'none';
      if (confirmPopup) confirmPopup.style.display = 'block';

      // Reset form
      form.reset();
      if (shippingCost) shippingCost.style.display = 'none';
      if (emailField) emailField.style.display = 'none';
      if (phoneField) phoneField.style.display = 'none';
    });
  }

  // Confirmation popup close handlers
  if (confirmClose) {
    confirmClose.onclick = () => {
      if (confirmPopup) confirmPopup.style.display = 'none';
    };
  }

  if (confirmOkBtn) {
    confirmOkBtn.onclick = () => {
      if (confirmPopup) confirmPopup.style.display = 'none';
    };
  }

  // Window click handler
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
    if (e.target === confirmPopup) {
      confirmPopup.style.display = 'none';
    }
  };
}

// Set minimum date for delivery
function setMinDate() {
  if (!deliveryDate) return;
  
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = ('0' + (today.getMonth() + 1)).slice(-2);
  const dd = ('0' + today.getDate()).slice(-2);
  deliveryDate.min = `${yyyy}-${mm}-${dd}`;
  deliveryDate.value = `${yyyy}-${mm}-${dd}`;
}

// Terms modal functionality (if exists)
function initializeTermsModal() {
  const termsModal = document.getElementById('termsModal');
  const openTerms = document.getElementById('openTerms');
  const termsCloseBtn = document.querySelector('#termsModal .close');
  const termsOkBtn = document.getElementById('termsOkBtn');

  if (!termsModal || !openTerms) return;

  openTerms.addEventListener('click', function(e) {
    e.preventDefault();
    termsModal.style.display = 'block';
  });

  if (termsCloseBtn) {
    termsCloseBtn.addEventListener('click', function() {
      termsModal.style.display = 'none';
    });
  }

  if (termsOkBtn) {
    termsOkBtn.addEventListener('click', function() {
      termsModal.style.display = 'none';
    });
  }

  window.addEventListener('click', function(event) {
    if (event.target === termsModal) {
      termsModal.style.display = 'none';
    }
  });
}

// Initialize everything when DOM is loaded
function initialize() {
  console.log('Initializing market functionality...');
  
  initializeFilters();
  initializeFilterToggle();
  initializeModal();
  initializeTermsModal();
  updateCartCount();
  applyFilters();
  
  console.log('Market initialization complete');
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

console.log('Market.js loaded successfully');