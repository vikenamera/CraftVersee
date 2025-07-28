// Cart functionality for product page
function addToCartFromProductPage() {
  // Get product details
  const title = document.querySelector('h1').textContent.trim();
  const priceText = document.getElementById('product-price').textContent;
  const price = parseInt(priceText.replace(/\D/g, '')) || 0;
  const imageSrc = document.getElementById('product-image').getAttribute('src');
  const quantityInput = document.getElementById('quantity');
  const quantity = parseInt(quantityInput.value) || 1;

  // Get existing cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart')) || [];

  // Check if product already exists in cart
  const existingIndex = cart.findIndex(item =>
    item.title === title && item.price === price && item.imageSrc === imageSrc
  );

  if (existingIndex !== -1) {
    // Update quantity if product exists
    cart[existingIndex].quantity += quantity;
  } else {
    // Add new product to cart
    cart.push({ title, price, imageSrc, quantity });
  }

  // Save updated cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count if the element exists
  updateCartCount();
  
  // Show success message
  showAlert('Produkti u shtua në shportë!');
}

// Update cart count display
function updateCartCount() {
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = totalQty;
  }
}

// Show alert message
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

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
});