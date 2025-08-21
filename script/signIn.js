// script/login.js
// Robust email + password validation, enable/disable Submit, remember-me persistence.

// Wrap in DOMContentLoaded so elements exist
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const email = document.getElementById('email');
  const password = document.getElementById('password');
  const remember = document.getElementById('remember');
  const submitBtn = document.getElementById('primaryBtn');

  if (!form || !email || !password || !submitBtn) {
    console.warn('Login script: missing required elements (loginForm, email, password, primaryBtn).');
    return;
  }

  // PRACTICAL EMAIL REGEX (covers most common valid emails without being overly strict)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Allowed password characters: letters, digits, and common printable symbols (no spaces)
  // This character class can be extended/contracted as needed.
  const passwordAllowedRegex = /^[A-Za-z0-9!@#$%^&*()_\-+=\[\]{};:'"\\|,.<>\/?`~]+$/;

  function getPasswordMinLength() {
    const attr = password.getAttribute('minlength');
    const n = attr ? parseInt(attr, 10) : NaN;
    return Number.isFinite(n) && n > 0 ? n : 9;
  }

  // Validate email — sets custom validity message and returns boolean
  function validateEmail() {
    email.setCustomValidity(''); // reset
    const val = String(email.value || '').trim();

    if (!val) {
      email.setCustomValidity('Please enter your email address.');
      email.setAttribute('aria-invalid', 'true');
      return false;
    }

    if (!emailRegex.test(val)) {
      email.setCustomValidity('Please enter a valid email address (e.g. name@domain.com).');
      email.setAttribute('aria-invalid', 'true');
      return false;
    }

    email.setAttribute('aria-invalid', 'false');
    return true;
  }

  // Validate password — sets custom validity and returns boolean
  function validatePassword() {
    password.setCustomValidity(''); // reset
    const val = String(password.value || '');
    const minLen = getPasswordMinLength();

    if (!val) {
      password.setCustomValidity('Please enter your password.');
      password.setAttribute('aria-invalid', 'true');
      return false;
    }

    if (val.length < minLen) {
      password.setCustomValidity(`Password must be at least ${minLen} characters long.`);
      password.setAttribute('aria-invalid', 'true');
      return false;
    }

    if (!passwordAllowedRegex.test(val)) {
      password.setCustomValidity('Password may only include letters, digits, and symbols (no spaces).');
      password.setAttribute('aria-invalid', 'true');
      return false;
    }

    // OPTIONAL EXTRA RULES (uncomment to enforce)
    // require at least one letter and one digit:
    // if (!/[A-Za-z]/.test(val) || !/[0-9]/.test(val)) {
    //   password.setCustomValidity('Password must include at least one letter and one digit.');
    //   password.setAttribute('aria-invalid', 'true');
    //   return false;
    // }

    password.setAttribute('aria-invalid', 'false');
    return true;
  }

  // Update the submit button disabled state
  function updateSubmitState() {
    const eValid = validateEmail();
    const pValid = validatePassword();
    submitBtn.disabled = !(eValid && pValid);
  }

  // Attempt to populate remembered email
  try {
    const saved = localStorage.getItem('rememberedEmail');
    if (saved) {
      email.value = saved;
      remember.checked = true;
    }
  } catch (err) {
    // ignore localStorage errors (private mode)
    console.debug('localStorage error', err);
  }

  // Wire input events for live validation
  email.addEventListener('input', () => {
    // trim and keep caret behavior — we only validate value
    validateEmail();
    updateSubmitState();
  });

  password.addEventListener('input', () => {
    validatePassword();
    updateSubmitState();
  });

  // Run initial state update (in case fields were prefilled)
  updateSubmitState();

  // Form submit handler — prevents submit if invalid and shows built-in messages
  form.addEventListener('submit', (ev) => {
    // Re-validate (in case something changed)
    const eValid = validateEmail();
    const pValid = validatePassword();

    if (!eValid || !pValid) {
      ev.preventDefault();
      // Focus and show validity for the first invalid field
      const firstInvalid = !eValid ? email : password;
      // Use reportValidity to trigger browser-native UI
      firstInvalid.reportValidity();
      firstInvalid.focus();
      return;
    }

    // Save/clear remembered email and allow normal submission
    try {
      if (remember.checked) {
        localStorage.setItem('rememberedEmail', email.value.trim());
      } else {
        localStorage.removeItem('rememberedEmail');
      }
    } catch (err) {
      // ignore localStorage errors
      console.debug('localStorage error', err);
    }

    // Let browser proceed (do not call preventDefault)
    // If you want to show in-page processing state, disable the button here:
    // submitBtn.disabled = true;
  });

  // Prevent placeholder social anchors from navigating
  document.querySelectorAll('.socials a').forEach(a => {
    a.addEventListener('click', (ev) => ev.preventDefault());
  });
});
