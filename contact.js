document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".contact-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent real form submission

    // Get form values
    const name = form.querySelector("#name").value.trim();
    const email = form.querySelector("#email").value.trim();
    const message = form.querySelector("#message").value.trim();

    // Simple validation
    if (!name || !email || !message) {
      showAlert("Të lutem plotëso të gjitha fushat!", "error");
      return;
    }

    if (!validateEmail(email)) {
      showAlert("Email-i nuk duket i saktë.", "error");
      return;
    }

    // Simulate successful submission
    form.reset();
    showAlert("Mesazhi u dërgua me sukses! 🎉", "success");
  });

  // Helper: Email format checker
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Helper: Show success/error message
  function showAlert(message, type) {
    let existing = document.querySelector(".form-alert");
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = `form-alert ${type}`;
    div.textContent = message;

    form.parentElement.insertBefore(div, form);

    setTimeout(() => {
      div.remove();
    }, 4000);
  }
});
