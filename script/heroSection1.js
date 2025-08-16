function initHeroSection1() {
  const form = document.getElementById('hero1SignupForm');
  if (!form) return; // Exit if form not found

  const emailInput = document.getElementById('hero1Email');
  const passwordInput = document.getElementById('hero1Password');
  const submitBtn = document.getElementById('hero1SubmitBtn');
  const inputs = [emailInput, passwordInput];

  // Initial state: Disable submit button
  submitBtn.disabled = true;

  // Validate a single input field
  function validateInput(input) {
    if (input.validity.valid) {
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
      return true;
    } else {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      return false;
    }
  }

  // Validate all form fields
  function validateForm() {
    let isValid = true;
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    submitBtn.disabled = !isValid;
    return isValid;
  }

  // Real-time validation on input
  inputs.forEach(input => {
    input.addEventListener('input', function() {
      validateInput(this);
      validateForm();
    });

    // Validate on blur
    input.addEventListener('blur', function() {
      validateInput(this);
    });
  });

  // Form submission
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    if (validateForm()) {
      // Show loading state
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Creating Account...';
      
      // Simulate API call
      setTimeout(() => {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = 'Start Learning for Free';
        
        // Redirect on success
        window.location.href = 'dashBoard/dashboard.html';
      }, 1500);
    } else {
      // Show validation errors
      inputs.forEach(input => validateInput(input));
    }
  });

  // Initialize form validation
  validateForm();
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initHeroSection1);

// Handle cases where script is loaded after DOM is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroSection1);
} else {
  initHeroSection1();
}