function togglePassword() {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.getElementById('passwordIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        passwordIcon.className = 'fas fa-eye';
    }
}

document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    // Reset any previous custom validity
    email.setCustomValidity('');
    password.setCustomValidity('');

    // Validate email
    if (!email.value) {
        email.setCustomValidity('Please enter your email address.');
        isValid = false;
    } else if (!email.validity.valid) {
        email.setCustomValidity('Please enter a valid email address.');
        isValid = false;
    }

    // Validate password
    if (!password.value) {
        password.setCustomValidity('Please enter a password.');
        isValid = false;
    } else if (password.value.length < 6) {
        password.setCustomValidity('Password must be at least 6 characters long.');
        isValid = false;
    }

    // Show validation messages
    if (!isValid) {
        email.reportValidity();
        if (email.validity.valid) {
            password.reportValidity();
        }
        return;
    }

    // If validation passes, redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Clear custom validity on input
document.getElementById('email').addEventListener('input', function() {
    this.setCustomValidity('');
});

document.getElementById('password').addEventListener('input', function() {
    this.setCustomValidity('');
});